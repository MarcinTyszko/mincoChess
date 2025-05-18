import { Evaluation, PieceColour } from "wintrchess";

interface EvaluationBarProps {
    disabled?: boolean;
    height: number;
    evaluation: Evaluation;
    moveColour?: PieceColour;
    flipped?: boolean;
}

export default EvaluationBarProps;