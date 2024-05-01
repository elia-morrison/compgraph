import { BaseMovement } from "./base-movement";
import { Movable } from "../index";
import { Timer } from "../../../../shared/timer";
import { KeyboardListener } from "../../../../shared/keyboard-listener";
import { vec3 } from "gl-matrix";

export class LinearMovement extends BaseMovement {
    moveEntity(movable: Movable, timer: Timer) {
        vec3.add(
            movable.position,
            movable.position,
            vec3.scale(
                [0.0, 0.0, 0.0], movable.direction, movable.velocity * timer.timeDelta
            )
        );
    }
}