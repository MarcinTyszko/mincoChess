import { useTranslation } from "react-i18next";

import useGameSelectorStore from "@stores/GameSelectorStore";
import useAnalysisGameStore from "@stores/AnalysisGameStore";
import useAnalysisBoardStore from "@stores/AnalysisBoardStore";
import evaluateMoves from "@lib/evaluate";
import EngineVersion from "@constants/EngineVersion";
import getStateTree from "@lib/gameStateTree";
import { getChessComProfileImages, isGameFromChessCom } from "@lib/profileImages";

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

    const { setCurrentStateTreeNode } = useAnalysisBoardStore();

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
        const stateTreeRoot = getStateTree(selectedGame);

        const analysisGame = {
            ...selectedGame,
            accuracies: {
                black: 0,
                white: 0
            },
            estimatedRatings: {
                white: 0,
                black: 0
            },
            stateTree: stateTreeRoot
        };

        setAnalysisGame(analysisGame);

        setCurrentStateTreeNode(stateTreeRoot);

        // Load profile images from Chess.com if it is possible
        if (isGameFromChessCom(selectedGame)) {
            getChessComProfileImages(selectedGame).then(images => {
                analysisGame.players.white.image = images.white;
                analysisGame.players.black.image = images.black;

                setAnalysisGame(analysisGame);
            });
        }
        
        // Generate evaluations for each position
        const evaluatedStates = await evaluateMoves(
            selectedGame,
            {
                engineVersion: EngineVersion.STOCKFISH_16_1_LITE_SINGLE,
                engineDepth: 18,
                maxEngineCount: 4,
                engineConfig: engine => {
                    engine.setLineCount(2);
                    engine.setThreadCount(4);
                },
                onProgress: setAnalysisProgress
            }
        );

        console.log(evaluatedStates);
    }

    return analyse;
}

export default useAnalysis;