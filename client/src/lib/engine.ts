import EngineVersion from "@constants/EngineVersion";

class Engine {
    private worker: Worker;

    constructor(version: EngineVersion) {
        this.worker = new Worker(version); 

        this.worker.postMessage("uci");

        this.worker.onmessage = event => console.log(event.data);
    }
}

export default Engine;