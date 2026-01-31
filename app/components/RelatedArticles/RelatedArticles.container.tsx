"use client";

import { useState, useEffect, memo, useMemo, useCallback } from "react";
import { useIsMobile } from "../../hooks";
import { RelatedArticlesView } from "./RelatedArticles.view";
import type { RelatedArticlesProps } from "./RelatedArticles.types";

const RelatedArticlesContainer = memo<RelatedArticlesProps>(
  ({ relatedPosts, currentPostSlug, slugOrder = [] }) => {
    // Memoize filtered posts to prevent unnecessary re-computations
    const filteredPosts = useMemo(
      () => relatedPosts.filter((post) => post.slug !== currentPostSlug),
      [relatedPosts, currentPostSlug],
    );

    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [mounted, setMounted] = useState(false);
    const isMobile = useIsMobile();

    // Ensure hydration matches server render
    useEffect(() => {
      setMounted(true);
    }, []);

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
      [],
    );

    // Memoize transform style to prevent unnecessary recalculations
    // Use mounted state to prevent hydration mismatch
    const transformStyle = useMemo(
      () => ({
        transform: mounted && isMobile
          ? `translateX(calc(50% - 130px - ${currentIndex * 260}px))`
          : "none",
        scrollBehavior: (mounted && !isMobile
          ? "smooth"
          : "auto") as React.CSSProperties["scrollBehavior"],
      }),
      [mounted, isMobile, currentIndex],
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
      [currentIndex, progress],
    );

    // Auto-advance every 3 seconds (only on mobile, after mount)
    useEffect(() => {
      if (filteredPosts.length <= 1 || !mounted || !isMobile) return;

      const interval = setInterval(() => {
        setProgress(0);
        setCurrentIndex((prev) => (prev + 1) % filteredPosts.length);
      }, 3000);

      return () => clearInterval(interval);
    }, [filteredPosts.length, mounted, isMobile]);

    // Progress animation (only on mobile, after mount)
    useEffect(() => {
      if (filteredPosts.length <= 1 || !mounted || !isMobile) return;

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0;
          }
          return prev + 1;
        });
      }, 30); // 30ms intervals for smooth animation

      return () => clearInterval(progressInterval);
    }, [currentIndex, filteredPosts.length, mounted, isMobile]);

    return (
      <RelatedArticlesView
        filteredPosts={filteredPosts}
        slugOrder={slugOrder}
        isMobile={mounted && isMobile}
        transformStyle={transformStyle}
        getProgressStyle={getProgressStyle}
        onMouseDown={handleMouseDown}
      />
    );
  },
);

RelatedArticlesContainer.displayName = "RelatedArticles";

export default RelatedArticlesContainer;
