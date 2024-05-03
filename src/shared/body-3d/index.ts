import { mat4, ReadonlyVec3, vec3 } from "gl-matrix";
import { Euler, Quaternion } from "three";
import { Timer } from "src/shared/runtime/timer";
import { BaseMovement } from "src/shared/body-3d/movement/movement-types/base-movement";
import { BaseMesh } from "src/shared/mesh/base-mesh";
import { matr_from_euler } from "src/shared/utils";

export class Body3D {
    mesh: BaseMesh;

    _position: vec3 = [0.0, 0.0, 0.0];
    _rotation= new Euler(0.0, 0.0, 0.0);
    _scale: vec3 = [1, 1, 1];

    worldMatrix = new Float32Array(16);
    rotMatr = new Float32Array(16);

    velocity = 0.005;
    movement: BaseMovement | undefined;

    get direction() {
        return vec3.normalize([0, 0, 0], [
            -Math.cos(this.rotation.y), // yaw
            Math.sin(this.rotation.x), // pitch
            Math.sin(this.rotation.y) // yaw
        ]);
    }

    constructor(mesh: BaseMesh, movement?: BaseMovement) {
        this.mesh = mesh;
        this.movement = movement;
        this.updateWorldMatrix();
    }

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

    move(timer: Timer) {
        this.movement?.moveEntity(this, timer);
    }
}