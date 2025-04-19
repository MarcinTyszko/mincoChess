import { useTranslation } from "react-i18next";

import { AnalysedGame } from "wintrchess";
import useGameSelectorStore from "@stores/GameSelectorStore";
import useAnalysisGameStore from "@apps/training/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@apps/training/stores/AnalysisBoardStore";
import parseStateTree from "@lib/gameStateTree";
import { getChessComProfileImages, isGameFromChessCom } from "@lib/profileImages";

function useImportGame() {
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
            throw new Error(gameSelectorError);
        }

        if (!selectedGame) {
            throw new Error(
                t("pages.analysis.gameSelector.errors.noGameSelected")
            );
        }

        // Set analysis game to the selected one
        const analysisGame: AnalysedGame = {
            ...selectedGame,
            stateTree: parseStateTree(selectedGame)
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