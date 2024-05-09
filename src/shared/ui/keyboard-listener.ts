type ListenerCallback = (() => Promise<void>) | (() => void);
type Listener = (event: KeyboardEvent) => Promise<void>;

export class KeyboardListener {
    #listener: Listener;

    setListener(keyToCallbackMap: Array<{
        keys: Array<string>,
        callback: ListenerCallback,
    }>) {
        this.#listener = async (event: KeyboardEvent) => {
            const { key } = event;
            for (const { keys, callback } of keyToCallbackMap) {
                const keysSet = new Set(keys);
                if (keysSet.has(key)) {
                    await callback();
                    return;
                }
            }
        };
        document.addEventListener(
            'keydown',
            this.#listener,
            true,
        );

    }

    removeListener() {
        document.removeEventListener(
            'keydown',
            this.#listener,
        );
    }
}

