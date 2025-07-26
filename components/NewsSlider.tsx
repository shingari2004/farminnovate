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
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  if (error) {
    return (
      <div className="relative w-full max-w-6xl h-64 sm:h-80 md:h-96 mx-auto border-2 overflow-hidden rounded-lg shadow-lg flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-lg sm:text-xl font-bold text-red-600 mb-4">
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
    <div className="relative w-full max-w-6xl mx-auto border-2 overflow-hidden rounded-lg shadow-lg group">
      {/* Responsive height container */}
      <div className="h-64 sm:h-80 md:h-96 lg:h-[28rem] xl:h-[32rem]">
        {news.map((slide, index) => (
          <div
            key={slide.id}
            className={`
              absolute inset-0 flex flex-col md:flex-row
              transition-opacity duration-700
              ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"}
            `}
          >
            {/* Content section */}
            <div className="w-full md:w-1/2 bg-white p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 flex flex-col justify-between order-2 md:order-1">
              <div className="flex-grow">
                <h1 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold pb-2 sm:pb-3 md:pb-4 lg:pb-6 line-clamp-2 md:line-clamp-3">
                  {slide.title}
                </h1>
                <p className="pb-3 sm:pb-4 md:pb-6 lg:pb-8 line-clamp-2 sm:line-clamp-3 md:line-clamp-4 text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed">
                  {slide.description}
                </p>
              </div>
              <div className="flex-shrink-0">
                <a
                  href={slide.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full bg-amber-700 text-white hover:bg-amber-800 transition-colors duration-200 text-xs sm:text-sm font-medium"
                >
                  <span className="hidden sm:inline">Read Full Story</span>
                  <span className="sm:hidden">Read More</span>
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2"
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

            {/* Image section */}
            <div className="w-full md:w-1/2 h-32 sm:h-40 md:h-full bg-gray-200 order-1 md:order-2">
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        ))}



        {/* Navigation dots */}
        <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5 sm:space-x-2 z-20">
          {news.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full transition-colors duration-200 ${
                index === current
                  ? "bg-amber-700"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>



      {/* Mobile slide indicator */}
      <div className="md:hidden absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded z-20">
        {current + 1} / {news.length}
      </div>
    </div>
  );
};

export default NewsSlider;