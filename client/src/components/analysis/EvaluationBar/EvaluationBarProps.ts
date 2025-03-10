import { Evaluation, PieceColour } from "wintrchess";

interface EvaluationBarProps {
    height: number;
    evaluation: Evaluation;
    moveColour?: PieceColour;
    flipped?: boolean;
}

export default EvaluationBarProps;