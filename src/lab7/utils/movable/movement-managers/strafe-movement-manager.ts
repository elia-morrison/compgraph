import { Movable } from "../index";
import { StrafeMovement } from "../movement-types/strafe-movement";
import { KeyboardListener } from "../../../../shared/ui/keyboard-listener";
import { Timer } from "../../../../shared/runtime/timer";

export class PlayerMovementManager {
    #keyboardListener = new KeyboardListener();
    #movement = new StrafeMovement();

    attachToMovable(player: Movable, timer: Timer) {
        player.movement = this.#movement;
        this.#movement.updateVectors(player);
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