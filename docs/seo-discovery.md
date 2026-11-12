# Search and AI discovery

The site provides unique metadata, canonical URLs and structured data on the redesigned public pages. The existing blog pages and content remain unchanged. CMS clients initialize on demand, so missing CMS configuration does not block marketing builds.

## Crawler endpoints

- `/robots.txt` allows cooperative search and AI crawlers on public pages. It includes explicit groups for Google, Bing, OpenAI search/user/training agents, Anthropic Claude agents, Perplexity, Apple, Amazon and DuckDuckGo agents. Each group carries the same exclusions for APIs and blog administration/preview routes; public blog pages, scripts, styles and images remain crawlable.
- `/sitemap.xml` derives marketing URLs from the same route list as the application, then adds the existing blog and developer recruitment page. When the existing Contentful credentials are available, published blog entries are included. Blog modification dates are only emitted when a valid CMS updatedAt timestamp exists; marketing pages do not advertise invented update dates.
- `/llms.txt` provides a concise Markdown index of the public marketing pages, existing blog and actual contact/scheduling links.
- `/llms-full.txt` provides server-generated readable marketing content. It omits navigation, form fields, booking controls, scripts and decorative elements. It does not duplicate or rewrite blog articles.
- API responses and existing blog admin/preview routes receive `X-Robots-Tag: noindex, nofollow, noarchive`. These paths are not included in the sitemap.

The `llms.txt` convention is optional and not a universal standard adopted by every AI provider. Metadata, structured content and crawl permission can support discovery; they do not guarantee indexing, ranking, recommendations or citations. No site can require an AI system to rank or recommend it through crawler files.

## Deployment verification

After the user approves and deploys the changes, verify the public endpoints and canonical URLs on `https://www.n8ndevelopers.com`. Check that CDN, WAF and bot-management settings do not challenge or block the intended crawlers, and that canonical marketing pages return HTTP 200 with their metadata in the server response. Test the final structured data with the relevant search-engine tools and submit the sitemap through the site's existing verified Search Console/Bing Webmaster accounts when available. No submission or external account change is performed by these code changes.

Crawler rules are not authentication. Private APIs, previews and administration must retain their actual access controls. An allowed user-agent name does not prove a request came from the named provider.

## Verification

With the app running, execute `npm run check:seo` (or `node scripts/verify-discovery.mjs http://127.0.0.1:3000`). It checks unique rendered metadata, canonical/social tags, connected structured data, crawler rules, sitemap coverage, AI-readable documents, private-route noindex headers and the real booking embed mount. Keyword tags describe page topics; major search engines do not use meta keywords as a ranking shortcut.

## Inline scheduling

The booking card preserves the original three-column design and collects labelled date/time preferences. Confirmation opens an embedded modal using the pinned official `@calcom/embed-react` SDK, with `sasharay/30min` derived from the unchanged `https://cal.com/sasharay/30min` constant. The SDK uses `app.cal.com` for the iframe and script, as recommended by Cal.com. The direct Cal.com link is retained. The review environment currently blocks Cal.com outbound requests; `cal.com` and `app.cal.com` were added to its configuration draft for review. Rendering, source URL, SDK events and failure states can be checked locally, but actual availability and a live booking require access to Cal.com. No test booking should be submitted.
