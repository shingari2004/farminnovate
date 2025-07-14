import { NextResponse } from 'next/server';

export async function GET() {
  const API_KEY = process.env.NEWS_API_KEY;
  
  if (!API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  const NEWS_API_URL = `https://newsapi.org/v2/everything?q=agriculture+india&apiKey=${API_KEY}`;

  try {
    const response = await fetch(NEWS_API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}