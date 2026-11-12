/// <reference types="node" />
import { createClient, type Asset } from 'contentful';

// Suppress Node.js DEP0169 url.parse deprecation warning emitted by internal Contentful SDK / axios dependencies in Node 22+
if (typeof process !== 'undefined' && typeof process.on === 'function') {
    process.on('warning', (warning: any) => {
        if (warning && (warning.code === 'DEP0169' || warning.name === 'DeprecationWarning')) {
            if (warning.message && warning.message.includes('url.parse')) {
                return;
            }
        }
    });
}

export function isContentfulConfigured(preview = false): boolean {
    const token = preview
        ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN || process.env.CONTENTFUL_ACCESS_TOKEN
        : process.env.CONTENTFUL_ACCESS_TOKEN;
    return Boolean(process.env.CONTENTFUL_SPACE_ID && token);
}

type ContentfulClient = ReturnType<typeof createClient>;
let contentfulClient: ContentfulClient | undefined;
let previewClient: ContentfulClient | undefined;

// Route modules are imported during `next build`. Initialize the CMS only when
// content is requested so an optional integration cannot prevent deployment.
function getContentfulClient(preview: boolean): ContentfulClient {
    const space = process.env.CONTENTFUL_SPACE_ID;
    const accessToken = preview
        ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN || process.env.CONTENTFUL_ACCESS_TOKEN
        : process.env.CONTENTFUL_ACCESS_TOKEN;
    if (!space || !accessToken) {
        throw new Error('Contentful is not configured. Set CONTENTFUL_SPACE_ID and the appropriate Contentful access token to load blog content.');
    }
    if (preview) {
        return previewClient ??= createClient({ space, accessToken, host: 'preview.contentful.com' });
    }
    return contentfulClient ??= createClient({ space, accessToken });
}

export interface BlogPost {
    sys: {
        id: string;
        createdAt: string;
    };
    fields: {
        title: string;
        slug: string;
        date: string;
        author: string;
        excerpt: string;
        content: any; // Rich Text object
        featuredImage: Asset;
        tags?: string[];
        faq?: Array<{
            fields: {
                question: string;
                answer: string;
            };
        }>;
    };
}

function normalizeSlug(s: string): string {
    if (!s) return '';
    try {
        s = decodeURIComponent(s);
    } catch (e) {}
    return s
        .toLowerCase()
        .replace(/[\u2014\u2013]/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export class ContentfulService {
    private getClient(preview = false) {
        return getContentfulClient(preview);
    }

    async getAllPosts(page = 1, perPage = 10, tag?: string, preview = false): Promise<{
        posts: BlogPost[];
        totalPages: number;
        total: number;
    }> {
        try {
            const client = this.getClient(preview);
            const query: any = {
                content_type: 'blogPost',
                skip: (page - 1) * perPage,
                limit: perPage,
                order: ['-fields.date'],
                select: ['fields.title', 'fields.slug', 'fields.date', 'fields.author', 'fields.excerpt', 'fields.featuredImage', 'fields.tags'],
            };

            if (tag && tag !== 'All') {
                query['fields.tags[match]'] = tag;
            }

            const response = await client.getEntries<any>(query);

            const total = response.total;
            const totalPages = Math.ceil(total / perPage);

            return {
                posts: response.items as unknown as BlogPost[],
                totalPages,
                total,
            };
        } catch (error: any) {
            console.error('Error fetching Contentful posts:', error);
            return {
                posts: [],
                totalPages: 0,
                total: 0,
            };
        }
    }

    async getPostBySlug(slug: string, preview = false): Promise<BlogPost | null> {
        try {
            const client = this.getClient(preview);
            // 1. Try exact slug match first
            const response = await client.getEntries<any>({
                content_type: 'blogPost',
                'fields.slug': slug,
                limit: 1,
                include: 10,
            });

            if (response.items && response.items.length > 0) {
                return response.items[0] as unknown as BlogPost;
            }

            // 2. Fallback: Normalized slug match (handling special chars, em-dashes, encodings)
            const targetNormalized = normalizeSlug(slug);
            if (targetNormalized) {
                const allEntries = await client.getEntries<any>({
                    content_type: 'blogPost',
                    limit: 100,
                    select: ['fields.slug'],
                });
                const match = allEntries.items.find((item: any) => 
                    normalizeSlug(item.fields?.slug) === targetNormalized
                );
                if (match?.fields?.slug) {
                    const matchedResponse = await client.getEntries<any>({
                        content_type: 'blogPost',
                        'fields.slug': String(match.fields.slug),
                        limit: 1,
                        include: 10,
                    });
                    if (matchedResponse.items && matchedResponse.items.length > 0) {
                        return matchedResponse.items[0] as unknown as BlogPost;
                    }
                }
            }

            return null;
        } catch (error) {
            console.error(`Error fetching Contentful post with slug ${slug}:`, error);
            return null;
        }
    }

    async getAdjacentPosts(date: string, preview = false): Promise<{ prev: BlogPost | null; next: BlogPost | null }> {
        try {
            const client = this.getClient(preview);
            // Get previous post (older than current date)
            const prevResponse = await client.getEntries<any>({
                content_type: 'blogPost',
                'fields.date[lt]': date,
                order: ['-fields.date'],
                limit: 1,
            });

            // Get next post (newer than current date)
            const nextResponse = await client.getEntries<any>({
                content_type: 'blogPost',
                'fields.date[gt]': date,
                order: ['fields.date'],
                limit: 1,
            });

            return {
                prev: (prevResponse.items[0] as unknown as BlogPost) || null,
                next: (nextResponse.items[0] as unknown as BlogPost) || null,
            };
        } catch (error) {
            console.error('Error fetching adjacent Contentful posts:', error);
            return { prev: null, next: null };
        }
    }

}

export const contentfulService = new ContentfulService();
