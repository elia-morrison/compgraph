import { vec2, vec3 } from "gl-matrix";
import { glMatrix, mat4, ReadonlyVec3, quat } from "gl-matrix";
import { Euler, QuadraticBezierCurve, Quaternion, Vector3 } from "three";
import { Material } from "./material";
import { matr_from_euler } from "./utils";

export class ObjectGL {
    vertices: ReadonlyVec3[];
    flat_vertices: number[];
    faceIndices: number[];

    public material: Material = new Material();

    public _position: vec3 = [0, 0, 0];
    public _rotation: Euler = new Euler();
    public _scale: vec3 = [1, 1, 1];

    public vertexbuffer: WebGLBuffer;
    public indexbuffer: WebGLBuffer;

    public texture1: WebGLTexture;
    public texture2: WebGLTexture;

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

    public create_texture(gl: WebGL2RenderingContext, diff_map: HTMLImageElement, index: number): WebGLTexture {
        let tex = gl.createTexture() as WebGLTexture;
        gl.activeTexture(gl.TEXTURE0 + index);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, diff_map);
        return tex;
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
            this.texture1 = this.create_texture(gl, this.material.diff_map_1, 0);
        }
        if (this.material.diff_map_2 != null) {
            this.texture2 = this.create_texture(gl, this.material.diff_map_2, 1);
        }
    }

    public get position() { return this._position; }

    public setPosition(pos: ReadonlyVec3) {
        vec3.copy(this._position, pos);
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
        vec3.copy(this._scale, scale);
        this.updateWorldMatrix();
    }

    public translate(deltaPos: ReadonlyVec3) {
        vec3.add(this._position, this._position, deltaPos);
    }

    public rotate(deltaRot: Euler) {
        // So bad these are not Quaternions. 
        // There will be problems with using Euler.
        this.rotation.x += deltaRot.x;
        this.rotation.y += deltaRot.y;
        this.rotation.z += deltaRot.z;
    }

    public rotateAroundYAxis(angle: number, origin: ReadonlyVec3) {
        let translatedPos = vec3.create();
        vec3.sub(translatedPos, this._position, origin);

        let rotation = new Quaternion().setFromEuler(new Euler(0, angle, 0));

        let rotatedPos = vec3.create();
        vec3.transformQuat(rotatedPos, translatedPos, [rotation.x, rotation.y, rotation.z, rotation.w]);

        vec3.add(rotatedPos, rotatedPos, origin);
        this.setPosition(rotatedPos);

        let currentRotation = new Quaternion().setFromEuler(this._rotation);
        let newRotation = rotation.multiply(currentRotation);
        this.setRotation(newRotation);
    }
}
