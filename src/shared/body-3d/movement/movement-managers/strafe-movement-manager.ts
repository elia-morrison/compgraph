import { KeyboardListener } from "src/shared/ui/keyboard-listener";
import { StrafeMovement } from "src/shared/body-3d/movement/movement-types/strafe-movement";
import { Body3D } from "src/shared/body-3d";
import { Timer } from "src/shared/runtime/timer";

export class PlayerMovementManager {
    #keyboardListener = new KeyboardListener();
    #movement = new StrafeMovement();

    attachToBody3D(player: Body3D, timer: Timer) {
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

    detachFromBody3D() {
        this.#keyboardListener.removeListener();
    };
}