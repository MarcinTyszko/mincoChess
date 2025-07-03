import useRealtimeEngineStore from "@analysis/stores/RealtimeEngineStore";
import useSettingsStore from "@/stores/SettingsStore";
import { useEffect, useState } from "react";
import { defaultEvaluation } from "shared/constants/utils";

function useEvaluation() {
    const engineEnabled = useSettingsStore(
        state => state.settings.analysis.engine.enabled
    );

    const { displayedEngineLines } = useRealtimeEngineStore();

    const [ evaluation, setEvaluation ] = useState(defaultEvaluation);

    useEffect(() => {
        const evaluation = displayedEngineLines.at(0)?.evaluation;
        if (!evaluation) return;

        setEvaluation(evaluation);
    }, [displayedEngineLines]);

    return engineEnabled ? evaluation : undefined;
}

export default useEvaluation;