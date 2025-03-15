import { useTranslation } from "react-i18next";

import { AnalysisGame } from "wintrchess";
import useGameSelectorStore from "@stores/GameSelectorStore";
import useAnalysisGameStore from "@stores/AnalysisGameStore";
import useAnalysisBoardStore from "@stores/AnalysisBoardStore";
import getStateTree from "@lib/gameStateTree";
import { getChessComProfileImages, isGameFromChessCom } from "@lib/profileImages";

function useImportGame(
    setImportError: (error: string | null) => void
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

    const { setCurrentStateTreeNode } = useAnalysisBoardStore();

    function importSelectedGame() {
        // Ensure a valid game has been selected
        if (gameSelectorError) {
            return setImportError(gameSelectorError);
        }

        if (!selectedGame) {
            return setImportError(
                t("pages.analysis.gameSelector.errors.noGameSelected")
            );
        }

        // Set analysis game to the selected one
        const analysisGame: AnalysisGame = {
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

        return analysisGame;
    }

    return importSelectedGame;
}

export default useImportGame;