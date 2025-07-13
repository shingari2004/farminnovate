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

const NewsSlider = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [current, setCurrent] = useState(0);
  const API_KEY_2 = "fed7e829a4b540afb735ad68e862aa47"; // Replace with your NewsAPI key
  // Fetch and update live agriculture news
  const NEWS_API_URL = `https://newsapi.org/v2/everything?q=agriculture+india&apiKey=${API_KEY_2}`;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(NEWS_API_URL);
        const data = await res.json();

        // Map your API data structure here (example for NewsAPI.org)
        const shuffledArticles = data.articles.sort(() => 0.5 - Math.random()); 

        // Select the first 4 articles
        const selectedArticles = shuffledArticles
          .slice(0, 6)
          .map((article: any, i: number) => ({
            id: i,
            title: article.title || "No title",
            description: article.description || "No description",
            imageUrl:
              article.urlToImage ||
              "https://via.placeholder.com/400x400?text=No+Image",
            url: article.url || "#",
          }));

        setNews(selectedArticles);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
    setInterval(fetchNews , 30000);
  }, []);

  useEffect(() => {
    if (news.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % news.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [news]);

  if (news.length === 0) {
    return <FullScreenLoader/>;
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
          <div className="w-1/2 bg-white  p-12 flex flex-col justify-between">
            <div>
              <h1 className="text-xl font-bold pb-6">{slide.title}</h1>
              <p className="pb-8">{slide.description}</p>
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
            className="w-1/2 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.imageUrl})` }}
          />
        </div>
      ))}
    </div>
  );
};

export default NewsSlider;
