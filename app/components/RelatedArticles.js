"use client";

import { useState, useEffect } from "react";
import ContentThumbnailTemplate from "./ContentThumbnailTemplate";

export default function RelatedArticles({ relatedPosts, currentPostSlug }) {
  // Filter out the current post from related posts
  const filteredPosts = relatedPosts.filter(
    (post) => post.slug !== currentPostSlug
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Auto-advance every 3 seconds
  useEffect(() => {
    if (filteredPosts.length <= 1) return;

    const interval = setInterval(() => {
      setProgress(0);
      setCurrentIndex((prev) => (prev + 1) % filteredPosts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [filteredPosts.length]);

  // Progress animation
  useEffect(() => {
    if (filteredPosts.length <= 1) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 1;
      });
    }, 30); // 30ms intervals for smooth animation

    return () => clearInterval(progressInterval);
  }, [currentIndex, filteredPosts.length]);

  if (filteredPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-[var(--spacing-scale-032)]">
      <div className="flex flex-col gap-[var(--spacing-scale-032)]">
        <h2 className="text-[32px] leading-[110%] font-medium text-[var(--color-content-inverse-primary)] text-center">
          Related Articles
        </h2>

        {/* Horizontal Articles Row - All Visible with Centering */}
        <div className="flex justify-center overflow-hidden">
          <div
            className="flex gap-0 transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(calc(50% - 130px - ${
                currentIndex * 260
              }px))`,
            }}
          >
            {filteredPosts.map((relatedPost, index) => (
              <div
                key={relatedPost.slug}
                className="flex flex-col items-center"
              >
                <ContentThumbnailTemplate
                  post={relatedPost}
                  variant="vertical"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Three separate progress bars below the carousel */}
        <div className="flex justify-center gap-[var(--measures-spacing-008)] px-[var(--measures-spacing-064)]">
          {filteredPosts.map((relatedPost, index) => (
            <div
              key={relatedPost.slug}
              className="max-w-[var(--measures-spacing-056)] w-full h-[var(--measures-spacing-004)] bg-gray-200 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-gray-600 rounded-full transition-all duration-75 ease-linear"
                style={{
                  width:
                    index === currentIndex
                      ? `${progress}%`
                      : index < currentIndex
                      ? "100%"
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
