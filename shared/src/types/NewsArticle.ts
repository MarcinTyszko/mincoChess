interface NewsArticle {
    id: string;
    title: string;
    tag: {
        name: string;
        colour: string;
    };
    date: string;
    content: string;
}

export default NewsArticle;