import { NextRequest, NextResponse } from 'next/server';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export async function GET(request: NextRequest) {
  console.log(request.url);
  try {
    const API_KEY = process.env.NEWS_API_KEY;
    
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'News API key not configured' },
        { status: 500 }
      );
    }

    // Fetch agriculture-related news
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=agriculture+OR+farming+OR+crops+OR+"food+security"+OR+livestock+OR+irrigation+OR+"sustainable+farming"&country=in&sortBy=publishedAt&language=en&pageSize=20&apiKey=fed7e829a4b540afb735ad68e862aa47`,
      {
        headers: {
          'User-Agent': 'Agriculture-News-App/1.0',
        },
        // Cache for 5 minutes to avoid hitting rate limits
        next: { revalidate: 300 }
      }
    );

    if (!response.ok) {
      throw new Error(`NewsAPI responded with status: ${response.status}`);
    }

    const data: NewsAPIResponse = await response.json();

    if (data.status !== 'ok') {
      throw new Error('NewsAPI returned an error status');
    }

    // Filter out articles with missing essential data
    const filteredArticles = data.articles.filter(article => 
      article.title && 
      article.title !== '[Removed]' &&
      article.description && 
      article.description !== '[Removed]' &&
      article.url
    );

    return NextResponse.json({
      status: 'success',
      totalResults: data.totalResults,
      articles: filteredArticles
    });

  } catch (error) {
    console.error('Error fetching news:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch news',
        status: 'error'
      },
      { status: 500 }
    );
  }
}