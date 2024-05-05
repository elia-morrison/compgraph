import { KeyboardListener } from "src/shared/ui/keyboard-listener";
import { Timer } from "src/shared/runtime/timer";
import { StrafeMovement } from "src/shared/base/movable/movement-types/strafe-movement";
import { Movable } from "src/shared/base/movable";

export class PlayerMovementManager {
    #keyboardListener = new KeyboardListener();
    #movement = new StrafeMovement();

    attachToMovable(
        player: Movable,
        timer: Timer,
    ) {
        this.#movement.attachToMovable(player);
        this.#keyboardListener.setListener([
            {
                keys: ['W', 'w'],
                callback: () => {
                    this.#movement.moveAlongDirection(player, timer, true);
                }
            },
            {
                keys: ['S', 's'],
                callback: () => {
                    this.#movement.moveAlongDirection(player, timer, false);
                }
            },
            {
                keys: ['Q', 'q'],
                callback: () => {
                    this.#movement.turnAroundY(player, timer, false)
                }
            },
            {
                keys: ['E', 'e'],
                callback: () => {
                    this.#movement.turnAroundY(player, timer, true)
                }
            },
            // todo: add when pitch yaw roll enabled in body3d class
            {
                keys: ['ArrowUp'],
                callback: () => {
                    this.#movement.turnAroundX(player, timer, false)
                }
            },
            {
                keys: ['ArrowDown'],
                callback: () => {
                    this.#movement.turnAroundX(player, timer, true)
                }
            },
            {
                keys: ['R', 'r'],
                callback: () => {
                    this.#movement.decVelocity();
                }
            },
            {
                keys: ['T', 't'],
                callback: () => {
                    this.#movement.incVelocity();
                }
            },
        ]);
    }

    detachFromMovable() {
        this.#keyboardListener.removeListener();
    };
}