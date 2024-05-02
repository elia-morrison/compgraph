import { mat4, glMatrix } from "gl-matrix";
import { ObjectGL } from "src/shared/mesh/objectGL";

export class Camera extends ObjectGL
{
    public viewMatrix = new Float32Array(16);
    public projMatrix = new Float32Array(16);
    gl: WebGL2RenderingContext;

    constructor(gl: WebGL2RenderingContext)
    {
        super();
        this.gl = gl;
        this.make_perspective();
    }

    public override updateWorldMatrix(): void {
        super.updateWorldMatrix();

        this.make_view();
    }

    make_view()
    {
        mat4.invert(this.viewMatrix, this.worldMatrix);
    }

    make_perspective() {
        let gl = this.gl;
        mat4.perspective(this.projMatrix, glMatrix.toRadian(45), gl.canvas.width / gl.canvas.height, 0.1, 1000.0);
    }
}
