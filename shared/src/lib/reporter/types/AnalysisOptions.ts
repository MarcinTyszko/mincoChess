interface AnalysisOptions {
    includeBrilliant?: boolean;
    includeCritical?: boolean;
    includeTheory?: boolean;
    declaredRatings?: {
        white?: number;
        black?: number;
    };
}

export default AnalysisOptions;
