"use client";

import { FacebookIcon, TwitterIcon, LinkedinIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SocialShareProps {
  url: string;
  title: string;
}

export default function SocialShare({ url, title }: SocialShareProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Share this product</h3>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank')}
        >
          <FacebookIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, '_blank')}
        >
          <TwitterIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`, '_blank')}
        >
          <LinkedinIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}