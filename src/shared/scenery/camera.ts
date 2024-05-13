import { mat4, glMatrix, vec3 } from "gl-matrix";
import { Body3D } from "../base/body-3d";
import { BaseMesh } from "../base/base-mesh";
import { ObjectGL } from "../mesh/objectGL";
import { Euler, Quaternion } from "three";
import { worldConfig } from "../resources/worldConfig";

export class Camera extends ObjectGL {
    public viewMatrix = new Float32Array(16);
    public projMatrix = new Float32Array(16);
    gl: WebGL2RenderingContext;

    constructor(gl: WebGL2RenderingContext) {
        super(); //new BaseMesh(), false
        this.gl = gl;
        this.make_perspective();
    }

    public override updateWorldMatrix(): void {
        super.updateWorldMatrix();

        this.make_view();
    }

    make_view() {
        this.viewMatrix = new Float32Array(16);
        // mat4.invert(this.viewMatrix, this.worldMatrix);
        let eye = this.position;
        let center = vec3.create();
        vec3.add(center, eye, this.direction);

        mat4.lookAt(this.viewMatrix, eye, center, worldConfig.UP);
    }

    make_perspective() {
        let gl = this.gl;
        mat4.perspective(this.projMatrix, glMatrix.toRadian(45), gl.canvas.width / gl.canvas.height, 0.1, 1000.0);
    }
}
