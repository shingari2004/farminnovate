// app/api/news/route.ts (For Next.js 13+ App Router)
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log(request.url); // Log the request URL for debugging
  try {
    // Using free RSS feed from Agriculture.com
    const response = await fetch(
      'https://www.agriculture.com/rss/news-articles',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; NewsApp/1.0)',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const rssText = await response.text();
    
    // Parse RSS feed (basic parsing)
    const items: any[] = [];
    const itemRegex = /<item>(.*?)<\/item>/gs;
    const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>/;
    const descRegex = /<description><!\[CDATA\[(.*?)\]\]><\/description>/;
    const linkRegex = /<link>(.*?)<\/link>/;
    const imageRegex = /<media:content[^>]*url="([^"]*)"[^>]*>/;
    
    let match;
    while ((match = itemRegex.exec(rssText)) !== null && items.length < 10) {
      const itemContent = match[1];
      
      const titleMatch = titleRegex.exec(itemContent);
      const descMatch = descRegex.exec(itemContent);
      const linkMatch = linkRegex.exec(itemContent);
      const imageMatch = imageRegex.exec(itemContent);
      
      if (titleMatch && descMatch && linkMatch) {
        items.push({
          title: titleMatch[1],
          description: descMatch[1].replace(/<[^>]*>/g, ''), // Remove HTML tags
          url: linkMatch[1],
          urlToImage: imageMatch ? imageMatch[1] : 'https://via.placeholder.com/400x400?text=Agriculture+News',
          publishedAt: new Date().toISOString(),
        });
      }
    }
    
    return NextResponse.json({
      status: 'ok',
      articles: items,
      totalResults: items.length
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    
    // Fallback to mock data if RSS fails
    const mockArticles = [
      {
        title: "India's Agricultural Modernization Continues",
        description: "Government initiatives are driving technological advancement in Indian agriculture, with new programs supporting farmers across the country.",
        url: "#",
        urlToImage: "https://via.placeholder.com/400x400?text=Agriculture+News",
        publishedAt: new Date().toISOString(),
      },
      {
        title: "Sustainable Farming Practices Gain Momentum",
        description: "Farmers are increasingly adopting sustainable and eco-friendly farming methods to improve crop yields while protecting the environment.",
        url: "#",
        urlToImage: "https://via.placeholder.com/400x400?text=Sustainable+Farming",
        publishedAt: new Date().toISOString(),
      },
      {
        title: "Technology in Agriculture: A Growing Trend",
        description: "Digital tools and modern technology are transforming how farmers manage their crops and livestock, leading to better productivity.",
        url: "#",
        urlToImage: "https://via.placeholder.com/400x400?text=AgTech",
        publishedAt: new Date().toISOString(),
      },
      {
        title: "Weather Patterns Affecting Crop Production",
        description: "Climate changes and weather patterns continue to impact agricultural production, with farmers adapting to new challenges.",
        url: "#",
        urlToImage: "https://via.placeholder.com/400x400?text=Weather+Agriculture",
        publishedAt: new Date().toISOString(),
      },
      {
        title: "Government Support for Rural Development",
        description: "New policies and programs are being implemented to support rural communities and improve agricultural infrastructure.",
        url: "#",
        urlToImage: "https://via.placeholder.com/400x400?text=Rural+Development",
        publishedAt: new Date().toISOString(),
      },
      {
        title: "Organic Farming Market Growth",
        description: "The organic farming sector is experiencing significant growth as consumers demand more sustainable and healthy food options.",
        url: "#",
        urlToImage: "https://via.placeholder.com/400x400?text=Organic+Farming",
        publishedAt: new Date().toISOString(),
      }
    ];
    
    return NextResponse.json({
      status: 'ok',
      articles: mockArticles,
      totalResults: mockArticles.length
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