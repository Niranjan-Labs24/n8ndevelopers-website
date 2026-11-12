import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import test from 'node:test'
import ts from 'typescript'

// Isolated module fixtures: no real environment, credentials, CMS requests or draft cookies.
function loadModule(relativePath, mocks, environment = {}) {
  const filename = fileURLToPath(new URL(`../${relativePath}`, import.meta.url))
  const source = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
    fileName: filename,
  }).outputText
  const module = { exports: {} }
  const errors = []
  const bindings = { ...environment }
  vm.runInNewContext(source, {
    module,
    exports: module.exports,
    require(name) {
      assert.ok(Object.hasOwn(mocks, name), `Unexpected module dependency: ${name}`)
      return mocks[name]
    },
    process: { env: bindings, on() {} },
    console: { error(...args) { errors.push(args) }, warn() {}, log() {} },
    Response,
    URL,
  }, { filename })
  return { exports: module.exports, errors, environment: bindings }
}

function loadCms(environment = {}, resolveEntries = async () => ({ total: 0, items: [] })) {
  const clients = []
  const queries = []
  const loaded = loadModule('lib/contentful.ts', {
    contentful: {
      createClient(options) {
        const configuration = structuredClone(options)
        clients.push(configuration)
        return {
          async getEntries(query) {
            queries.push({ configuration, query: structuredClone(query) })
            return resolveEntries(query, configuration)
          },
        }
      },
    },
  }, environment)
  return { ...loaded, clients, queries }
}

const deliveryEnvironment = {
  CONTENTFUL_SPACE_ID: 'test-space-fixture',
  CONTENTFUL_ACCESS_TOKEN: 'test-delivery-token-fixture',
}
const post = { sys: { id: 'test-post' }, fields: { slug: 'draft-story', title: 'Test story' } }
const plain = value => JSON.parse(JSON.stringify(value))

test('import and public queries remain safe without CMS configuration', async () => {
  for (const environment of [{}, { CONTENTFUL_SPACE_ID: 'test-space-fixture' }, { CONTENTFUL_ACCESS_TOKEN: 'test-delivery-token-fixture' }]) {
    const cms = loadCms(environment)
    assert.equal(cms.clients.length, 0, 'import must not initialize the SDK')
    assert.equal(cms.exports.isContentfulConfigured(), false)
    assert.deepEqual(plain(await cms.exports.contentfulService.getAllPosts()), { posts: [], totalPages: 0, total: 0 })
    assert.equal(await cms.exports.contentfulService.getPostBySlug('draft-story'), null)
    assert.deepEqual(plain(await cms.exports.contentfulService.getAdjacentPosts('2026-01-01')), { prev: null, next: null })
    assert.equal(cms.clients.length, 0, 'missing configuration must not create a client with placeholder values')
    assert.equal(cms.queries.length, 0)
  }
})

test('configuration is resolved on request after an unconfigured build-time import', async () => {
  const cms = loadCms({}, async () => ({ total: 1, items: [post] }))
  assert.equal(cms.exports.isContentfulConfigured(), false)
  assert.equal(cms.clients.length, 0)
  Object.assign(cms.environment, deliveryEnvironment)
  assert.equal(cms.exports.isContentfulConfigured(), true)
  assert.deepEqual(plain(await cms.exports.contentfulService.getAllPosts()), { posts: [post], totalPages: 1, total: 1 })
  assert.equal(cms.clients.length, 1)
  assert.equal(cms.clients[0].space, deliveryEnvironment.CONTENTFUL_SPACE_ID)
})

test('delivery configuration stays lazy and preserves pagination, filtering and client caching', async () => {
  const cms = loadCms(deliveryEnvironment, async () => ({ total: 9, items: [post] }))
  assert.equal(cms.exports.isContentfulConfigured(), true)
  assert.equal(cms.clients.length, 0, 'even a configured import must not initialize the SDK')
  const result = await cms.exports.contentfulService.getAllPosts(3, 4, 'Finance')
  assert.deepEqual(plain(result), { posts: [post], totalPages: 3, total: 9 })
  await cms.exports.contentfulService.getAllPosts()
  assert.equal(cms.clients.length, 1, 'reuse the delivery client between requests')
  assert.equal(cms.clients[0].space, deliveryEnvironment.CONTENTFUL_SPACE_ID)
  assert.equal(cms.clients[0].accessToken, deliveryEnvironment.CONTENTFUL_ACCESS_TOKEN)
  assert.ok(!cms.clients[0].host || cms.clients[0].host === 'cdn.contentful.com')
  assert.equal(cms.queries[0].query.content_type, 'blogPost')
  assert.equal(cms.queries[0].query.skip, 8)
  assert.equal(cms.queries[0].query.limit, 4)
  assert.equal(cms.queries[0].query['fields.tags[match]'], 'Finance')
  assert.deepEqual(cms.queries[0].query.order, ['-fields.date'])
})

