interface NewsArticle {
    id?: string;
    title: string;
    thumbnail?: string;
    tag: {
        name: string;
        colour: string;
    };
    timestamp: number;
    content: string;
}

export default NewsArticle;