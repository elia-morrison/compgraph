import { MovementManager } from "./movement-manager";
import { Player } from "../player";
import { Timer } from "../../../../shared/timer";
import { vec3 } from "gl-matrix";
import { KeyboardListener } from "../../../../shared/keyboard-listener";

export class StrafeMovement extends MovementManager {
    #keyboardListener = new KeyboardListener();

    detachFromPlayer() {
        this.#keyboardListener.removeListener();
    };

    velocity = 0.005;
    turnVelocity = 0.005;

    #front: vec3 = [-1, 0, 0];
    #right: vec3 = [0, 0, -1];
    #up: vec3 = [0, 1, 0];
    #worldUp: vec3 = [0, 1, 0];

    #yaw = 0.0;
    #pitch = 0.0;
    #roll = 0.0;

    #updateVectors() {
        vec3.normalize(this.#front, [
            -Math.cos(this.#yaw),
            Math.sin(this.#pitch), // 0.0
            Math.sin(this.#yaw)
        ]);
        vec3.normalize(
            this.#right,
            vec3.cross(
                [0, 0, 0], this.#front, this.#worldUp
            )
        );
        vec3.normalize(
            this.#up,
            vec3.cross([0, 0, 0], this.#right, this.#front)
        );
    }

    // todo: place vec3.add there
    #updatePlayerPosition(player: Player, timer: Timer, forwards= true) {
        const sign = forwards? 1.0 : - 1.0;
        vec3.add(
            player.position,
            player.position,
            vec3.scale(
                [0.0, 0.0, 0.0], this.#front, sign * this.velocity * timer.timeDelta
            )
        );
    }

    #updatePlayerRotation(player: Player) {
        player.rotation.set(this.#pitch, this.#yaw, this.#roll);
    }

    attachToPlayer(player: Player, timer: Timer) {
        this.#keyboardListener.setListener([
            {
                keys: ['W', 'w'],
                callback: () => {
                    this.#updatePlayerPosition(player, timer);
                }
            },
            {
                keys: ['A', 'a'],
                callback: () => {
                    this.#yaw += this.turnVelocity * timer.timeDelta;
                    this.#updateVectors();
                    this.#updatePlayerRotation(player);
                }
            },
            {
                keys: ['S', 's'],
                callback: () => {
                    this.#updatePlayerPosition(player, timer, false);
                }
            },
            {
                keys: ['D', 'd'],
                callback: () => {
                    this.#yaw -= this.turnVelocity * timer.timeDelta;
                    this.#updateVectors();
                    this.#updatePlayerRotation(player);
                }
            },
        ]);
    }
}