test('preview uses its own token and host and falls back to the existing delivery token', async () => {
  for (const explicitPreviewToken of [false, true]) {
    const environment = { ...deliveryEnvironment, ...(explicitPreviewToken ? { CONTENTFUL_PREVIEW_ACCESS_TOKEN: 'test-preview-token-fixture' } : {}) }
    const cms = loadCms(environment, async () => ({ total: 1, items: [post] }))
    assert.equal(cms.exports.isContentfulConfigured(true), true)
    await cms.exports.contentfulService.getAllPosts(1, 10, undefined, true)
    await cms.exports.contentfulService.getPostBySlug('draft-story', true)
    assert.equal(cms.clients.length, 1)
    assert.equal(cms.clients[0].host, 'preview.contentful.com')
    assert.equal(cms.clients[0].accessToken, explicitPreviewToken ? environment.CONTENTFUL_PREVIEW_ACCESS_TOKEN : environment.CONTENTFUL_ACCESS_TOKEN)
    await cms.exports.contentfulService.getAllPosts()
    assert.equal(cms.clients.length, 2, 'preview and delivery clients must remain separate')
  }
})

test('configured slug normalization and adjacent-post ordering are preserved', async () => {
  const previous = { ...post, sys: { id: 'previous' } }
  const next = { ...post, sys: { id: 'next' } }
  const cms = loadCms(deliveryEnvironment, async query => {
    if (query['fields.date[lt]']) return { total: 1, items: [previous] }
    if (query['fields.date[gt]']) return { total: 1, items: [next] }
    if (query.select) return { total: 1, items: [{ fields: { slug: 'An—Example' } }] }
    return { total: query['fields.slug'] === 'An—Example' ? 1 : 0, items: query['fields.slug'] === 'An—Example' ? [post] : [] }
  })
  assert.deepEqual(plain(await cms.exports.contentfulService.getPostBySlug('AN-EXAMPLE')), post)
  assert.equal(cms.queries[0].query['fields.slug'], 'AN-EXAMPLE')
  assert.equal(cms.queries[2].query['fields.slug'], 'An—Example')
  assert.deepEqual(plain(await cms.exports.contentfulService.getAdjacentPosts('2026-01-01')), { prev: previous, next })
  assert.deepEqual(cms.queries[3].query.order, ['-fields.date'])
  assert.deepEqual(cms.queries[4].query.order, ['fields.date'])
})

function loadPreview({ configured = true, secret = 'test-preview-secret-fixture', found = post } = {}) {
  const calls = { lookups: [], draft: 0, redirects: [] }
  const { exports } = loadModule('app/api/preview/route.ts', {
    'next/headers': { async draftMode() { return { enable() { calls.draft++ } } } },
    'next/navigation': { redirect(path) { calls.redirects.push(path); throw new Error('test-next-redirect') } },
    '@/lib/contentful': {
      isContentfulConfigured() { return configured },
      contentfulService: { async getPostBySlug(...args) { calls.lookups.push(args); return found } },
    },
  }, secret ? { CONTENTFUL_PREVIEW_SECRET: secret } : {})
  return { calls, GET: exports.GET }
}

const request = query => new Request(`https://example.test/api/preview${query}`)

test('preview fails closed with 503 when CMS or preview secret is absent', async () => {
  for (const settings of [{ configured: false }, { secret: '' }]) {
    const route = loadPreview(settings)
    const response = await route.GET(request('?slug=draft-story'))
    assert.equal(response.status, 503)
    assert.equal(response.headers.get('cache-control'), 'no-store')
    assert.equal(route.calls.lookups.length, 0)
    assert.equal(route.calls.draft, 0)
    assert.equal(route.calls.redirects.length, 0)
  }
})

test('configured preview rejects invalid secrets before requesting content', async () => {
  const route = loadPreview()
  const response = await route.GET(request('?secret=wrong-test-fixture&slug=draft-story'))
  assert.equal(response.status, 401)
  assert.equal(route.calls.lookups.length, 0)
  assert.equal(route.calls.draft, 0)
})

test('configured preview returns 404 for an unknown post and preserves authorized draft redirect', async () => {
  const missing = loadPreview({ found: null })
  const missingResponse = await missing.GET(request('?secret=test-preview-secret-fixture&slug=unknown'))
  assert.equal(missingResponse.status, 404)
  assert.equal(missing.calls.draft, 0)
  const valid = loadPreview()
  await assert.rejects(valid.GET(request('?secret=test-preview-secret-fixture&slug=draft-story')), /test-next-redirect/)
  assert.deepEqual(plain(valid.calls.lookups), [['draft-story', true]])
  assert.equal(valid.calls.draft, 1)
  assert.deepEqual(valid.calls.redirects, ['/blogs/draft-story'])
})
