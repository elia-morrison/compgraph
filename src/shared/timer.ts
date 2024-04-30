class Timer {
    #currentTick = 0;
    #prevTick = 0;

    get timeDelta () {
        return this.#currentTick - this.#prevTick;
    }

    constructor() {
        this.reset();
    }

    reset() {
        this.#prevTick = performance.now();
        this.#currentTick = performance.now();
    }

    update(){
        this.#prevTick = this.#currentTick;
        this.#currentTick = performance.now();
    }
}

export {
    Timer
}