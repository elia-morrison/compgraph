import { ReadonlyVec3, mat4, quat2 } from "gl-matrix";
import { Euler } from "three";
import { ObjectGL } from "./objectGL";

export class Tetrahedron extends ObjectGL {
    constructor(position: ReadonlyVec3, rotation: Euler) {
        super();

        this.setPosition(position);
        this._rotation = rotation;

        this.flat_vertices = [
            0.0, 2.0, 0.0, 0.1, 1.0, 1.0,
            -1.63, -0.66, -0.94, 1.0, 0.0, 0.3,
            0, -0.66, 1.88, 0.7, 0.5, 0.1,
            1.63, -0.66, -0.94, 0.8, 0.2, 0.1
        ];

        this.faceIndices = [
            0, 3, 1,
            3, 2, 1,
            3, 0, 2,
            0, 1, 2
        ];

        this.updateWorldMatrix();
    }
}

export class Cube extends ObjectGL {
    constructor(position: ReadonlyVec3, rotation: Euler) {
        super();

        this.setPosition(position);
        this._rotation = rotation;

        this.flat_vertices =
            // X, Y, Z           R, G, B           texture
            // Top
            [-1.0, 1.0, -1.0, 0.5, 0.5, 0.5,
            -1.0, 1.0, 1.0, 1.0, 0.5, 0.15,
                1.0, 1.0, 1.0, 0.3, 1.0, 0.7,
                1.0, 1.0, -1.0, 0.4, 0.6, 0.0,

            // Left
            -1.0, 1.0, 1.0, 0.75, 0.25, 0.5,
            -1.0, -1.0, 1.0, 0.75, 0.25, 0.0,
            -1.0, -1.0, -1.0, 1.0, 0.25, 0.5,
            -1.0, 1.0, -1.0, 0.75, 1.0, 0.5,

                // Right
                1.0, 1.0, 1.0, 0.25, 1.0, 0.75,
                1.0, -1.0, 1.0, 0.0, 0.0, 0.75,
                1.0, -1.0, -1.0, 0.9, 0.25, 0.0,
                1.0, 1.0, -1.0, 0.9, 0.0, 0.75,

                // Front
                1.0, 1.0, 1.0, 1.0, 1.0, 0.15,
                1.0, -1.0, 1.0, 0.6, 0.0, 0.15,
            -1.0, -1.0, 1.0, 1.0, 0.0, 1.0,
            -1.0, 1.0, 1.0, 0.0, 0.5, 0.9,

                // Back
                1.0, 1.0, -1.0, 0.0, 1.0, 0.15,
                1.0, -1.0, -1.0, 0.3, 0.0, 0.9,
            -1.0, -1.0, -1.0, 1.0, 0.0, 0.15,
            -1.0, 1.0, -1.0, 0.5, 0.0, 1.0,

            // Bottom
            -1.0, -1.0, -1.0, 0.5, 0.5, 0.3,
            -1.0, -1.0, 1.0, 1.0, 0.5, 1.0,
                1.0, -1.0, 1.0, 0.5, 0.8, 1.0,
                1.0, -1.0, -1.0, 0.5, 0.5, 0.0,
            ];

        this.faceIndices =// Top
            [0, 1, 2,
                0, 2, 3,

                // Left
                5, 4, 6,
                6, 4, 7,

                // Right
                8, 9, 10,
                8, 10, 11,

                // Front
                13, 12, 14,
                15, 14, 12,

                // Back
                16, 17, 18,
                16, 18, 19,

                // Bottom
                21, 20, 22,
                22, 20, 23
            ];
            
        this.updateWorldMatrix();
    }
}
