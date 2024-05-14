import { mat4, quat, ReadonlyVec3, vec3 } from "gl-matrix";
import { Euler, Quaternion } from "three";
import { matr_from_euler } from "src/shared/utils";
import { BaseMesh } from "src/shared/base/base-mesh";
import { Timer } from "src/shared/runtime/timer";
import { BaseMovement } from "src/shared/base/movable/movement-types/base-movement";
import { worldConfig } from "src/shared/resources/worldConfig";
import { generateUUID } from "three/src/math/MathUtils";
import * as CANNON from 'cannon-es'
import * as THREE from 'three'

export class Body3D {
    id = generateUUID();
    hidden = false;

    public _position: vec3 = [0, 0, 0];
    public _rotation: Euler = new Euler();
    public _scale: vec3 = [1, 1, 1];

    public collision: boolean = false;
    #kinematic: boolean = true;
    public bbox: CANNON.Body | null = null;

    velocity = 0.005;
    movement: BaseMovement | undefined;

    worldMatrix = new Float32Array(16);
    rotMatr = new Float32Array(16)

    // rotation in local sustem
    // todo: consider pitch yaw roll when calculating world matrix
    public _pitchYawRoll: Euler = new Euler();

    constructor(public mesh: BaseMesh, collision: boolean = false, kinematic: boolean = true) {
        this.setScale([1, 1, 1]);
        this.collision = collision;
        this.#kinematic = kinematic;

        if (this.collision) {
            this.initPhysics();
        }
    }

    initPhysics() {
        if (this.collision) {
            this.bbox = this.mesh.calculateBoundingBox(this.scale, this.#kinematic);
            this.bbox.fixedRotation = true;
            this.bbox.angularDamping = 0;
        }
    }

    #front: vec3 = [0, 0, 0];
    #right: vec3 = [0, 0, 0];
    #up: vec3 = [0, 0, 0];

    get direction() { return this.#front; }
    get right() { return this.#right; }
    get up() { return this.#up; }

    updateVectors() {
        let q = new Quaternion().setFromEuler(this._rotation);
        vec3.transformQuat(this.#front, worldConfig.FRONT, [q.x, q.y, q.z, q.w]);
        vec3.normalize(this.#front, this.#front);
        vec3.transformQuat(this.#right, worldConfig.RIGHT, [q.x, q.y, q.z, q.w]);
        vec3.normalize(this.#right, this.#right);
        vec3.transformQuat(this.#up, worldConfig.UP, [q.x, q.y, q.z, q.w]);
        vec3.normalize(this.#up, this.#up);
    }

    move(timer: Timer) {
        this.movement?.moveEntity(this, timer);
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

    public setup_buffers(gl: WebGL2RenderingContext) {
        if (!this.mesh) throw new Error('no mesh');
        this.mesh.setup_buffers(gl);
    }

    public get position() { return this._position; }

    public setPosition(pos: ReadonlyVec3) {
        vec3.copy(this._position, pos);
        this.syncCollisionToVisuals();
        this.updateWorldMatrix();
    }

    public get rotation() { return this._rotation; }
    public get pitchYawRoll() { return this._rotation; }

    public setRotation(rot: Quaternion | Euler) {
        if (rot instanceof Quaternion)
            this._rotation = new Euler().setFromQuaternion(rot);
        else if (rot instanceof Euler)
            this._rotation = rot;

        this.syncCollisionToVisuals();
        this.updateVectors();
        this.updateWorldMatrix();
    }

    public setPitchYawRoll(rot: Quaternion | Euler) {
        // todo: add pitch yaw roll mutation or rotation mutation or something
        this.setRotation(rot);
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

    public setRotationAroundOrigin(rotation: Euler, origin: ReadonlyVec3) {
        let translatedPos = vec3.create();
        vec3.sub(translatedPos, this._position, origin);

        let quat = new Quaternion().setFromEuler(rotation);

        let rotatedPos = vec3.create();
        vec3.transformQuat(rotatedPos, translatedPos, [quat.x, quat.y, quat.z, quat.w]);

        vec3.add(rotatedPos, rotatedPos, origin);
        this.setPosition(rotatedPos);

        this.setRotation(quat);
    }

    public syncCollisionToVisuals() {
        if (this.collision) {
            this.bbox?.position.set(
                this._position[0],
                this._position[1],
                this._position[2]
            );

            this.bbox?.quaternion.setFromEuler(
                this._rotation.x,
                this._rotation.y,
                this._rotation.z,
                this._rotation.order
            );
        }
    }

    public syncVisualsToCollision() {
        if (this.collision) {
            vec3.copy(this._position, vec3.fromValues(
                this.bbox?.position.x!,
                this.bbox?.position.y!,
                this.bbox?.position.z!));

            this._rotation = new Euler().setFromQuaternion(new THREE.Quaternion(
                this.bbox?.quaternion.x!,
                this.bbox?.quaternion.y!,
                this.bbox?.quaternion.z!,
                this.bbox?.quaternion.w!,
            ));

            this.updateVectors();
            this.updateWorldMatrix();
        }
    }
}
