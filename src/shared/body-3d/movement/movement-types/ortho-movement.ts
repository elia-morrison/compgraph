import { BaseMovement } from "./base-movement";
import { KeyboardListener } from "src/shared/ui/keyboard-listener";
import { Timer } from "src/shared/runtime/timer";
import { Body3D } from "src/shared/body-3d";

export class OrthoMovement extends BaseMovement {
    #keyboardListener = new KeyboardListener();

    moveAlongDirection(player: Body3D, timer: Timer, forwards = true) {
        const sign = forwards? 1.0 : - 1.0;
        player.position[2] += player.velocity * timer.timeDelta;
    }

    moveCrossDirection(player: Body3D, timer: Timer, forwards = true) {
        const sign = forwards? 1.0 : - 1.0;
        player.position[0] += player.velocity * timer.timeDelta;
    }


    moveEntity(movable: Body3D, timer: Timer) {

    }
}