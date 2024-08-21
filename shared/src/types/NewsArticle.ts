interface NewsArticle {
    title: string;
    tag: {
        name: string;
        colour: string;
    };
    date: string;
    content: string;
}

export default NewsArticle;