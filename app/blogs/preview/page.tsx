import Link from 'next/link';
import { contentfulService } from '@/lib/contentful';
import BlogCard from '@/components/blog/BlogCard';

export const revalidate = 0; // Disable cache for this page

export default async function PreviewDashboard() {
  
  const { posts } = await contentfulService.getAllPosts(1, 10, undefined, true);


  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Drafts Preview Dashboard</h1>
        <p className="text-gray-600">
          Click on any draft to preview it.
        </p>
        <div className="mt-4">
            <Link href="/blogs" className="text-blue-500 hover:underline">
                View Published Blogs
            </Link>
        </div>
      </header>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No posts found in preview.</p>
          <p className="text-sm text-gray-400 mt-2">
            Make sure you have posts in Contentful.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post.sys.id} className="relative group">
                <Link 
                    href={`/api/preview?secret=${process.env.CONTENTFUL_PREVIEW_SECRET}&slug=${post.fields.slug}`}
                    className="block h-full"
                >
                    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full bg-white">
                        {post.fields.featuredImage?.fields?.file?.url && (
                            <div className="aspect-video relative overflow-hidden bg-gray-100">
                                <img 
                                    src={`https:${post.fields.featuredImage.fields.file.url}`} 
                                    alt={post.fields.title}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        )}
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                                {post.fields.title}
                            </h2>
                            <div className="text-gray-600 line-clamp-3 text-sm">
                                {post.fields.excerpt}
                            </div>
                            <div className="mt-4 text-xs text-gray-400 uppercase tracking-wide font-semibold">
                                Status: Contentful Preview
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
