import { ReadonlyVec3, vec3 } from "gl-matrix";
import { Euler, Quaternion } from "three";
import { BaseMovement } from "./movement-types/base-movement";
import { Timer } from "src/shared/runtime/timer";

// todo: remove
export interface Movable {
    position: vec3;
    rotation: Euler;
    velocity: number;
    movement: BaseMovement | undefined;
    move(timer: Timer): void;

    direction: vec3;

    setPosition(pos: ReadonlyVec3): void;
    setRotation(rot: Quaternion | Euler): void;
}
