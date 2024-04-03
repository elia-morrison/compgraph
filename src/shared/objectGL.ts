import { vec2, vec3 } from "gl-matrix";
import { glMatrix, mat4, ReadonlyVec3, quat } from "gl-matrix";
import { Euler, Quaternion, Vector3 } from "three";
import { Material } from "./material";
import { matr_from_euler } from "./utils";

export class ObjectGL {
    vertices: ReadonlyVec3[];
    flat_vertices: number[];
    faceIndices: number[];
    
    public material: Material = new Material();

    public _position: ReadonlyVec3 = [0, 0, 0];
    public _rotation: Euler = new Euler();
    public _scale: ReadonlyVec3 = [1, 1, 1];

    public vertexbuffer: WebGLBuffer;
    public indexbuffer: WebGLBuffer;

    public texture: WebGLTexture;

    worldMatrix = new Float32Array(16);
    rotMatr = new Float32Array(16)

    public updateWorldMatrix() {
        let wM = new Float32Array(16);

        mat4.identity(wM);
        mat4.translate(wM, wM, this._position);
        let rotation = matr_from_euler(this._rotation);
        this.rotMatr = rotation;
        mat4.multiply(wM, wM, rotation);

        let scale = new Float32Array(16);
        mat4.identity(scale);
        mat4.scale(scale, scale, this._scale);

        mat4.multiply(wM, wM, scale);
        this.worldMatrix = wM;
    }

    constructor() {

    }

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

        if (this.material.diffusion_map != null)
        {
            this.texture = gl.createTexture() as WebGLTexture;
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.material.diffusion_map);
        }
    }

    public get position() { return this._position; }

    public setPosition(pos: ReadonlyVec3) {
        this._position = pos;
        this.updateWorldMatrix();
    }

    public get rotation() { return this._rotation; }

    public setRotation(rot: Quaternion | Euler) {
        if (rot instanceof Quaternion)
            this._rotation = new Euler().setFromQuaternion(rot);
        else if (rot instanceof Euler)
            this._rotation = rot;

        this.updateWorldMatrix();
    }

    public get scale() { return this._scale; }

    public setScale(scale: ReadonlyVec3) {
        this._scale = scale;
        this.updateWorldMatrix();
    }
}
