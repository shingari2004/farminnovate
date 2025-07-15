// app/api/news/route.ts (For Next.js 13+ App Router)
import { NextRequest, NextResponse } from 'next/server';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
}

// Mock news data that simulates real agriculture news
const generateMockArticles = (): NewsArticle[] => {
  const baseArticles = [
    {
      title: "India's Agricultural Modernization Continues with Digital Farming",
      description: "Government initiatives are driving technological advancement in Indian agriculture, with new programs supporting farmers across Punjab, Haryana, and other key agricultural states. Digital farming tools are being implemented to improve crop monitoring and yield prediction.",
      url: "https://example.com/digital-farming",
      urlToImage: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
    },
    {
      title: "Sustainable Farming Practices Gain Momentum in North India",
      description: "Farmers in Punjab and surrounding regions are increasingly adopting sustainable and eco-friendly farming methods to improve crop yields while protecting the environment. Organic farming practices are showing promising results.",
      url: "https://example.com/sustainable-farming",
      urlToImage: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop",
    },
    {
      title: "Technology in Agriculture: AI and IoT Transform Farming",
      description: "Artificial Intelligence and Internet of Things devices are transforming how farmers manage their crops and livestock. Smart irrigation systems and drone monitoring are leading to better productivity and resource management.",
      url: "https://example.com/ai-farming",
      urlToImage: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop",
    },
    {
      title: "Monsoon Patterns Affecting Crop Production Across India",
      description: "Climate changes and irregular monsoon patterns continue to impact agricultural production, with farmers in Punjab and other northern states adapting to new challenges. Weather forecasting tools are becoming essential for crop planning.",
      url: "https://example.com/monsoon-farming",
      urlToImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
    },
    {
      title: "Government Support for Rural Development and Farmer Welfare",
      description: "New policies and programs are being implemented to support rural communities and improve agricultural infrastructure. Subsidies for modern farming equipment and training programs are being expanded nationwide.",
      url: "https://example.com/rural-development",
      urlToImage: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
    },
    {
      title: "Organic Farming Market Growth Drives Agricultural Innovation",
      description: "The organic farming sector is experiencing significant growth as consumers demand more sustainable and healthy food options. Export opportunities for organic produce are creating new income streams for farmers.",
      url: "https://example.com/organic-farming",
      urlToImage: "https://images.unsplash.com/photo-1592504943096-4ac9c5b2b9c7?w=400&h=300&fit=crop",
    },
    {
      title: "Water Conservation Techniques in Modern Agriculture",
      description: "Innovative water conservation methods including drip irrigation and rainwater harvesting are being adopted by farmers to combat water scarcity. These techniques are proving especially effective in water-stressed regions.",
      url: "https://example.com/water-conservation",
      urlToImage: "https://images.unsplash.com/photo-1597149254631-72b8c6c3e0a8?w=400&h=300&fit=crop",
    },
    {
      title: "Crop Insurance Schemes Provide Security for Farmers",
      description: "Government-backed crop insurance programs are helping farmers mitigate risks from natural disasters and climate change. These schemes are particularly beneficial for small-scale farmers in rural areas.",
      url: "https://example.com/crop-insurance",
      urlToImage: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&h=300&fit=crop",
    },
    {
      title: "Precision Agriculture Increases Crop Yields by 20%",
      description: "Latest studies show that precision agriculture techniques using GPS and sensor technology are helping farmers increase crop yields significantly while reducing input costs and environmental impact.",
      url: "https://example.com/precision-agriculture",
      urlToImage: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
    },
    {
      title: "Vertical Farming Solutions for Urban Agriculture",
      description: "Urban farming initiatives are gaining traction with vertical farming solutions that allow food production in cities. These systems use 95% less water and can produce crops year-round regardless of weather conditions.",
      url: "https://example.com/vertical-farming",
      urlToImage: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=300&fit=crop",
    }
  ];

  // Shuffle articles and add realistic timestamps
  const shuffled = [...baseArticles].sort(() => 0.5 - Math.random());
  
  return shuffled.slice(0, 8).map((article, index) => ({
    ...article,
    publishedAt: new Date(Date.now() - (index * 86400000) - (Math.random() * 86400000)).toISOString(),
  }));
};

export async function GET(request: NextRequest) {
  console.log(request.url);
  try {
    // In a real application, you would try to fetch from actual news sources
    // For demonstration, we'll simulate a successful API call with realistic data
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const articles = generateMockArticles();
    
    return NextResponse.json({
      status: 'ok',
      articles: articles,
      totalResults: articles.length,
      source: 'Agriculture News API'
    });
    
  } catch (error) {
    console.error('Error fetching news:', error);
    
    // Even if there's an error, return some basic articles
    const fallbackArticles: NewsArticle[] = [
      {
        title: "Agricultural News Service Temporarily Unavailable",
        description: "We're working to restore full news service. Please check back later for the latest agricultural news and updates.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
        publishedAt: new Date().toISOString(),
      },
      {
        title: "Stay Updated with Agricultural Developments",
        description: "Keep track of the latest trends in sustainable farming, technology adoption, and government policies affecting agriculture in India.",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop",
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
      }
    ];
    
    return NextResponse.json({
      status: 'error',
      articles: fallbackArticles,
      totalResults: fallbackArticles.length,
      message: 'Using fallback data'
    });
  }
}

export async function OPTIONS(request: NextRequest) {
  console.log(request.url);
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}