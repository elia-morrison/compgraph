import { ReadonlyVec3, mat4, quat2 } from "gl-matrix";
import { Euler } from "three";
import { ObjectGL } from "./objectGL";

class Cube extends ObjectGL {
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
                -1, 1, 1, 0, 1, 0, 1, 0,
                1, 1, 1, 0, 1, 0, 0, 0,
                1, 1, -1, 0, 1, 0, 0, 1,
                -1, 1, -1, 0, 1, 0, 1, 1,

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

class Plane extends ObjectGL {
    constructor(position: ReadonlyVec3, rotation: Euler) {
        super();

        this.setPosition(position);
        this._rotation = rotation;

        this.flat_vertices =
            [
                -1, -1, -1, 0, 0, -1, 1, 1,
                1, -1, -1, 0, 0, -1, 0, 1,
                1, 1, -1, 0, 0, -1, 0, 0,
                -1, 1, -1, 0, 0, -1, 1, 0,
            ];

        this.faceIndices =
            [
                0, 1, 2, 0, 2, 3
            ];

        this.updateWorldMatrix();
    }
}

class Triangle extends ObjectGL {
    constructor(position: ReadonlyVec3, rotation: Euler) {
        super();

        this.setPosition(position);
        this._rotation = rotation;

        this.flat_vertices =
            [
                -1, 0, 0, 1, 0, 0, 0, 0,
                1, 0, 0, 0, 1, 0, 1, 0.5,
                0, Math.sqrt(3), 0, 0, 0, 1, 0, 1
            ];

        this.faceIndices =
            [
                0, 1, 2
            ];

        this.updateWorldMatrix();
    }
}

class Pentagon extends ObjectGL {
    constructor(position: ReadonlyVec3, rotation: Euler) {
        super();

        this.setPosition(position);
        this._rotation = rotation;

        this.flat_vertices = [];

        for (let i = 1; i <= 5; ++i) {
            let y = Math.cos(i * 2 * Math.PI / 5);
            let x = Math.sin(i * 2 * Math.PI / 5);
            this.flat_vertices.push(x, y, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
        }

        this.faceIndices =
            [
                0, 2, 1,
                2, 4, 3,
                2, 0, 4
            ];

        this.updateWorldMatrix();
    }
}

export { Cube, Plane, Triangle, Pentagon };