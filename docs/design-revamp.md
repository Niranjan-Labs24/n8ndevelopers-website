# Website design-system revamp

The supplied “n8n Developers Design System 1.zip” is implemented in the existing Next.js 15 / TypeScript application. No hosting, deployment, repository remote, or dependency versions were changed.

## Scope

Twenty marketing pages share the new cream/orange visual system, local fonts, supplied icons, announcement, navigation and footer. This includes home, about, services, pricing, contact, partners, customer stories, forward deployed engineers, seven industry pages, and four comparison pages. Titles, descriptions, canonical URLs and structured data accompany each page.

`content/site-pages.json` contains versioned copy, markup, page-specific styles and structured data extracted from the supplied reference. `components/design/page.tsx` renders this trusted content on the server, with scoped React interaction handlers. It does not accept runtime HTML from visitors. Shared components and all App Router routes are TypeScript/TSX. `styles/design` is scoped to `.revamp-site`.

The existing blog pages, content and design are unchanged. Contentful clients initialize lazily when content is requested, so missing CMS configuration does not prevent the marketing site from building. Marketing navigation links to the existing https://www.n8ndevelopers.com/blogs. Local blog routes retain the original header, footer, promotions and theme through `components/legacy` and `SiteShell`; the join-developer page also retains its existing shell.

## Review behavior

- Responsive navigation includes an industry dropdown and an accessible mobile menu.
- FAQs, lifecycle selection, service filters, backlog filters and section navigation are interactive.
- The booking card matches the supplied three-column HTML: cream process-review panel, month calendar and time-selection panel. Its native controls collect a clearly labelled date/time preference; they do not claim live availability or a confirmed booking. Continuing opens the same Cal.com scheduler inside a modal using the official React SDK, prefilled with the selected date and local timezone, with the preferred time shown above it. Cal.com supplies live availability and confirmation. Users can also open the scheduler without a preference, or follow the original direct link if the embed cannot load.
- Contact and partner forms validate fields and open an email draft to the existing published contact, sasha.ray@n8ndevelopers.com. They do not claim that a message was sent. No new mail or CRM delivery endpoint was added.
- The reference's video upload/editor controls were replaced with a process overview because no explainer-video asset was supplied.
- Source photography/client logos remain referenced. When unavailable, a local branded illustration or client-name wordmark renders instead. Fonts, supplied artwork, technology logos and flags are local, with licenses retained.

## Validation

Deployment uses pnpm. Reproduce its dependency graph with `pnpm install --frozen-lockfile`, then run `pnpm exec tsc --noEmit --incremental false` and `pnpm run build`. For local development, use `pnpm run dev --hostname 0.0.0.0`. npm remains supported through `npm ci`.

`react-resizable-panels` is pinned to 3.0.3 in the manifest and both lockfiles. Its wrappers use the v3 `PanelGroup` / `PanelResizeHandle` API; a check against a different npm resolution does not verify the deployment graph.

The marketing routes were checked at desktop and 390px mobile widths, including metadata, internal links, FAQs, navigation, filters, the booking embed integration and fallback, and form validation. Type checking: `npx --no-install tsc --noEmit --incremental false`. CMS regression checks: `node --test scripts/test-contentful.mjs`.

A production build can complete without CMS credentials. To load the existing blog posts, configure real `CONTENTFUL_SPACE_ID` and `CONTENTFUL_ACCESS_TOKEN` values in the hosting environment; do not invent placeholder values. The existing service fallbacks handle missing configuration without changing blog UI or supplying fabricated posts. The preview API returns an uncached HTTP 503 when CMS configuration or `CONTENTFUL_PREVIEW_SECRET` is missing, and retains secret validation and draft-mode behavior when configured. `CONTENTFUL_PREVIEW_ACCESS_TOKEN` can be supplied for draft content; the existing delivery-token fallback is retained. No live form was submitted during validation.
