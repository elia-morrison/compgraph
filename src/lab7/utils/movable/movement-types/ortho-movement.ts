import { BaseMovement } from "./base-movement";
import { Movable } from "../index";
import { KeyboardListener } from "../../../../shared/ui/keyboard-listener";
import { Timer } from "../../../../shared/runtime/timer";

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