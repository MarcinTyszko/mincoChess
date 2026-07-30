/**
 * @description Request body limit for endpoints that carry a whole
 * analysed state tree (classification and archiving).
 *
 * An analysed game is much larger than the game itself: every position
 * carries the engine's lines, so the payload scales with move count x
 * lines x depth. A 60-move game at depth 16 with 2 lines is ~250 kB, and
 * the same game at depth 20 with 5 lines comfortably passes 1 MB — which
 * used to be rejected with a 413 halfway through automatic analysis, after
 * the engine had already done all the work. What actually gets stored is
 * gzipped to ~15 kB, so the headroom here is cheap.
 */
export const analysisBodyLimit = process.env.ANALYSIS_BODY_LIMIT || "4mb";
