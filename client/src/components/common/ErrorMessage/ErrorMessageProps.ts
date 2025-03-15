import { CSSProperties, ReactNode } from "react";

interface ErrorMessageProps {
    children?: ReactNode;
    style?: CSSProperties;
    includeIcon?: boolean;
}

export default ErrorMessageProps;