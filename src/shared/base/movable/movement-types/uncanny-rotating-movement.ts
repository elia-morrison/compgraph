import { BaseMovement } from "./base-movement";
import { Movable } from "../index";
import { Timer } from "src/shared/runtime/timer";
import { Euler } from "three";

export class UncannyRotatingMovement extends BaseMovement {

    #pitchYawRoll = new Euler(0,0,0);

    #turnVelocity = 0.001;

    attachToMovable(movable: Movable) {
        movable.movement = this;
        movable.setPitchYawRoll((new Euler).copy(this.#pitchYawRoll));
    }

    moveEntity(movable: Movable, timer: Timer) {
        this.#pitchYawRoll.x += this.#turnVelocity * timer.timeDelta;
        this.#pitchYawRoll.y += this.#turnVelocity * timer.timeDelta;
        this.#pitchYawRoll.z += this.#turnVelocity * timer.timeDelta;

        movable.setPitchYawRoll((new Euler).copy(this.#pitchYawRoll));
    }
}