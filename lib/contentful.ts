/// <reference types="node" />
import { createClient, type Entry, type Asset } from 'contentful';

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
const PREVIEW_ACCESS_TOKEN = process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN;

if (!SPACE_ID || !ACCESS_TOKEN) {
    // console.warn('Contentful environment variables missing');
}

export const contentfulClient = createClient({
    space: SPACE_ID || '',
    accessToken: ACCESS_TOKEN || '',
});

export const previewClient = createClient({
    space: SPACE_ID || '',
    accessToken: PREVIEW_ACCESS_TOKEN || ACCESS_TOKEN || '',
    host: 'preview.contentful.com',
});

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


export class ContentfulService {
    private getClient(preview = false) {
        return preview ? previewClient : contentfulClient;
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
            };

            if (tag && tag !== 'All') {
                query['fields.tags[in]'] = tag;
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
            const response = await client.getEntries<any>({
                content_type: 'blogPost',
                'fields.slug': slug,
                limit: 1,
                include: 10,
            });

            if (response.items && response.items.length > 0) {
                return response.items[0] as unknown as BlogPost;
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
