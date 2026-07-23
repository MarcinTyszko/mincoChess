import { StatusCodes } from "http-status-codes";

import Game from "shared/types/game/Game";
import AnalysedGame from "shared/types/game/AnalysedGame";
import parseStateTree from "shared/lib/stateTree/parse";
import { getGameAccuracy } from "shared/lib/reporter/accuracy";
import createGameEvaluator from "@analysis/lib/evaluate";
import { evaluateGameOnServer } from "@analysis/lib/serverEvaluate";
import { analyseStateTree } from "@analysis/lib/reporter";
import useSettingsStore from "@/stores/SettingsStore";
import useAutoAnalysisStore from "@/stores/AutoAnalysisStore";
import useLinkedAccountsStore from "@/stores/LinkedAccountsStore";
import {
    fetchRecentGames,
    getGameKey
} from "@/lib/games/recentGames";
import { getArchivedGames, archiveGame } from "@/lib/gameArchive";

// Background analysis should not hog the CPU like a foreground one
const MAX_BACKGROUND_ENGINES = 2;

type EngineLocation = "browser" | "server";

async function isSignedIn() {
    try {
        const profileResponse = await fetch("/api/account/profile");

        return profileResponse.ok;
    } catch {
        return false;
    }
}

/**
 * @description Analyse a single game in the background: evaluate every
 * position (cloud first, then local engines), classify the moves on the
 * server and save the result to the user's archive.
 */
async function analyseGameInBackground(game: Game): Promise<{
    archiveId: string;
    accuracies: Game["accuracies"];
}> {
    const { engine, classifications } = useSettingsStore
        .getState().settings.analysis;

    const { updateEntry } = useAutoAnalysisStore.getState();

    const gameKey = getGameKey(game);

    const analysisGame: AnalysedGame = {
        ...game,
        stateTree: parseStateTree(game)
    };

    // Evaluate every position with the engine the user picked for manual
    // analysis (which they have confirmed works), then classify and save.
    async function evaluateWith(location: EngineLocation) {
        if (location == "server") {
            await evaluateGameOnServer(
                analysisGame,
                engine,
                new AbortController(),
                { onProgress: progress => updateEntry(gameKey, { progress }) }
            );

            return;
        }

        const evaluator = createGameEvaluator(analysisGame, {
            engineVersion: engine.version,
            engineDepth: engine.depth,
            engineTimeLimit: engine.timeLimitEnabled
                ? engine.timeLimit : undefined,
            cloudEngineLines: engine.lines,
            maxEngineCount: MAX_BACKGROUND_ENGINES,
            engineConfig: gameEngine => gameEngine.setLineCount(engine.lines),
            onProgress: progress => updateEntry(gameKey, { progress })
        });

        await evaluator.evaluate();
    }

    const primary: EngineLocation = engine.location == "server"
        ? "server" : "browser";
    const fallback: EngineLocation = primary == "server"
        ? "browser" : "server";

    try {
        await evaluateWith(primary);
    } catch (primaryError) {
        // The chosen engine is unavailable on this deployment (e.g. the
        // server Stockfish binary, or a throttled browser worker). Retry on
        // the other engine from a clean tree so a broken engine no longer
        // means no background analysis at all.
        console.warn(
            `auto-analysis: ${primary} engine failed, retrying on `
            + `${fallback}`, primaryError
        );

        analysisGame.stateTree = parseStateTree(game);
        updateEntry(gameKey, { progress: 0 });

        try {
            await evaluateWith(fallback);
        } catch (fallbackError) {
            throw new Error(
                "evaluation failed: "
                + (fallbackError as Error).message
            );
        }
    }

    const analyseResult = await analyseStateTree(analysisGame.stateTree, {
        includeBrilliant: classifications.included.brilliant,
        includeCritical: classifications.included.critical,
        includeTheory: classifications.included.theory,
        declaredRatings: {
            white: analysisGame.players.white.rating,
            black: analysisGame.players.black.rating
        }
    });

    if (analyseResult.status != StatusCodes.OK || !analyseResult.gameAnalysis)
        throw new Error(`classification failed (HTTP ${analyseResult.status})`);

    // Average move accuracies of the analysed game, saved alongside it
    // so game listings can show them without loading the state tree
    const gameAccuracy = getGameAccuracy(
        analyseResult.gameAnalysis.stateTree
    );

    const accuracies: Game["accuracies"] = {
        white: isNaN(gameAccuracy.white) ? undefined : gameAccuracy.white,
        black: isNaN(gameAccuracy.black) ? undefined : gameAccuracy.black
    };

    const archiveResult = await archiveGame({
        ...analysisGame,
        ...analyseResult.gameAnalysis,
        accuracies: accuracies
    });

    if (!archiveResult.id) {
        throw archiveResult.status == StatusCodes.INSUFFICIENT_STORAGE
            ? new Error("archive full")
            : new Error(`save failed (HTTP ${archiveResult.status})`);
    }

    return { archiveId: archiveResult.id, accuracies };
}

/**
 * @description Fetch the signed-in user's most recent games from their
 * linked account, queue the ones not yet in the archive and analyse
 * them one by one. Runs at most once per page load.
 */
export async function runAutoAnalysis(): Promise<void> {
    const autoAnalysis = useAutoAnalysisStore.getState();

    if (autoAnalysis.started) return;
    autoAnalysis.setStarted(true);

    if (!await isSignedIn()) return;

    // Resolve the linked account, preferring chess.com
    await useLinkedAccountsStore.getState().syncWithServer();

    const { chessCom, lichess } = useLinkedAccountsStore.getState();

    const source = chessCom ? "chessCom" : "lichess";
    const username = chessCom || lichess;

    if (!username) return;

    // Games already analysed are matched by players and date
    const archiveResponse = await getArchivedGames();

    if (archiveResponse.status != StatusCodes.OK) return;

    const archivedGameKeys = new Set(
        Object.values(archiveResponse.games || {})
            .map(archivedGame => getGameKey(archivedGame))
    );

    const { autoAnalyseGamesCount, autoAnalyseAllGames } = useSettingsStore
        .getState().settings.analysis;

    const recentGames = await fetchRecentGames(
        source,
        username,
        autoAnalyseAllGames ? Infinity : autoAnalyseGamesCount
    );

    const pendingGames = recentGames.filter(
        game => !archivedGameKeys.has(getGameKey(game))
    );

    if (pendingGames.length == 0) return;

    autoAnalysis.setEntries(pendingGames.map(game => ({
        key: getGameKey(game),
        game: game,
        status: "queued",
        progress: 0
    })));

    const { updateEntry } = useAutoAnalysisStore.getState();

    for (const game of pendingGames) {
        const gameKey = getGameKey(game);

        updateEntry(gameKey, { status: "analysing" });

        try {
            const { archiveId, accuracies }
                = await analyseGameInBackground(game);

            updateEntry(gameKey, {
                status: "done",
                progress: 1,
                archiveId: archiveId,
                accuracies: accuracies
            });
        } catch (err) {
            const reason = (err as Error).message || "unknown error";

            // Surface the reason so a failing deployment is diagnosable
            // instead of games silently turning red
            console.error(`auto-analysis failed for ${gameKey}:`, err);

            updateEntry(gameKey, { status: "error", error: reason });

            // A full archive fails every following game the same way
            if (reason == "archive full") break;
        }
    }
}
