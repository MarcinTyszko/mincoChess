// This is a stub for a package containing
// libraries and types used by both the backend
// and frontend, and can be imported with
// import { ... } from "wintrchess"

// An example module in the shared package with an enum
// defining sources from which a Stockfish evaluation came from
// as in it was computed by the local browser Stockfish or taken
// from a cloud evaluations database (Lichess)
export { default as EvaluationSource } from "./types/EvaluationSource";