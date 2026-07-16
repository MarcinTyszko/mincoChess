import z from "zod";

export const learningProgressSchema = z.object({
    favourites: z.array(z.string().max(120)).max(500),
    completed: z.array(z.string().max(400)).max(10000),
    activity: z.record(
        z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        z.number().int().min(0).max(100000)
    )
});

export type LearningProgress = z.infer<typeof learningProgressSchema>;

export const emptyLearningProgress: LearningProgress = {
    favourites: [],
    completed: [],
    activity: {}
};

/**
 * @description Merge two progress records without losing anything;
 * used to reconcile locally stored progress with the server's copy.
 */
export function mergeLearningProgress(
    first: LearningProgress,
    second: LearningProgress
): LearningProgress {
    const activity: Record<string, number> = { ...first.activity };

    for (const [date, count] of Object.entries(second.activity)) {
        activity[date] = Math.max(activity[date] || 0, count);
    }

    return {
        favourites: [...new Set([
            ...first.favourites, ...second.favourites
        ])],
        completed: [...new Set([
            ...first.completed, ...second.completed
        ])],
        activity: activity
    };
}

export default LearningProgress;
