import { CSSProperties } from "react";

import { StateTreeNode } from "wintrchess";
import EvaluationGraphPoint from "./Point";

interface EvaluationGraphProps {
    className?: string;
    style?: CSSProperties;
    nodes: StateTreeNode[];
    onPointClick?: (point: EvaluationGraphPoint) => void;
}

export default EvaluationGraphProps;