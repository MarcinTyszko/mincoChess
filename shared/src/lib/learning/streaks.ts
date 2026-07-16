const DAY_MILLISECONDS = 24 * 60 * 60 * 1000;

/**
 * @description Local-time date key in YYYY-MM-DD format, used to index
 * daily learning activity.
 */
export function getActivityDateKey(date = new Date()) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${date.getFullYear()}-${month}-${day}`;
}

function parseDateKey(dateKey: string) {
    // Parse at midday to stay immune to DST shifts
    return new Date(`${dateKey}T12:00:00`);
}

/**
 * @description Current and longest streaks of consecutive active days.
 * The current streak still counts if today has no activity yet, as long
 * as yesterday was active.
 */
export function getStreaks(activity: Record<string, number>) {
    const activeDays = Object.entries(activity)
        .filter(([, count]) => count > 0)
        .map(([dateKey]) => dateKey)
        .sort();

    let longest = 0;
    let run = 0;
    let previousTime: number | undefined;

    for (const dateKey of activeDays) {
        const time = parseDateKey(dateKey).getTime();

        run = (
            previousTime != undefined
            && Math.round((time - previousTime) / DAY_MILLISECONDS) == 1
        ) ? run + 1 : 1;

        longest = Math.max(longest, run);
        previousTime = time;
    }

    const activeSet = new Set(activeDays);

    let current = 0;
    let cursor = new Date();

    // A streak may still be extended today, so a quiet today does not
    // break it; start counting from yesterday in that case
    if (!activeSet.has(getActivityDateKey(cursor))) {
        cursor = new Date(cursor.getTime() - DAY_MILLISECONDS);
    }

    while (activeSet.has(getActivityDateKey(cursor))) {
        current++;
        cursor = new Date(cursor.getTime() - DAY_MILLISECONDS);
    }

    return { current, longest };
}
