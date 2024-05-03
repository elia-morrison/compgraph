import { vec3 } from "gl-matrix";
import { Euler } from "three";
import { BaseMovement } from "./movement-types/base-movement";
import { Timer } from "src/shared/runtime/timer";

export interface Movable {
    position: vec3;
    rotation: Euler;
    velocity: number;
    movement: BaseMovement | undefined;
    move(timer: Timer): void;
}
