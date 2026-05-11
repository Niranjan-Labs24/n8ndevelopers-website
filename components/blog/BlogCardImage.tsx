'use client';

import { useState } from 'react';
import Image from 'next/image';

interface BlogCardImageProps {
  src: string | null;
  alt: string;
  priority?: boolean;
}

export default function BlogCardImage({ src, alt, priority = false }: BlogCardImageProps) {
  const [imageError, setImageError] = useState(false);

  // Optimized Contentful Image API parameters: reduced width and quality for faster LCP
  const optimizedSrc = src ? `${src}?w=500&q=65&fm=webp` : null;

  if (!optimizedSrc || imageError) {
    return (
      <div className="mb-4 aspect-video relative overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center">
        <Image
          src="/placeholder.svg"
          alt={alt}
          width={64}
          height={64}
          className="opacity-50"
        />
      </div>
    );
  }

  return (
    <div className="mb-4 aspect-video relative overflow-hidden rounded-xl bg-gray-100">
      <Image
        src={optimizedSrc}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-opacity duration-300"
        onError={() => setImageError(true)}
        priority={priority}
        fetchPriority={priority ? "high" : "auto"}
      />
    </div>
  );
}