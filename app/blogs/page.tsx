import { Metadata } from 'next';
import { contentfulService } from '@/lib/contentful';
import BlogCard from '@/components/blog/BlogCard';
import Pagination from '@/components/blog/Pagination';
import PromotionBanner from '@/components/blog/PromotionBanner';

import BlogFilter from '@/components/blog/BlogFilter';

export const metadata: Metadata = {
  title: 'n8n Automation Blogs | Workflow & API Insights',
  description: 'Read the latest insights on n8n automation, API integrations, and workflow development. Our experts share tutorials and news to help you scale your business with n8n.',
  keywords: 'n8n blog, n8n automation, workflow automation, n8n tutorials, API integration',
  alternates: {
    canonical: '/blogs',
  },
};

export const revalidate = 3600; 

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    type?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1');
  const currentTag = params.type || 'All';
  
  const { posts, totalPages } = await contentfulService.getAllPosts(
    currentPage, 
    6, 
    currentTag
  );

  const paginationBaseUrl = currentTag === 'All' 
    ? '/blogs' 
    : `/blogs?type=${currentTag}`;

  return (
    <div className="flex flex-col pt-12">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center mb-16 md:mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-black leading-tight mb-6">
          Latest <span className="text-[#FF7A59]">blog</span> posts
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium">
          Insights, tutorials, and the latest news from the n8n developers team
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <BlogFilter currentTag={currentTag} />
      </div>

      {posts.length > 0 ? (
        <>
          {/* Blog Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 mb-8 md:mb-12">
              {posts.map((post, index) => (
                <BlogCard 
                  key={post.sys.id} 
                  post={post} 
                  priority={index < 3} 
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mb-8 md:mb-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl={paginationBaseUrl}
                />
              </div>
            )}
          </div>

          {/* Bottom CTA Banner */}
          <PromotionBanner />
        </>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-xl text-gray-600">No blog posts found.</p>
        </div>
      )}
    </div>
  );
}