import { Evaluation } from "wintrchess";

interface EvaluationBarProps {
    height: number;
    evaluation: Evaluation;
    flipped?: boolean;
}

export default EvaluationBarProps;