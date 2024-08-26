import { NewsArticle } from "wintrchess";

export async function getNewsArticle(id: string): Promise<NewsArticle> {
    const articlesResponse = await fetch(`/api/news?id=${id}`);
    
    return await articlesResponse.json();
}

export async function getNewsArticles(): Promise<NewsArticle[]> {
    const articlesResponse = await fetch("/api/news");
    
    return await articlesResponse.json();
}