import React from "react";
import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    AreaChart,
    Area,
    Tooltip,
    ReferenceLine
} from "recharts";
import { max } from "lodash";

import {
    Evaluation,
    defaultEvaluation,
    getTopEngineLine,
    PieceColour,
    StateTreeNode
} from "wintrchess";

import EvaluationGraphPoint from "./Point";
import TooltipRenderer from "./TooltipRenderer";
import EvaluationGraphProps from "./EvaluationGraphProps";
import * as styles from "./EvaluationGraph.module.css";

function getGraphY(
    node: StateTreeNode,
    evaluation: Evaluation,
    graphHeight: number
) {
    if (evaluation.type == "mate") {
        if (evaluation.value == 0) {
            if (node.state.moveColour == undefined) {
                return graphHeight / 2;
            }

            return node.state.moveColour == PieceColour.WHITE
                ? graphHeight : 0;
        }

        return evaluation.value >= 0 ? graphHeight : 0;
    }

    return evaluation.value + (graphHeight / 2);
}

function EvaluationGraph({
    className,
    style,
    nodes,
    onPointClick
}: EvaluationGraphProps) {
    const absoluteHighestValue = max(
        nodes.map(node => Math.abs(
            getTopEngineLine(node.state)?.evaluation.value || 0
        ))
    ) || 0;

    const yAxisPadding = absoluteHighestValue * 0.2;

    const dataPoints = nodes.map((node, index) => {
        const evaluation = getTopEngineLine(node.state)?.evaluation
            || defaultEvaluation;

        const graphHeight = (absoluteHighestValue + yAxisPadding) * 2;

        return {
            nodeId: node.id,
            state: node.state,
            evaluation: evaluation,
            x: index,
            y: getGraphY(node, evaluation, graphHeight)
        } as EvaluationGraphPoint;
    });

    return <div className={styles.wrapper}>
        <ResponsiveContainer
            width={style?.width || "100%"}
            height={style?.height || 100}
        >
            <AreaChart
                className={`${styles.chart} ${className}`}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                data={dataPoints}
                onClick={event => {
                    const point = event.activePayload?.at(0)?.payload;
                    if (!point) return;

                    onPointClick?.(point as EvaluationGraphPoint);
                }}
            >
                <XAxis hide dataKey="x"/>
                <YAxis hide domain={[
                    0, absoluteHighestValue * 2 + (yAxisPadding * 2)
                ]}/>

                <Area
                    dataKey="y"
                    type="monotone"
                    fill="#fff"
                    fillOpacity={1}
                    strokeWidth={0}
                    isAnimationActive={false}
                />

                <ReferenceLine
                    y={absoluteHighestValue + yAxisPadding}
                    stroke="gray"
                    strokeOpacity={0.5}
                    strokeWidth={2}
                />

                <Tooltip content={({ label }) => {
                    const point = typeof label == "number"
                        && dataPoints[label];

                    return point
                        ? <TooltipRenderer dataPoint={point} />
                        : null;
                }}/>
            </AreaChart>
        </ResponsiveContainer>
    </div>;
}

export default EvaluationGraph;