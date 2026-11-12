# Website design-system revamp

The supplied “n8n Developers Design System 1.zip” is implemented in the existing Next.js 15 / TypeScript application. No hosting, deployment, repository remote, or dependency versions were changed.

## Scope

Twenty marketing pages share the new cream/orange visual system, local fonts, supplied icons, announcement, navigation and footer. This includes home, about, services, pricing, contact, partners, customer stories, forward deployed engineers, seven industry pages, and four comparison pages. Titles, descriptions, canonical URLs and structured data accompany each page.

`content/site-pages.json` contains versioned copy, markup, page-specific styles and structured data extracted from the supplied reference. `components/design/page.tsx` renders this trusted content on the server, with scoped React interaction handlers. It does not accept runtime HTML from visitors. Shared components and all App Router routes are TypeScript/TSX. `styles/design` is scoped to `.revamp-site`.

The existing blog pages and `lib/contentful.ts` are unchanged. Marketing navigation links to the existing https://www.n8ndevelopers.com/blogs. Local blog routes retain the original header, footer, promotions and theme through `components/legacy` and `SiteShell`; the join-developer page also retains its existing shell.

## Review behavior

- Responsive navigation includes an industry dropdown and an accessible mobile menu.
- FAQs, lifecycle selection, service filters, backlog filters and section navigation are interactive.
- The booking card embeds the existing Cal.com scheduler using its official React SDK. Cal.com supplies live availability, timezone selection and confirmation; the sample calendar/time-slot controls were removed. The original direct booking link remains available if the embed cannot load.
- Contact and partner forms validate fields and open an email draft to the existing published contact, sasha.ray@n8ndevelopers.com. They do not claim that a message was sent. No new mail or CRM delivery endpoint was added.
- The reference's video upload/editor controls were replaced with a process overview because no explainer-video asset was supplied.
- Source photography/client logos remain referenced. When unavailable, a local branded illustration or client-name wordmark renders instead. Fonts, supplied artwork, technology logos and flags are local, with licenses retained.

## Validation

Run `npm ci`, then `npm run dev -- --hostname 0.0.0.0` from the repository root.

The marketing routes were checked at desktop and 390px mobile widths, including metadata, internal links, FAQs, navigation, filters, the booking embed integration and fallback, and form validation. Type checking: `npx --no-install tsc --noEmit --incremental false`.

A full production build also loads the existing blog module. The unchanged CMS module requires real `CONTENTFUL_SPACE_ID` and `CONTENTFUL_ACCESS_TOKEN` settings; do not use invented values to bypass this requirement. Those credentials are absent in the review environment. No live form was submitted and nothing was pushed to GitHub.
