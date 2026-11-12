import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { contentfulService, isContentfulConfigured } from '@/lib/contentful';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const slug = searchParams.get('slug');

    // An unconfigured preview must not crash route import or enable draft mode.
    const previewSecret = process.env.CONTENTFUL_PREVIEW_SECRET;
    if (!previewSecret || !isContentfulConfigured(true)) {
        return new Response('Blog preview is not configured.', {
            status: 503,
            headers: { 'Cache-Control': 'no-store' },
        });
    }

    // 1. Check the secret
    if (secret !== previewSecret) {
        return new Response('Invalid token', { status: 401 });
    }

    if (!slug) {
        return new Response('Missing slug', { status: 401 });
    }

    // 2. Fetch the post by slug in preview mode to verify it exists
    const post = await contentfulService.getPostBySlug(slug, true);

    if (!post) {
        return new Response('Post not found', { status: 404 });
    }

    // 3. Enable Draft Mode
    const draft = await draftMode();
    draft.enable();

    // 4. Redirect to the blog page
    redirect(`/blogs/${slug}`);
}
