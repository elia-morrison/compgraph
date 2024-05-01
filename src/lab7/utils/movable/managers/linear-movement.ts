import { BaseMovement } from "./base-movement";
import { Movable } from "../index";
import { Timer } from "../../../../shared/timer";
import { KeyboardListener } from "../../../../shared/keyboard-listener";
import { vec3 } from "gl-matrix";

export class LinearMovement extends BaseMovement {

    direction: vec3 = [0, 0, 0];
    movable: Movable;
    velocity = 0.005;

    // todo: remove bullets if lifespan is over
    timer: Timer;

    constructor({
        direction, movable
                }: {
        direction: vec3, movable: Movable
    }) {
        super();
        this.direction = direction;
        this.movable = movable;
    }

    move(timer: Timer) {
        vec3.add(
            this.movable.position,
            this.movable.position,
            vec3.scale(
                [0.0, 0.0, 0.0], this.direction, this.velocity * timer.timeDelta
            )
        );
    }
}