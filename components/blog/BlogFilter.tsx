'use client';

import Link from 'next/link';

interface BlogFilterProps {
  currentTag: string;
}

const filters = [
  { label: 'All', value: 'All' },
  { label: 'Guest', value: 'Guest' },
];

export default function BlogFilter({ currentTag }: BlogFilterProps) {
  return (
    <div className="flex items-center gap-8 border-b border-gray-100 pb-2 mb-12 overflow-x-auto no-scrollbar">
      {filters.map((filter) => {
        const isActive = currentTag === filter.value;
        const href = filter.value === 'All' ? '/blogs' : `/blogs?type=${filter.value}`;

        return (
          <Link
            key={filter.value}
            href={href}
            className={`text-lg font-bold transition-all whitespace-nowrap relative pb-4 pt-2 px-2 ${
              isActive 
                ? 'text-black after:absolute after:bottom-0 after:left-0 after:right-1 after:h-[3px] after:bg-[#FF7A59] after:rounded-full' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}
