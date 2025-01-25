import { createContext } from "react";
import { Square } from "react-chessboard/dist/chessboard/types";

const HighlightedSquaresContext = createContext<Square[]>([]);

export default HighlightedSquaresContext;