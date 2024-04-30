import { MovementManager } from "./movement-manager";
import { Player } from "../player";
import { Timer } from "../../../../shared/timer";
import { KeyboardListener } from "../../../../shared/keyboard-listener";

export class BaseMovement extends MovementManager {
    #keyboardListener = new KeyboardListener();


    detachFromPlayer() {
        this.#keyboardListener.removeListener();
    };

    velocity = 0.005;

    attachToPlayer(player: Player, timer: Timer) {
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