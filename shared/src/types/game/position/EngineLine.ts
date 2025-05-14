import { uniq } from "lodash";

import EngineVersion from "@constants/EngineVersion";
import Evaluation from "./Evaluation";
import Move from "./Move";

export interface EngineLine {
    evaluation: Evaluation;
    source: EngineVersion;
    depth: number;
    index: number;
    moves: Move[];
}

export function isEngineLineEqual(line: EngineLine, other: EngineLine) {
    return (
        line.depth == other.depth
        && line.index == other.index
        && line.source == other.source
    );
}

/**
 * @description Returns the best set of engine lines that meet all given
 * criteria, or null if any of the criteria cannot be met. Regardless of
 * target source, Lichess cloud lines will be returned if found. Returned
 * lines are NOT copied!
 */
export function pickEngineLines(
    lines: EngineLine[],
    targets?: {
        count?: number;
        depth?: number;
        source?: EngineVersion;
    }
) {
    const {
        count: targetCount = Infinity,
        depth: targetDepth = 0,
        source: targetSource
    } = targets || {};

    const depths = uniq(lines
        .filter(line => line.depth >= targetDepth)
        .map(line => line.depth)
        .sort((a, b) => b - a)
    );

    function findLineSet(depth: number, source: EngineVersion) {
        const lineSet: EngineLine[] = [];

        while (lineSet.length < targetCount) {
            const nextLine = lines.find(line => (
                line.depth == depth
                && line.source == source
                && line.index == lineSet.length + 1
            ));
            if (!nextLine) break;

            lineSet.push(nextLine);
        }

        return lineSet;
    }

    for (const depth of depths) {
        const lineSets = Object.values(EngineVersion)
            .filter(source => (
                source == EngineVersion.LICHESS_CLOUD
                || (!targetSource || source == targetSource)
            ))
            .map(source => findLineSet(depth, source));

        const qualifyingLineSet = lineSets.find(
            lineSet => lineSet.length == targetCount
        );

        if (qualifyingLineSet) {
            return qualifyingLineSet.sort((a, b) => a.index - b.index);
        }
    }

    return null;
}