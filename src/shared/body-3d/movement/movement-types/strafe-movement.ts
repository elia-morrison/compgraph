import { BaseMovement } from "./base-movement";
import { vec3 } from "gl-matrix";
import { KeyboardListener } from "src/shared/ui/keyboard-listener";
import { Timer } from "src/shared/runtime/timer";
import { Body3D } from "src/shared/body-3d";

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

    moveEntity(movable: Body3D, timer: Timer) { }

    updatePlayerRotation(player: Body3D) {
        player.rotation.set(this.#pitch, this.#yaw, this.#roll);
    }

    updateVectors(player: Body3D) {
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

    moveAlongDirection(player: Body3D, timer: Timer, forwards = true) {
        const sign = forwards? 1.0 : - 1.0;
        vec3.add(
            player.position,
            player.position,
            vec3.scale(
                [0.0, 0.0, 0.0], this.#front, sign * this.#velocity * timer.timeDelta
            )
        );
    }

    turnAroundX(player: Body3D, timer: Timer, clockwise = true) {
        const sign = clockwise? -1.0 : 1.0;
        this.#pitch += sign * this.#turnVelocity * timer.timeDelta;
        this.updateVectors(player);
    }

    turnAroundY(player: Body3D, timer: Timer, clockwise = true) {
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