"use client";

import React, { useEffect, useState } from "react";
import FullScreenLoader from "./FullScreenLoader";

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
  const [news, setNews] = useState<NewsItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setError(null);
        
        // Call your Vercel API route instead of direct NewsAPI call
        const res = await fetch('/api/news');
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (data.error) {
          throw new Error(data.error);
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
    };

    // Initial fetch
    fetchNews();
    
    // Set interval for periodic updates
    const newsInterval = setInterval(fetchNews, 30000); // 30 seconds

    // Cleanup function
    return () => {
      clearInterval(newsInterval);
    };
  }, []);

  useEffect(() => {
    if (news.length === 0) return;

    const slideInterval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % news.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [news]);

  if (loading) {
    return <FullScreenLoader />;
  }

  if (error) {
    return (
      <div className="relative w-full max-w-5xl h-96 mx-auto border-2 overflow-hidden rounded-lg shadow-lg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading News</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="relative w-full max-w-5xl h-96 mx-auto border-2 overflow-hidden rounded-lg shadow-lg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-600 mb-4">No News Available</h2>
          <p className="text-gray-500">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-5xl h-96 mx-auto border-2 overflow-hidden rounded-lg shadow-lg">
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
          <div className="w-1/2 bg-white p-12 flex flex-col justify-between">
            <div>
              <h1 className="text-xl font-bold pb-6 line-clamp-3">{slide.title}</h1>
              <p className="pb-8 line-clamp-4 text-gray-700">{slide.description}</p>
            </div>
            <div>
              <a
                href={slide.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-32 h-12 rounded-3xl bg-amber-700 text-white items-center justify-center hover:bg-amber-800 transition"
              >
                Read full news
              </a>
            </div>
          </div>

          {/* Right side image */}
          <div
            className="w-1/2 bg-cover bg-center bg-gray-200"
            style={{ backgroundImage: `url(${slide.imageUrl})` }}
          />
        </div>
      ))}

      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {news.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === current ? "bg-amber-700" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsSlider;