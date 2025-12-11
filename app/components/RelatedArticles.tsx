"use client";

import React, { useState, useEffect, memo, useMemo, useCallback } from "react";
import ContentThumbnailTemplate from "./ContentThumbnailTemplate";
import type { BlogPost } from "../../lib/content";

interface RelatedArticlesProps {
  relatedPosts: BlogPost[];
  currentPostSlug: string;
  slugOrder?: string[];
}

const RelatedArticles = memo<RelatedArticlesProps>(
  ({ relatedPosts, currentPostSlug, slugOrder = [] }) => {
    // Memoize filtered posts to prevent unnecessary re-computations
    const filteredPosts = useMemo(
      () => relatedPosts.filter((post) => post.slug !== currentPostSlug),
      [relatedPosts, currentPostSlug]
    );

    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isMobile, setIsMobile] = useState(true);

    // Memoize the mouse down handler to prevent unnecessary re-renders
    const handleMouseDown = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        const slider = e.currentTarget;
        const startX = e.pageX - slider.offsetLeft;
        const scrollLeft = slider.scrollLeft;

        const handleMouseMove = (e: MouseEvent) => {
          const x = e.pageX - slider.offsetLeft;
          const walk = (x - startX) * 2;
          slider.scrollLeft = scrollLeft - walk;
        };

        const handleMouseUp = () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      },
      []
    );

    // Memoize transform style to prevent unnecessary recalculations
    const transformStyle = useMemo(
      () => ({
        transform: isMobile
          ? `translateX(calc(50% - 130px - ${currentIndex * 260}px))`
          : "none",
        scrollBehavior: !isMobile ? "smooth" : "auto",
      }),
      [isMobile, currentIndex]
    );

    // Memoize progress bar style calculation
    const getProgressStyle = useCallback(
      (index: number): React.CSSProperties => ({
        width:
          index === currentIndex
            ? `${progress}%`
            : index < currentIndex
            ? "100%"
            : "0%",
      }),
      [currentIndex, progress]
    );

    // Check if we're on mobile (below lg breakpoint)
    useEffect(() => {
      const checkScreenSize = () => {
        setIsMobile(window.innerWidth < 1024); // lg breakpoint is 1024px
      };

      checkScreenSize();
      window.addEventListener("resize", checkScreenSize);
      return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    // Auto-advance every 3 seconds (only on mobile)
    useEffect(() => {
      if (filteredPosts.length <= 1 || !isMobile) return;

      const interval = setInterval(() => {
        setProgress(0);
        setCurrentIndex((prev) => (prev + 1) % filteredPosts.length);
      }, 3000);

      return () => clearInterval(interval);
    }, [filteredPosts.length, isMobile]);

    // Progress animation (only on mobile)
    useEffect(() => {
      if (filteredPosts.length <= 1 || !isMobile) return;

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0;
          }
          return prev + 1;
        });
      }, 30); // 30ms intervals for smooth animation

      return () => clearInterval(progressInterval);
    }, [currentIndex, filteredPosts.length, isMobile]);

    if (filteredPosts.length === 0) {
      return null;
    }

    return (
      <section className="py-[var(--spacing-scale-032)] lg:py-[var(--spacing-scale-064)]">
        <div className="flex flex-col gap-[var(--spacing-scale-032)] lg:gap-[51px]">
          <h2 className="text-[32px] lg:text-[44px] leading-[110%] font-medium text-[var(--color-content-inverse-primary)] text-center">
            Related Articles
          </h2>

          {/* Horizontal Articles Row - Carousel on mobile, Scrollable slider on desktop */}
          <div className="flex justify-center overflow-hidden">
            <div
              className={`flex gap-0 transition-transform duration-500 ease-in-out ${
                !isMobile
                  ? "overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
                  : ""
              }`}
              style={transformStyle}
              onMouseDown={!isMobile ? handleMouseDown : undefined}
            >
              {filteredPosts.map((relatedPost) => (
                <div
                  key={relatedPost.slug}
                  className="flex flex-col items-center flex-shrink-0"
                >
                  <ContentThumbnailTemplate
                    post={relatedPost}
                    variant="vertical"
                    slugOrder={slugOrder}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Progress bars - only show on mobile */}
          {isMobile && (
            <div className="flex justify-center gap-[var(--measures-spacing-008)] px-[var(--measures-spacing-064)]">
              {filteredPosts.map((relatedPost, index) => (
                <div
                  key={relatedPost.slug}
                  className="max-w-[var(--measures-spacing-056)] w-full h-[var(--measures-spacing-004)] bg-gray-200 rounded-full overflow-hidden"
                >
                  <div
                    className="h-full bg-gray-600 rounded-full transition-all duration-75 ease-linear"
                    style={getProgressStyle(index)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }
);

RelatedArticles.displayName = "RelatedArticles";

export default RelatedArticles;
