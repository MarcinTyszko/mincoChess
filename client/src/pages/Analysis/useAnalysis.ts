import { useTranslation } from "react-i18next";

import useGameSelectorStore from "@stores/GameSelectorStore";
import useAnalysisGameStore from "@stores/AnalysisGameStore";
import useAnalysisBoardStore from "@stores/AnalysisBoardStore";
import useAnalysisProgressStore from "@stores/AnalysisProgressStore";
import evaluateMoves from "@lib/evaluate";
import getStateTree from "@lib/gameStateTree";
import { getChessComProfileImages, isGameFromChessCom } from "@lib/profileImages";
import { getSettings } from "@lib/settings";

function useAnalysis(
    setAnalysisError: (error: string | null) => void
) {
    const { t } = useTranslation();

    const {
        selectedGame,
        gameSelectorError
    } = useGameSelectorStore();

    const {
        setAnalysisGame,
        setGameAnalysisOpen
    } = useAnalysisGameStore();

    const { setAnalysisProgress } = useAnalysisProgressStore();

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
            stateTree: getStateTree(selectedGame)
        };

        setAnalysisGame(analysisGame);

        setCurrentStateTreeNode(analysisGame.stateTree);

        setGameAnalysisOpen(true);

        // Load profile images from Chess.com if it is possible
        if (isGameFromChessCom(selectedGame)) {
            getChessComProfileImages(selectedGame).then(images => {
                analysisGame.players.white.image = images.white;
                analysisGame.players.black.image = images.black;

                setAnalysisGame(analysisGame);
            });
        }
        
        // Generate evaluations for each position
        const settings = getSettings();

        try {
            const evaluatedStates = await evaluateMoves(
                analysisGame,
                {
                    engineVersion: settings.analysis.engine,
                    engineDepth: settings.analysis.engineDepth,
                    maxEngineCount: 4,
                    engineConfig: engine => {
                        engine.setLineCount(2);
                        engine.setThreadCount(4);
                    },
                    onProgress: setAnalysisProgress
                }
            );

            console.log(evaluatedStates);
        } catch {
            setGameAnalysisOpen(false);

            setAnalysisError(
                t("pages.analysis.analysisError")
            );
        }
    }

    return analyse;
}

export default useAnalysis;