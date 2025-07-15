// app/api/news/route.ts (For Next.js 13+ App Router)
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const API_KEY = process.env.NEWS_API_KEY;
  console.log(request.url);
  
  if (!API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=agriculture+india&apiKey=${API_KEY}&sortBy=publishedAt&pageSize=20`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; NewsApp/1.0)',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if NewsAPI returned an error
    if (data.status === 'error') {
      throw new Error(data.message || 'NewsAPI error');
    }
    
    // Check if articles exist
    if (!data.articles || !Array.isArray(data.articles)) {
      return NextResponse.json({
        status: 'ok',
        articles: [],
        totalResults: 0
      });
    }
    
    // Filter out articles with missing data
    const filteredArticles = data.articles.filter((article: any) => 
      article.title && 
      article.description && 
      article.title !== '[Removed]' &&
      article.description !== '[Removed]'
    );

    return NextResponse.json({
      ...data,
      articles: filteredArticles
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
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