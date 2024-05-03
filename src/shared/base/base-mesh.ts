import { ReadonlyVec3 } from "gl-matrix";
import { Material } from "src/shared/mesh/material";
import { create_texture } from "src/shared/resource-loaders/texture-loader";

export class BaseMesh {
    vertices: ReadonlyVec3[];
    flat_vertices: number[];
    faceIndices: number[];

    public material: Material = new Material();

    public vertexbuffer: WebGLBuffer;
    public indexbuffer: WebGLBuffer;

    public texture1: WebGLTexture;
    public texture2: WebGLTexture;
    public normal_map: WebGLTexture;
    public bump_map: WebGLTexture;

    public fromObj() {
        //TODO заполнить соответствующие поля объекта используюя вызов import_obj
    }

    public setup_buffers(gl: WebGL2RenderingContext) {

        var boxVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.flat_vertices), gl.STATIC_DRAW);

        this.vertexbuffer = boxVertexBufferObject as WebGLBuffer;

        var boxIndexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faceIndices), gl.STATIC_DRAW);

        this.indexbuffer = boxIndexBufferObject as WebGLBuffer;

        if (this.material.diff_map_1 != null) {
            this.texture1 = create_texture(gl, this.material.diff_map_1, 0);
        }
        if (this.material.diff_map_2 != null) {
            this.texture2 = create_texture(gl, this.material.diff_map_2, 1);
        }
        if (this.material.normal_map != null) {
            this.normal_map = create_texture(gl, this.material.normal_map, 2);
        }
        if (this.material.bump_map != null) {
            this.bump_map = create_texture(gl, this.material.bump_map, 3, true);
        }
    }
}
