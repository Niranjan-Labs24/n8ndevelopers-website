import type { MetadataRoute } from 'next'
import { designRoutes } from '@/lib/design-pages'

export const revalidate = 3600

const baseUrl = 'https://www.n8ndevelopers.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  // The marketing sitemap remains available without initializing the blog CMS.
  // Preserve dynamic blog entries whenever the existing CMS is configured.
  const posts = process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN
    ? (await (await import('@/lib/contentful')).contentfulService.getAllPosts(1, 500)).posts
    : []

  const routes = [...designRoutes, '/blogs', '/join-developer']

  const staticPages: MetadataRoute.Sitemap = routes.map((route) => ({
    url: route === '/' ? baseUrl : `${baseUrl}${route}`,
    changeFrequency: route === '/blogs' ? 'hourly' : 'monthly',
    priority: route === '/' ? 1 : 0.8,
  }))

  // Dynamic blog post pages — auto-generated from Contentful
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => {
    const updatedAt = (post.sys as { updatedAt?: string }).updatedAt
    return {
      url: `${baseUrl}/blogs/${encodeURIComponent(post.fields.slug)}`,
      ...(updatedAt && !Number.isNaN(Date.parse(updatedAt))
        ? { lastModified: new Date(updatedAt) }
        : {}),
      changeFrequency: 'hourly',
      priority: 0.6,
    }
  })

  return [...staticPages, ...blogPages]
}
