import React from "react";

import { getActivityDateKey } from "shared/lib/learning/streaks";

import * as styles from "./ActivityHeatmap.module.css";

interface ActivityHeatmapProps {
    activity: Record<string, number>;
    weeks?: number;
}

const DAY_MILLISECONDS = 24 * 60 * 60 * 1000;

function getIntensity(count: number) {
    if (count <= 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 9) return 3;

    return 4;
}

/**
 * @description GitHub-style contribution tiles of daily learning
 * activity; one column per week, one row per weekday.
 */
function ActivityHeatmap({ activity, weeks = 26 }: ActivityHeatmapProps) {
    const today = new Date();

    // Fill the current column up to today's weekday (Monday first)
    const todayRow = (today.getDay() + 6) % 7;

    const columns = [];

    for (let week = weeks - 1; week >= 0; week--) {
        const cells = [];

        for (let day = 0; day < 7; day++) {
            const offset = week * 7 + (todayRow - day);
            if (offset < 0) continue;

            const date = new Date(today.getTime() - offset * DAY_MILLISECONDS);
            const dateKey = getActivityDateKey(date);
            const count = activity[dateKey] || 0;

            cells.push(<div
                key={dateKey}
                className={styles.cell}
                data-intensity={getIntensity(count)}
                title={`${dateKey}: ${count}`}
                style={{ gridRow: day + 1 }}
            />);
        }

        columns.push(<div key={week} className={styles.column}>
            {cells}
        </div>);
    }

    return <div className={styles.wrapper}>
        <div className={styles.grid}>{columns}</div>

        <div className={styles.legend}>
            {[0, 1, 2, 3, 4].map(intensity => <div
                key={intensity}
                className={styles.cell}
                data-intensity={intensity}
            />)}
        </div>
    </div>;
}

export default ActivityHeatmap;
