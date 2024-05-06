import { vec3 } from "gl-matrix";

export const worldConfig = {
    UP: vec3.fromValues(0, 1, 0),
    FRONT: vec3.fromValues(-1, 0, 0),
    RIGHT: vec3.fromValues(0, 0, 1)
}