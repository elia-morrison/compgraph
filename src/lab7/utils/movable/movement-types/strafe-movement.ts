import { BaseMovement } from "./base-movement";
import { Movable } from "../index";
import { Timer } from "../../../../shared/timer";
import { vec3 } from "gl-matrix";
import { KeyboardListener } from "../../../../shared/keyboard-listener";

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

    #front: vec3 = [0, 0, 0];
    #right: vec3 = [0, 0, 0];
    #up: vec3 = [0, 0, 0];
    readonly #worldUp: vec3 = [0, 1, 0];

    #yaw = 0.0;
    #pitch = 0.0;
    #roll = 0.0;

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
        player.rotation.set(this.#pitch, this.#yaw, this.#roll);
    }

    updateVectors(player: Movable) {
        this.updatePlayerRotation(player);
        this.#front = vec3.clone(player.direction);
        vec3.normalize(
            this.#right,
            vec3.cross(
                [0, 0, 0], this.#front, this.#worldUp
            )
        );
        vec3.normalize(
            this.#up,
            vec3.cross([0, 0, 0], this.#right, this.#front)
        );
    }

    moveAlongDirection(player: Movable, timer: Timer, forwards = true) {
        const sign = forwards? 1.0 : - 1.0;
        vec3.add(
            player.position,
            player.position,
            vec3.scale(
                [0.0, 0.0, 0.0], this.#front, sign * this.#velocity * timer.timeDelta
            )
        );
    }

    turnAroundX(player: Movable, timer: Timer, clockwise = true) {
        const sign = clockwise? -1.0 : 1.0;
        this.#pitch += sign * this.#turnVelocity * timer.timeDelta;
        this.updateVectors(player);
    }

    turnAroundY(player: Movable, timer: Timer, clockwise = true) {
        const sign = clockwise? -1.0 : 1.0;
        this.#yaw += sign * this.#turnVelocity * timer.timeDelta;
        this.updateVectors(player);
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