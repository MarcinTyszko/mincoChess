import { NewsArticle } from "wintrchess";

interface ArticleListingProps {
    article: NewsArticle;
    editable?: boolean;
    hardReload?: boolean;
}

export default ArticleListingProps;