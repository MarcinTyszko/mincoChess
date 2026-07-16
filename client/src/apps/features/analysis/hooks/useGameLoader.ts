import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";

import Game, { gameSchema } from "shared/types/game/Game";
import parseStateTree from "shared/lib/stateTree/parse";
import AnalysedGame from "shared/types/game/AnalysedGame";
import LocalStorageKey from "@/constants/LocalStorageKey";
import useAnalysisGameStore from "../stores/AnalysisGameStore";
import useAnalysisBoardStore from "../stores/AnalysisBoardStore";
import useRealtimeEngineStore from "../stores/RealtimeEngineStore";
import { getArchivedGame } from "@/lib/gameArchive";

function useGameLoader() {
    const [ searchParams ] = useSearchParams();

    const { setAnalysisGame, setGameAnalysisOpen } = useAnalysisGameStore(
        useShallow(state => ({
            setAnalysisGame: state.setAnalysisGame,
            setGameAnalysisOpen: state.setGameAnalysisOpen
        }))
    );

    const setCurrentStateTreeNode = useAnalysisBoardStore(
        state => state.setCurrentStateTreeNode
    );

    const setDisplayedEngineLines = useRealtimeEngineStore(
        state => state.setDisplayedEngineLines
    );

    function openGame(game: AnalysedGame) {
        setGameAnalysisOpen(true);
        setAnalysisGame(game);
        setCurrentStateTreeNode(game.stateTree);
        setDisplayedEngineLines(game.stateTree.state.engineLines);
    }

    /**
     * @description Games handed off from other pages (e.g. the profile's
     * recent games) are stashed in localStorage and opened once here.
     */
    function loadPendingGame() {
        const pendingGameJson = localStorage.getItem(
            LocalStorageKey.PENDING_ANALYSIS_GAME
        );

        if (!pendingGameJson) return false;

        localStorage.removeItem(LocalStorageKey.PENDING_ANALYSIS_GAME);

        try {
            const pendingGame: Game = gameSchema.parse(
                JSON.parse(pendingGameJson)
            );

            openGame({
                ...pendingGame,
                stateTree: parseStateTree(pendingGame)
            });

            return true;
        } catch {
            return false;
        }
    }

    async function loadGame() {
        const gameId = searchParams.get("game");

        if (!gameId) {
            loadPendingGame();
            return;
        }

        const { game } = await getArchivedGame(gameId);
        if (!game) return;

        openGame(game);
    }

    useEffect(() => {
        loadGame();
    }, []);
}

export default useGameLoader;