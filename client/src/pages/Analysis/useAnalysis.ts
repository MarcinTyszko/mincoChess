import { useTranslation } from "react-i18next";
import { parse as getMoveTree } from "pgn-parser";

import useGameSelectorStore from "@stores/GameSelectorStore";
import useLoadedGameStore from "@stores/LoadedGameStore";
import parsePgn from "@lib/games/pgn";
import parseFenString from "@lib/games/fen";
import GameSource from "@constants/GameSource";
import evaluateMoves from "@lib/evaluate";
import EngineVersion from "@constants/EngineVersion";

function useAnalysis(
    setAnalysisError: React.Dispatch<React.SetStateAction<string | null>>,
    setAnalysisProgress: React.Dispatch<React.SetStateAction<number>>
) {
    const { t } = useTranslation();

    const {
        selectedGameSource,
        selectedGameInput,
        selectedGame,
        setSelectedGame
    } = useGameSelectorStore();

    const {
        setLoadedGame,
        setLoadedMoveTree,
        setMoveTreeCursor
    } = useLoadedGameStore();

    async function analyse() {
        let analysisGame = selectedGame;

        // Validate that a game has been selected
        if (selectedGameSource.requiresSearch) {
            if (!selectedGame) {
                return setAnalysisError(
                    t("pages.analysis.gameSelector.errors.noGameSelected")
                );
            }
        } else if (selectedGameInput.length == 0) {
            return setAnalysisError(
                t("pages.analysis.gameSelector.errors.noGameSelected")
            );
        } else {
            // Parse FEN or PGN into game object
            try {
                analysisGame = selectedGameSource == GameSource.PGN
                    ? parsePgn(selectedGameInput)
                    : parseFenString(selectedGameInput);

                setSelectedGame(analysisGame);
            } catch {
                return setAnalysisError(
                    t("pages.analysis.gameSelector.errors.invalidGame")
                );
            }
        }

        if (!analysisGame) {
            return setAnalysisError(
                t("pages.analysis.gameSelector.errors.noGameSelected")
            );
        }

        // Set game as loaded one
        setLoadedGame(analysisGame);

        try {
            setLoadedMoveTree(
                getMoveTree(analysisGame.pgn)[0]
            );
        } catch {
            return setAnalysisError(
                t("pages.analysis.gameSelector.errors.invalidGame")
            );
        }
        
        setMoveTreeCursor([0]);
        
        // Generate evaluations for each position
        const evaluatedStates = await evaluateMoves(
            analysisGame,
            {
                engineVersion: EngineVersion.STOCKFISH_16_1_LITE_SINGLE,
                engineDepth: 18,
                maxEngineCount: 4,
                engineConfig: engine => engine.setLineCount(2),
                verbose: true,
                onProgress: progress => setAnalysisProgress(progress)
            }
        );

        console.log(evaluatedStates);
    }

    return analyse;
}

export default useAnalysis;