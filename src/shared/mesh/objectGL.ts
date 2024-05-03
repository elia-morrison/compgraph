import { glMatrix, mat4, ReadonlyVec3, vec3 } from "gl-matrix";
import { Euler,  Quaternion } from "three";
import { matr_from_euler } from "src/shared/utils";
import { Material } from "src/shared/mesh/material";
import { createTexture } from "src/shared/resource-loaders/texture-loader";

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
    public normal_map: WebGLTexture;
    public bump_map: WebGLTexture;

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

    public setupBuffers(gl: WebGL2RenderingContext) {

        var boxVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.flat_vertices), gl.STATIC_DRAW);

        this.vertexbuffer = boxVertexBufferObject as WebGLBuffer;

        var boxIndexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faceIndices), gl.STATIC_DRAW);

        this.indexbuffer = boxIndexBufferObject as WebGLBuffer;

        if (this.material.diff_map_1 != null) {
            this.texture1 = createTexture(gl, this.material.diff_map_1, 0);
        }
        if (this.material.diff_map_2 != null) {
            this.texture2 = createTexture(gl, this.material.diff_map_2, 1);
        }
        if (this.material.normal_map != null) {
            this.normal_map = createTexture(gl, this.material.normal_map, 2);
        }
        if (this.material.bump_map != null) {
            this.bump_map = createTexture(gl, this.material.bump_map, 3, true);
        }
    }

    public setupTextures() {

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
