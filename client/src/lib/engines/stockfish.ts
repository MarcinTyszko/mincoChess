class Stockfish {
    constructor() {
        const worker = new Worker("stockfish-16.1-lite-single.js"); 

        worker.postMessage("uci");

        worker.onmessage = event => console.log(event.data);
    }
}

export default Stockfish;