import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  const getPageUrl = (pageNumber: number) => {
    const isFirstPage = pageNumber === 1;
    const hasQuery = baseUrl.includes('?');
    
    if (isFirstPage) {
      return baseUrl;
    }
    
    if (hasQuery) {
      return `${baseUrl}&page=${pageNumber}`;
    }
    
    return `${baseUrl}?page=${pageNumber}`;
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;
    
    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex justify-center items-center gap-4 py-8">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="p-2 text-gray-400 hover:text-black transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
      ) : (
        <div className="p-2 text-gray-200 cursor-not-allowed">
          <ChevronLeft className="w-6 h-6" />
        </div>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {pageNumbers.map((page: number | string, index: number) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-sm font-semibold text-gray-300"
              >
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          const isCurrentPage = pageNumber === currentPage;

          return (
            <Link
              key={pageNumber}
              href={getPageUrl(pageNumber)}
              className={`min-w-[44px] h-[44px] flex items-center justify-center text-base font-bold rounded-lg transition-all ${
                isCurrentPage
                  ? 'text-[#FF7A59] bg-transparent'
                  : 'text-gray-400 hover:text-black hover:bg-gray-50'
              }`}
            >
              {pageNumber}
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="p-2 text-gray-400 hover:text-black transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-6 h-6" />
        </Link>
      ) : (
        <div className="p-2 text-gray-200 cursor-not-allowed">
          <ChevronRight className="w-6 h-6" />
        </div>
      )}
    </nav>
  );
}
