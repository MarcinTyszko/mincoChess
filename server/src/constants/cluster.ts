import os from "os";

export const coreCount = Math.max(1, os.cpus().length);

/**
 * @description How many cluster workers the server runs.
 *
 * One worker per core is the obvious default, but it is a poor fit here:
 * every worker is a full Node heap (~70-110 MB resident) *and* owns its
 * own Stockfish pool, so a 12-core host ended up with 12 workers holding
 * up to 12 engines at ~364 MB each — several gigabytes for a server that
 * is mostly idle. This app is also expected to share a host with other
 * services, so it stays deliberately small unless told otherwise.
 */
export const workerCount = Math.max(1, Math.min(
    Number(process.env.SERVER_WORKERS) || 2,
    coreCount
));
