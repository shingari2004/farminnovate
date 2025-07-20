"use client";

import React, { useEffect, useState, useCallback } from "react";
import FullScreenLoader from "./FullScreenLoader";
import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface NewsItem {
  id: string | number;
  title: string;
  description: string;
  imageUrl: string;
  url: string;
}

interface Article {
  title?: string;
  description?: string;
  urlToImage?: string;
  url?: string;
}

const NewsSlider = () => {
  const { isSignedIn } = useUser();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const router = useRouter();
  const handleClick = () => {
    if (isSignedIn) {
      // If needed, you could toggle a menu here, or just rely on UserButton
      <UserButton afterSignOutUrl="/home" />; // Optional: if wrapping logic required
    } else {
      router.push("/sign-in");
    }
  };

  const fetchNews = useCallback(async () => {
    try {
      setError(null);

      // Call your Vercel API route instead of direct NewsAPI call
      const res = await fetch("/api/news");

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Check if articles exist and is an array
      if (!data.articles || !Array.isArray(data.articles)) {
        throw new Error("No articles found in response");
      }

      if (data.articles.length === 0) {
        throw new Error("No articles available");
      }

      // Map your API data structure here
      const shuffledArticles = data.articles.sort(() => 0.5 - Math.random());

      // Select the first 6 articles
      const selectedArticles = shuffledArticles
        .slice(0, 6)
        .map((article: Article, i: number) => ({
          id: i,
          title: article.title || "No title",
          description: article.description || "No description",
          imageUrl:
            article.urlToImage ||
            "https://via.placeholder.com/400x400?text=No+Image",
          url: article.url || "#",
        }));

      setNews(selectedArticles);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching news:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch news");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchNews();

    // Set interval for periodic updates
    const newsInterval = setInterval(fetchNews, 30000); // 30 seconds

    // Cleanup function
    return () => {
      clearInterval(newsInterval);
    };
  }, [fetchNews]);

  useEffect(() => {
    if (news.length === 0 || !isAutoPlaying) return;

    const slideInterval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % news.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [news, isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrent(index);
    setIsAutoPlaying(false);
    // Resume autoplay after user interaction
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % news.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrev = () => {
    setCurrent((prev) => (prev - 1 + news.length) % news.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  if (error) {
    return (
      <div className="relative w-full max-w-5xl h-96 mx-auto border-2 overflow-hidden rounded-lg shadow-lg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            Sign in to See news
          </h2>
          <button
            onClick={() => {
              setLoading(true);
              fetchNews();
            }}
            className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-300 cursor-pointer transition"
          >
            <div onClick={handleClick}>
              <span>Sign In</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return <FullScreenLoader />;
  }

  return (
    <div className="relative w-full max-w-5xl h-96 mx-auto border-2 overflow-hidden rounded-lg shadow-lg group">
      {news.map((slide, index) => (
        <div
          key={slide.id}
          className={`
            absolute inset-0 flex
            transition-opacity duration-700
            ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"}
          `}
        >
          {/* Left side content */}
          <div className="w-1/2 bg-white p-8 md:p-12 flex flex-col justify-between">
            <div>
              <h1 className="text-lg md:text-xl font-bold pb-4 md:pb-6 line-clamp-3">
                {slide.title}
              </h1>
              <p className="pb-6 md:pb-8 line-clamp-4 text-gray-700 text-sm md:text-base">
                {slide.description}
              </p>
            </div>
            <div>
              <a
                href={slide.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 rounded-full bg-amber-700 text-white hover:bg-amber-800 transition-colors duration-200 text-sm font-medium"
              >
                Read Full Story
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Right side image */}
          <div
            className="w-1/2 bg-cover bg-center bg-gray-200"
            style={{
              backgroundImage: `url(${slide.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>
      ))}

      {/* Navigation arrows - only visible on hover */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-70"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-70"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {news.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              index === current
                ? "bg-amber-700"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsSlider;
