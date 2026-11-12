import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { JSDOM } from 'jsdom'

// Run against a locally running app: node scripts/verify-discovery.mjs [base URL].
const base = process.argv[2] || 'http://127.0.0.1:3000'
const pages = JSON.parse(await readFile(new URL('../content/site-pages.json', import.meta.url), 'utf8'))
const seo = JSON.parse(await readFile(new URL('../content/page-seo.json', import.meta.url), 'utf8'))
const descriptions = new Set()
for (const [route, page] of Object.entries(pages)) {
  const response = await fetch(new URL(route, base), { headers: { 'User-Agent': 'Googlebot' } })
  assert.equal(response.status, 200, route)
  const document = new JSDOM(await response.text()).window.document
  assert.equal(document.title, page.title, `title: ${route}`)
  assert.equal(document.querySelectorAll('meta[name="description"]').length, 1, route)
  assert.equal(document.querySelector('meta[name="description"]')?.content, seo[route].description, route)
  assert(!descriptions.has(seo[route].description), `duplicate description: ${route}`)
  descriptions.add(seo[route].description)
  assert.equal(document.querySelector('link[rel="canonical"]')?.href, `https://www.n8ndevelopers.com${route}`, route)
  assert(document.querySelector('meta[name="keywords"]')?.content, `keyword tags: ${route}`)
  assert.match(document.querySelector('meta[name="robots"]')?.content || '', /index, follow/, route)
  assert.equal(document.querySelector('meta[property="og:description"]')?.content, seo[route].description, route)
  assert.equal(document.querySelector('meta[name="twitter:description"]')?.content, seo[route].description, route)
  const graphs = [...document.querySelectorAll('script[type="application/ld+json"]')].map(script => JSON.parse(script.textContent))
  assert.equal(graphs.length, 1, `one connected graph: ${route}`)
  const graph = graphs[0]['@graph']
  assert(graph.some(node => node['@type'] === 'WebSite'), route)
  assert(graph.some(node => node['@type'] === 'BreadcrumbList'), route)
  assert(graph.some(node => node['@id'] === `https://www.n8ndevelopers.com${route}#webpage`), route)
  assert.equal(document.querySelectorAll('h1').length, 1, route)
  if (route === '/') {
    assert(document.querySelector('#book .bk-original'), 'booking rendered in source design section')
    assert(document.querySelector('#book .bk-cal .days') && document.querySelector('#book .bk-time .slots'), 'original calendar and time columns')
    assert(document.querySelector('#book a[href="https://cal.com/sasharay/30min"]'), 'same Cal booking link')
  }
}
const robotsResponse = await fetch(new URL('/robots.txt', base))
assert.equal(robotsResponse.status, 200)
const robots = await robotsResponse.text()
for (const agent of ['*', 'OAI-SearchBot', 'ChatGPT-User', 'GPTBot', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Googlebot', 'Bingbot']) assert(robots.includes(`User-Agent: ${agent}`), agent)
for (const group of robots.split(/\n\s*\n/).filter(group => group.includes('User-Agent:'))) {
  for (const path of ['/api/', '/blogs/admin', '/blogs/preview']) assert(group.includes(`Disallow: ${path}`), path)
  assert(group.includes('Allow: /'), 'public pages crawlable')
}
assert(robots.includes('Sitemap: https://www.n8ndevelopers.com/sitemap.xml'))
const sitemap = await (await fetch(new URL('/sitemap.xml', base))).text()
for (const route of [...Object.keys(pages), '/blogs', '/join-developer']) assert(sitemap.includes(`<loc>https://www.n8ndevelopers.com${route === '/' ? '' : route}</loc>`), `sitemap: ${route}`)
assert(!sitemap.includes('/blogs/admin'))
for (const route of ['/llms.txt', '/llms-full.txt']) {
  const response = await fetch(new URL(route, base))
  assert.equal(response.status, 200, route)
  assert.match(response.headers.get('content-type'), /text\/(plain|markdown)/)
  const body = await response.text()
  for (const marketing of Object.keys(pages)) assert(body.includes(`https://www.n8ndevelopers.com${marketing}`), `${route}: ${marketing}`)
  assert(!body.includes('<script'), 'no executable scripts in discovery text')
  if (route === '/llms.txt') assert(body.includes('https://cal.com/sasharay/30min'))
}
const privateResponse = await fetch(new URL('/api/_seo-header-probe', base), { method: 'HEAD' })
assert.match(privateResponse.headers.get('x-robots-tag') || '', /noindex/)
console.log(`Passed: ${Object.keys(pages).length} page metadata/graphs, crawler rules, sitemap, AI-readable endpoints, booking markup and private-route headers.`)
