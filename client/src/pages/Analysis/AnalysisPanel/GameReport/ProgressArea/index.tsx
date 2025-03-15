import React, { useEffect } from "react";

import useAnalysisProgressStore from "@stores/AnalysisProgressStore";
import ProgressReporter from "@components/analysis/ProgressReporter";

function ProgressArea() {
    const {
        analysisProgress,
        analysisError
    } = useAnalysisProgressStore();

    useEffect(() => {
        if (analysisProgress < 1) return;

        if (!document.hasFocus()) {
            document.title = "Analysis Complete";
        }

        function focusListener() {
            document.title = "WintrChess";
            removeEventListener("focus", focusListener);
        }

        addEventListener("focus", focusListener);
    }, [analysisProgress]);

    return <>
        {
            analysisProgress < 1
            && <ProgressReporter
                progress={analysisProgress}
                error={analysisError}
            />
        }
    </>;
}

export default ProgressArea;