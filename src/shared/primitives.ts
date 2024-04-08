import { ReadonlyVec3, mat4, quat2 } from "gl-matrix";
import { Euler } from "three";
import { ObjectGL } from "./objectGL";

export class Cube extends ObjectGL {
    constructor(position: ReadonlyVec3, rotation: Euler) {
        super();

        this.setPosition(position);
        this._rotation = rotation;

        this.flat_vertices =
            [
                // back
                -1, -1, 1, 0, 0, 1, 0, 1,
                1, -1, 1, 0, 0, 1, 1, 1,
                1, 1, 1, 0, 0, 1, 1, 0,
                -1, 1, 1, 0, 0, 1, 0, 0,

                // front
                -1, -1, -1, 0, 0, -1, 1, 1,
                1, -1, -1, 0, 0, -1, 0, 1,
                1, 1, -1, 0, 0, -1, 0, 0,
                -1, 1, -1, 0, 0, -1, 1, 0,

                -1, -1, 1, 0, -1, 0, 1, 1,
                1, -1, 1, 0, -1, 0, 0, 1,
                1, -1, -1, 0, -1, 0, 0, 0,
                -1, -1, -1, 0, -1, 0, 1, 0,

                // top
                -1, 1, 1, 0, 1, 0, 0, 1,
                1, 1, 1, 0, 1, 0, 1, 1,
                1, 1, -1, 0, 1, 0, 1, 0,
                -1, 1, -1, 0, 1, 0, 0, 0,
                -1, -1, 1, -1, 0, 0, 1, 1,
                -1, 1, 1, -1, 0, 0, 1, 0,
                -1, 1, -1, -1, 0, 0, 0, 0,
                -1, -1, -1, -1, 0, 0, 0, 1,
                1, -1, 1, 1, 0, 0, 0, 1,
                1, 1, 1, 1, 0, 0, 0, 0,
                1, 1, -1, 1, 0, 0, 1, 0,
                1, -1, -1, 1, 0, 0, 1, 1
            ];

        this.faceIndices =
            [
                0, 1, 2, 0, 2, 3,
                5, 4, 6, 6, 4, 7,
                8, 9, 10, 8, 10, 11,
                12, 13, 14, 12, 14, 15,
                16, 17, 18, 16, 18, 19,
                21, 20, 22, 22, 20, 23
            ];

        this.updateWorldMatrix();
    }
}
