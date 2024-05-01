import { BaseMovement } from "./base-movement";
import { Movable } from "../index";
import { Timer } from "../../../../shared/timer";
import { KeyboardListener } from "../../../../shared/keyboard-listener";

export class OrthoMovement extends BaseMovement {
    #keyboardListener = new KeyboardListener();


    detachFromMovable() {
        this.#keyboardListener.removeListener();
    };

    velocity = 0.005;

    // todo: move keyboard listening to some manager, leave only movement logic here
    attachToMovable(player: Movable, timer: Timer) {
        this.#keyboardListener.setListener([
            {
                keys: ['W', 'w'],
                callback: () => {
                    player.position[2] += this.velocity * timer.timeDelta;
                }
            },
            {
                keys: ['A', 'a'],
                callback: () => {
                    player.position[0] += this.velocity * timer.timeDelta;
                }
            },
            {
                keys: ['S', 's'],
                callback: () => {
                    player.position[2] -= this.velocity * timer.timeDelta;
                }
            },
            {
                keys: ['D', 'd'],
                callback: () => {
                    player.position[0] -= this.velocity * timer.timeDelta;
                }
            },
        ]);
    }
}