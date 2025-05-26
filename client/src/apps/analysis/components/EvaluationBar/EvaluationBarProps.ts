import { CSSProperties } from "react";
import { Evaluation, PieceColour } from "wintrchess";

interface EvaluationBarProps {
    className?: string;
    style?: CSSProperties;
    evaluation: Evaluation;
    moveColour?: PieceColour;
    flipped?: boolean;
}

export default EvaluationBarProps;