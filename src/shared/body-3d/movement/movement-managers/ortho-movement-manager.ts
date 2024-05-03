import { KeyboardListener } from "src/shared/ui/keyboard-listener";
import { OrthoMovement } from "src/shared/body-3d/movement/movement-types/ortho-movement";
import { Timer } from "src/shared/runtime/timer";
import { Body3D } from "src/shared/body-3d";

export class OrthoMovementManager {
    #keyboardListener = new KeyboardListener();
    #movement = new OrthoMovement();

    attachToBody3D(player: Body3D, timer: Timer) {
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

    detachFromBody3D() {
        this.#keyboardListener.removeListener();
    };
}