import { BaseMovement } from "./base-movement";
import { Movable } from "../index";
import { vec3 } from "gl-matrix";
import { KeyboardListener } from "src/shared/ui/keyboard-listener";
import { Timer } from "src/shared/runtime/timer";
import { Euler } from "three";

const initialOrientation = {
    yaw: Math.PI * 0.5,
    pitch: 0.0,
    roll: 0.0,
}

export class StrafeMovement extends BaseMovement {
    #keyboardListener = new KeyboardListener();

    #velocity = 0.008;
    #turnVelocity = 0.01;
    #velocityStep = 0.005;
    #turnVelocityStep = 0.005;

    readonly #worldUp: vec3 = [0, 1, 0];

    #yaw = 0.0;
    #pitch = 0.0;
    #roll = 0.0;

    attachToMovable(player: Movable) {
        player.movement = this;
        this.updatePlayerRotation(player);
    }

    constructor({
            yaw= initialOrientation.yaw,
            pitch= initialOrientation.pitch,
            roll= initialOrientation.roll,
        } = initialOrientation
    ) {
        super();
        this.#yaw = yaw;
        this.#pitch = pitch;
        this.#roll = roll;
    }

    moveEntity(movable: Movable, timer: Timer) { }

    updatePlayerRotation(player: Movable) {
        player.setRotation(new Euler(this.#pitch, this.#yaw, this.#roll));
    }

    moveAlongDirection(player: Movable, timer: Timer, forwards = true) {
        const sign = forwards? 1.0 : - 1.0;
        const newPosition = vec3.add(
            vec3.create(),
            player.position,
            vec3.scale(
                [0.0, 0.0, 0.0], player.direction, sign * this.#velocity * timer.timeDelta
            )
        );
        player.setPosition(newPosition);
    }

    turnAroundX(player: Movable, timer: Timer, clockwise = true) {
        const sign = clockwise? -1.0 : 1.0;
        this.#pitch += sign * this.#turnVelocity * timer.timeDelta;
        this.updatePlayerRotation(player);
    }

    turnAroundY(player: Movable, timer: Timer, clockwise = true) {
        const sign = clockwise? -1.0 : 1.0;
        this.#yaw += sign * this.#turnVelocity * timer.timeDelta;
        this.updatePlayerRotation(player);
    }

    incVelocity() {
        this.#velocity +=  this.#velocityStep;
        this.#turnVelocity += this.#turnVelocityStep;
    }

    decVelocity() {
        const newVelocity = this.#velocity - this.#velocityStep;
        const newTurnVelocity = this.#velocity - this.#turnVelocityStep;
        if(newVelocity < 0 || newTurnVelocity < 0) return;
        this.#velocity = newVelocity;
        this.#turnVelocity = newTurnVelocity;
    }
}