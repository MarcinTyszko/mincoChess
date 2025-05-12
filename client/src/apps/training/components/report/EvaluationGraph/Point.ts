import { BoardState, Evaluation } from "wintrchess";

interface EvaluationGraphPoint {
    nodeId: string;
    state: BoardState;
    evaluation: Evaluation;
    x: number;
    y: number;
}

export default EvaluationGraphPoint;