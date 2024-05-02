import { Movable } from "../index";
import { OrthoMovement } from "../movement-types/ortho-movement";
import { Timer } from "../../../../shared/runtime/timer";
import { KeyboardListener } from "../../../../shared/ui/keyboard-listener";

export class OrthoMovementManager {
    #keyboardListener = new KeyboardListener();
    #movement = new OrthoMovement();

    attachToMovable(player: Movable, timer: Timer) {
        this.#keyboardListener.setListener([
            {
                keys: ['W', 'w'],
                callback: () => {
                    this.#movement.moveAlongDirection(player, timer,  true);
                }
            },
            {
                keys: ['A', 'a'],
                callback: () => {
                    this.#movement.moveCrossDirection(player, timer,  true);
                }
            },
            {
                keys: ['S', 's'],
                callback: () => {
                    this.#movement.moveAlongDirection(player, timer,  false);
                }
            },
            {
                keys: ['D', 'd'],
                callback: () => {
                    this.#movement.moveCrossDirection(player, timer,  false);
                }
            },
        ]);
    }

    detachFromMovable() {
        this.#keyboardListener.removeListener();
    };
}