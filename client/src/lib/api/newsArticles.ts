import NewsArticle from "shared/types/NewsArticle";

export async function getNewsArticle(id: string): Promise<NewsArticle> {
    const articlesResponse = await fetch(`/api/public/news?id=${id}`);
    
    return await articlesResponse.json();
}

export async function getNewsArticles(page: number): Promise<NewsArticle[]> {
    const articlesResponse = await fetch(`/api/public/news?page=${page}`);
    
    return await articlesResponse.json();
}

export async function getNewsArticlesPages() {
    const articlesPagesResponse = await fetch("/api/public/news/pages");

    return await articlesPagesResponse.json();
}