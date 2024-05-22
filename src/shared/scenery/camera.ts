import { mat4, glMatrix, vec3 } from "gl-matrix";
import { Body3D } from "../base/body-3d";
import { BaseMesh } from "../base/base-mesh";
import { ObjectGL } from "../mesh/objectGL";
import { Euler, Quaternion } from "three";
import { worldConfig } from "../resources/worldConfig";

export class Camera extends ObjectGL {
    public viewMatrix = new Float32Array(16);
    public projMatrix = new Float32Array(16);
    public target: Body3D | null = null;
    gl: WebGL2RenderingContext;

    constructor(gl: WebGL2RenderingContext, target: Body3D | null = null) {
        super(); //new BaseMesh(), false
        this.gl = gl;
        this.target = target;
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
        //mat4.lookAt(this.viewMatrix, eye, this.direction, worldConfig.UP);
        if (this.target != null) {
            mat4.lookAt(this.viewMatrix, eye, this.target._position, worldConfig.UP);
        }
        else {
            mat4.lookAt(this.viewMatrix, eye, this.direction, worldConfig.UP);
        }

    }

    make_perspective() {
        let gl = this.gl;
        let aspectRatio = gl.canvas.width / gl.canvas.height;
        mat4.ortho(this.projMatrix, -5, 5, -5 / aspectRatio, 5 / aspectRatio, 0.1, 1000.0);
        //mat4.perspective(this.projMatrix, glMatrix.toRadian(45), gl.canvas.width / gl.canvas.height, 0.1, 1000.0);
    }
}
