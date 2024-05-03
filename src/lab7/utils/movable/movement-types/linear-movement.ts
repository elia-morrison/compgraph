import { BaseMovement } from "./base-movement";
import { Movable } from "../index";
import { vec3 } from "gl-matrix";
import { Timer } from "src/shared/runtime/timer";

export class LinearMovement extends BaseMovement {
    moveEntity(movable: Movable, timer: Timer) {
        const newPosition = vec3.add(
            vec3.create(),
            movable.position,
            vec3.scale(
                [0.0, 0.0, 0.0], movable.direction, movable.velocity * timer.timeDelta
            )
        );
        movable.setPosition(newPosition);
    }
}