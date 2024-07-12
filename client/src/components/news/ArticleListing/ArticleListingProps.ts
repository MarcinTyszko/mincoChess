import { ReactNode } from "react";

interface ArticleListingProps {
    children: ReactNode;
    category: string;
    categoryColour?: string;
    date: Date;
}

export default ArticleListingProps;