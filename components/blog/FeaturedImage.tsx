'use client';

import { useState } from 'react';
import Image from 'next/image';

interface FeaturedImageProps {
  src: string | null;
  alt: string;
  priority?: boolean;
}

export default function FeaturedImage({ src, alt, priority = false }: FeaturedImageProps) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return null;
  }

  const imageUrl = src.startsWith('//') ? `https:${src}` : src;

  return (
    <div className="mb-8 aspect-video relative overflow-hidden rounded-xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(128,128,128,1)]">
      <Image
        src={imageUrl}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
        className="object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
}