import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { contentfulService } from '@/lib/contentful';
import { formatDate } from 'date-fns';
import PromotionBanner from '@/components/blog/PromotionBanner';
import { draftMode } from 'next/headers';
import { ArrowLeft, ArrowRight, Instagram, Linkedin, Facebook } from 'lucide-react';
import Image from 'next/image';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import BlogFAQ from '@/components/blog/BlogFAQ';


export const revalidate = 3600;

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await contentfulService.getPostBySlug(resolvedParams.slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.fields.title} | n8n developers`,
    description: post.fields.excerpt?.substring(0, 160),
  };
}

const mockKeywords = ["Automation", "Workflow", "Tasks", "Performance", "Evolution"];

// Options for rendering Contentful Rich Text
const richTextOptions = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      const { file, title } = node.data.target?.fields || {};
      if (!file?.url) return null;
      
      const imageUrl = file.url.startsWith('//') ? `https:${file.url}` : file.url;
      const width = file.details?.image?.width || 800;
      const height = file.details?.image?.height || 600;

      return (
        <div className="my-8 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
          <Image
            src={imageUrl}
            alt={title || 'Blog image'}
            width={width}
            height={height}
            className="w-full h-auto"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
          />
        </div>
      );
    },
    [BLOCKS.HEADING_1]: (node: any, children: any) => <h1 className="text-3xl font-extrabold mb-6 text-black">{children}</h1>,
    [BLOCKS.HEADING_2]: (node: any, children: any) => <h2 className="text-2xl font-bold mt-12 mb-6 text-black">{children}</h2>,
    [BLOCKS.HEADING_3]: (node: any, children: any) => <h3 className="text-xl font-bold mt-10 mb-5 text-black">{children}</h3>,
    [BLOCKS.PARAGRAPH]: (node: any, children: any) => <p className="mb-8 font-gilroy font-medium text-[20px] leading-[34px] text-black text-justify">{children}</p>,
    [BLOCKS.UL_LIST]: (node: any, children: any) => <ul className="list-disc pl-8 mb-8 space-y-4">{children}</ul>,
    [BLOCKS.OL_LIST]: (node: any, children: any) => <ol className="list-decimal pl-8 mb-8 space-y-4">{children}</ol>,
    [BLOCKS.LIST_ITEM]: (node: any, children: any) => <li className="font-gilroy font-medium text-[20px] leading-[34px] text-black text-justify">{children}</li>,
    [BLOCKS.QUOTE]: (node: any, children: any) => (
      <blockquote className="border-l-6 border-[#FF7A59] pl-8 py-4 my-8 bg-gray-50 italic text-xl text-gray-700 rounded-r-2xl">
        {children}
      </blockquote>
    ),
    [INLINES.HYPERLINK]: (node: any, children: any) => (
      <a href={node.data.uri} target="_blank" rel="noopener noreferrer" className="text-[#FF7A59] font-bold hover:underline">
        {children}
      </a>
    ),
  },
  renderMark: {
    [MARKS.BOLD]: (text: any) => <strong className="font-bold text-black">{text}</strong>,
    [MARKS.ITALIC]: (text: any) => <em className="italic">{text}</em>,
    [MARKS.CODE]: (text: any) => <code className="bg-gray-100 rounded px-1.5 py-0.5 font-mono text-sm">{text}</code>,
  },
};

const SocialXIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 1200 1227" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    <path 
      d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" 
      fill="currentColor"
    />
  </svg>
);

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const { isEnabled } = await draftMode();
  
  const post = await contentfulService.getPostBySlug(
    resolvedParams.slug, 
    isEnabled
  );


  if (!post) notFound();
  
  const adjacentPosts = await contentfulService.getAdjacentPosts(post.fields.date, isEnabled);

  const featuredImage = post.fields.featuredImage;
  const author = post.fields.author;

  return (
    <div className="flex flex-col min-h-screen">
      <article className="w-full pt-8 sm:pt-16 pb-8">
        {/* Header Section: 1440px Container with 80px left padding, scales to 1600px/1800px */}
        <div className="max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-6 sm:px-12 md:px-[80px]">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-[64px] items-start">
            
            {/* Left Content Column: Title and Meta */}
            <div className="w-full lg:w-[586px] xl:w-[700px] flex flex-col gap-8 sm:gap-12 order-1 lg:order-none">
              
              {/* Back Link: Visible only on desktop to keep mobile clean */}
              <Link 
                href="/blogs" 
                className="hidden lg:inline-flex items-center gap-2 font-manrope font-semibold text-[18px] xl:text-[20px] leading-[30px] tracking-[-2%] text-black hover:opacity-70 transition-opacity"
              >
                <div className="bg-black rounded-full p-1.5 flex items-center justify-center">
                  <ArrowLeft className="h-4 w-4 text-white" />
                </div>
                Back to all blog posts
              </Link>

              <div className="flex flex-col gap-6 sm:gap-10">
                {/* Title: Responsive font sizes */}
                <h1 className="font-gilroy font-semibold text-[32px] sm:text-[40px] xl:text-[48px] 2xl:text-[56px] leading-[1.1] tracking-[-3%] text-black">
                  {post.fields.title}
                </h1>

                {/* Meta Section: Reordered to be before image on mobile */}
                <div className="flex flex-wrap items-center gap-[16px] sm:gap-[28px] py-4 border-t border-gray-100">
                  {author && (
                    <div className="flex items-center gap-[16px] sm:gap-[28px]">
                      <div className="space-y-1">
                        <span className="text-[#FF7A59] text-[12px] sm:text-sm font-bold tracking-wider uppercase">Author</span>
                        <p className="font-gilroy font-semibold text-[20px] sm:text-[26px] xl:text-[30px] 2xl:text-[34px] leading-tight tracking-[-2%] text-black whitespace-nowrap">
                          {author}
                        </p>
                      </div>
                      <div className="w-[6px] h-[6px] rounded-full bg-[#FF7442] mt-6" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <span className="text-[#FF7A59] text-[12px] sm:text-sm font-bold tracking-wider uppercase">Time</span>
                    <p className="font-gilroy font-semibold text-[20px] sm:text-[26px] xl:text-[30px] 2xl:text-[34px] leading-tight tracking-[-2%] text-black whitespace-nowrap">
                      {formatDate(new Date(post.fields.date), "do MMM, yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Image: Reordered to be after Title/Meta on mobile */}
            <div className="w-full lg:w-[630px] xl:w-[750px] 2xl:w-[850px] h-[250px] sm:h-[342px] xl:h-[400px] 2xl:h-[450px] relative rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 order-2 lg:order-none">
              {featuredImage?.fields?.file?.url ? (
                <Image
                  src={`https:${featuredImage.fields.file.url}`}
                  alt={post.fields.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-6 sm:px-12 md:px-[80px] mt-8 sm:mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 relative">
            
            {/* Main Content Column */}
            <div className="lg:col-span-8 lg:pl-[103px] xl:pl-[150px] max-w-full">
              <div className="w-full lg:max-w-[722px] xl:max-w-[850px] space-y-12">
                <div className="prose prose-xl sm:prose-2xl xl:prose-3xl max-w-none text-justify
                  prose-headings:text-black prose-headings:font-extrabold 
                  prose-strong:text-black prose-strong:font-bold
                  prose-a:text-[#FF7A59] prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-xl prose-img:border-none prose-img:shadow-none
                ">
                   {documentToReactComponents(post.fields.content, richTextOptions)}
                </div>

                {/* FAQ Section */}
                {(post.fields.faq || (post.fields as any).faqItem) && (
                  <BlogFAQ faqs={post.fields.faq || (post.fields as any).faqItem} />
                )}

                {/* Mobile View: Sidebar content moved here */}
                <div className="flex flex-col gap-10 lg:hidden pt-12 border-t border-gray-100">
                  <div className="flex flex-col gap-6">
                    <h4 className="font-gilroy font-semibold text-[18px] text-[#FF7A59] uppercase tracking-wider">Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {(post.fields.tags || mockKeywords).map((keyword) => (
                        <span 
                          key={keyword} 
                          className="px-4 py-2 rounded-full border border-gray-200 text-[14px] font-bold text-black shadow-sm bg-white"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-6">
                    <h4 className="font-manrope font-semibold text-[18px] text-black">Share this article</h4>
                    <div className="flex items-center gap-5">
                      {[
                        { Icon: Instagram, href: "https://www.instagram.com/n8ndevelopers_offl?igsh=MWNzOXFrczV2Y2twdQ%3D%3D&utm_source=qr" },
                        { 
                          Icon: Linkedin, 
                          href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://www.n8ndevelopers.com/blogs/${resolvedParams.slug}`)}`
                        },
                        { 
                          Icon: SocialXIcon, 
                          href: `https://twitter.com/intent/tweet?text=${encodeURIComponent("I found this article from n8n developers very helpful! You can refer to it here:")}&url=${encodeURIComponent(`https://www.n8ndevelopers.com/blogs/${resolvedParams.slug}`)}`
                        },
                        { 
                          Icon: Facebook, 
                          href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://www.n8ndevelopers.com/blogs/${resolvedParams.slug}`)}`
                        }
                      ].map((social, i) => (
                        <Link 
                          key={i} 
                          href={social.href} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-[48px] h-[48px] border border-gray-100 rounded-xl flex items-center justify-center text-black hover:border-black transition-all shadow-sm bg-white"
                        >
                          <social.Icon className="h-6 w-6" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Article Navigation: Reordered to be below keywords/share on mobile */}
                <div className="w-full flex flex-row items-center justify-between py-12 border-t border-gray-100 mt-10 gap-2 sm:gap-0">
                  {adjacentPosts.prev ? (
                    <Link 
                      href={`/blogs/${adjacentPosts.prev.fields.slug}`} 
                      className="inline-flex items-center gap-[8px] sm:gap-[16px] font-manrope font-semibold text-[14px] xs:text-[16px] sm:text-[18px] leading-[30px] tracking-[-1%] text-black hover:opacity-70 transition-opacity"
                    >
                      <div className="w-[36px] h-[36px] items-center justify-center flex-shrink-0 border border-gray-200 rounded-[12px] flex">
                        <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
                      </div>
                      <span className="whitespace-nowrap">Previous Article</span>
                    </Link>
                  ) : <div className="hidden sm:block" />}
                  
                  {adjacentPosts.next ? (
                    <Link 
                      href={`/blogs/${adjacentPosts.next.fields.slug}`} 
                      className="inline-flex items-center justify-end gap-[8px] sm:gap-[16px] font-manrope font-semibold text-[14px] xs:text-[16px] sm:text-[18px] leading-[30px] tracking-[-1%] text-black hover:opacity-70 transition-opacity"
                    >
                      <span className="whitespace-nowrap">Next Article</span>
                      <div className="w-[36px] h-[36px] items-center justify-center flex-shrink-0 border border-gray-200 rounded-[12px] flex">
                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
                      </div>
                    </Link>
                  ) : <div className="hidden sm:block" />}
                </div>
              </div>
            </div>

            {/* Desktop Sidebar: Visible only on lg+ screens */}
            <div className="hidden lg:col-span-4 lg:flex justify-end">
              <aside className="w-[252px] xl:w-[300px] flex flex-col gap-[107px]">
                <div className="flex flex-col gap-4">
                  <h4 className="font-gilroy font-semibold text-[18px] leading-[20px] tracking-[-2%] text-[#FF7A59]">Keywords</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {(post.fields.tags || mockKeywords).map((keyword) => (
                      <span 
                        key={keyword} 
                        className="px-2 py-2 rounded-full border border-gray-300 text-[13px] font-bold text-black hover:border-black transition-all cursor-default text-center whitespace-nowrap overflow-hidden text-ellipsis shadow-sm bg-white"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <h4 className="font-manrope font-semibold text-[16px] leading-[20px] tracking-[-2%] text-black whitespace-nowrap">Share this article</h4>
                  <div className="flex items-center gap-[20px]">
                    {[
                      { Icon: Instagram, href: "https://www.instagram.com/n8ndevelopers_offl?igsh=MWNzOXFrczV2Y2twdQ%3D%3D&utm_source=qr" },
                      { 
                        Icon: Linkedin, 
                        href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://www.n8ndevelopers.com/blogs/${resolvedParams.slug}`)}`
                      },
                      { 
                        Icon: SocialXIcon, 
                        href: `https://twitter.com/intent/tweet?text=${encodeURIComponent("I found this article from n8n developers very helpful! You can refer to it here:")}&url=${encodeURIComponent(`https://www.n8ndevelopers.com/blogs/${resolvedParams.slug}`)}`
                      },
                      { 
                        Icon: Facebook, 
                        href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://www.n8ndevelopers.com/blogs/${resolvedParams.slug}`)}`
                      }
                    ].map((social, i) => (
                      <Link 
                        key={i} 
                        href={social.href} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-[44px] h-[44px] border border-gray-100 rounded-[12px] flex items-center justify-center text-black hover:border-black transition-all transform hover:scale-105 shadow-sm bg-white"
                      >
                        <social.Icon className="h-6 w-6" />
                      </Link>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </article>

      {/* Promotion Banner */}
      <PromotionBanner />
    </div>
);
}
