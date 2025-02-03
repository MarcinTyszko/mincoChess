import { useTranslation } from "react-i18next";

import useGameSelectorStore from "@stores/GameSelectorStore";
import useAnalysisGameStore from "@stores/AnalysisGameStore";
import evaluateMoves from "@lib/evaluate";
import EngineVersion from "@constants/EngineVersion";
import getStateTree from "@lib/gameStateTree";

function useAnalysis(
    setAnalysisError: React.Dispatch<React.SetStateAction<string | null>>,
    setAnalysisProgress: React.Dispatch<React.SetStateAction<number>>
) {
    const { t } = useTranslation();

    const {
        selectedGame,
        gameSelectorError
    } = useGameSelectorStore();

    const { setAnalysisGame } = useAnalysisGameStore();

    async function analyse() {
        // Ensure a valid game has been selected
        if (gameSelectorError) {
            return setAnalysisError(gameSelectorError);
        }

        if (!selectedGame) {
            return setAnalysisError(
                t("pages.analysis.gameSelector.errors.noGameSelected")
            );
        }

        // Set analysis game to the selected one
        setAnalysisGame({
            ...selectedGame,
            accuracies: {
                black: 0,
                white: 0
            },
            estimatedRatings: {
                white: 0,
                black: 0
            },
            stateTree: getStateTree(selectedGame)
        });

        console.log(getStateTree(selectedGame));
        
        // Generate evaluations for each position
        const evaluatedStates = await evaluateMoves(
            selectedGame,
            {
                engineVersion: EngineVersion.STOCKFISH_16_1_LITE_SINGLE,
                engineDepth: 18,
                maxEngineCount: 4,
                engineConfig: engine => engine.setLineCount(2),
                onProgress: setAnalysisProgress
            }
        );

        console.log(evaluatedStates);
    }

    return analyse;
}

export default useAnalysis;