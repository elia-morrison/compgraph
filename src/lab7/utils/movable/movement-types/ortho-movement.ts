import { BaseMovement } from "./base-movement";
import { Movable } from "../index";
import { Timer } from "../../../../shared/timer";
import { KeyboardListener } from "../../../../shared/keyboard-listener";

export class OrthoMovement extends BaseMovement {
    #keyboardListener = new KeyboardListener();

    moveAlongDirection(player: Movable, timer: Timer, forwards = true) {
        const sign = forwards? 1.0 : - 1.0;
        player.position[2] += player.velocity * timer.timeDelta;
    }

    moveCrossDirection(player: Movable, timer: Timer, forwards = true) {
        const sign = forwards? 1.0 : - 1.0;
        player.position[0] += player.velocity * timer.timeDelta;
    }


    moveEntity(movable: Movable, timer: Timer) {

    }
}