import { NewsArticle } from "wintrchess";

export async function getNewsArticle(id: string): Promise<NewsArticle> {
    const articlesResponse = await fetch(`/api/news?id=${id}`);
    
    return await articlesResponse.json();
}

export async function getNewsArticles(page: number): Promise<NewsArticle[]> {
    const articlesResponse = await fetch(`/api/news?page=${page}`);
    
    return await articlesResponse.json();
}

export async function getNewsArticlesPages() {
    const articlesPagesResponse = await fetch("/api/news/pages");

    return await articlesPagesResponse.json();
}