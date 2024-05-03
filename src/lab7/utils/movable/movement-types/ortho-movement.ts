import { BaseMovement } from "./base-movement";
import { Movable } from "../index";
import { KeyboardListener } from "src/shared/ui/keyboard-listener";
import { Timer } from "src/shared/runtime/timer";
import { vec3 } from "gl-matrix";

export class OrthoMovement extends BaseMovement {
    #keyboardListener = new KeyboardListener();

    moveAlongDirection(player: Movable, timer: Timer, forwards = true) {
        const sign = forwards? 1.0 : - 1.0;
        const z= sign * player.velocity * timer.timeDelta;
        player.setPosition(vec3.fromValues(player.position[0], player.position[1], z));
    }

    moveCrossDirection(player: Movable, timer: Timer, forwards = true) {
        const sign = forwards? 1.0 : - 1.0;
        const x= sign * player.velocity * timer.timeDelta;
        player.setPosition(vec3.fromValues(x, player.position[1], player.position[2]));
    }


    moveEntity(movable: Movable, timer: Timer) {

    }
}