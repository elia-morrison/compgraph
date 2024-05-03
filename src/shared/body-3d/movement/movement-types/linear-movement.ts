import { BaseMovement } from "./base-movement";
import { vec3 } from "gl-matrix";
import { Timer } from "src/shared/runtime/timer";
import { Body3D } from "src/shared/body-3d";

export class LinearMovement extends BaseMovement {
    moveEntity(movable: Body3D, timer: Timer) {
        vec3.add(
            movable.position,
            movable.position,
            vec3.scale(
                [0.0, 0.0, 0.0], movable.direction, movable.velocity * timer.timeDelta
            )
        );
    }
}