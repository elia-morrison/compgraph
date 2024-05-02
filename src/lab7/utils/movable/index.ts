import { vec3 } from "gl-matrix";
import { Euler } from "three";
import { BaseMovement } from "./movement-types/base-movement";
import { ObjectGL } from "../../../shared/mesh/objectGL";
import { Timer } from "../../../shared/runtime/timer";

export class Movable {
    position: vec3 = [0.0, 0.0, 0.0];
    rotation= new Euler(0.0, 0.0, 0.0);

    velocity = 0.005;

    mesh: ObjectGL;
    movement: BaseMovement | undefined;
    get direction() {
        return vec3.normalize([0, 0, 0], [
            -Math.cos(this.rotation.y), // yaw
            Math.sin(this.rotation.x), // pitch
            Math.sin(this.rotation.y) // yaw
        ]);
    }

    constructor({
        mesh, movement
    } : {
        mesh: ObjectGL
        movement?: BaseMovement;
    }){
        this.mesh = mesh;
        this.movement = BaseMovement;
    }

    move(timer: Timer) {
        this.movement?.moveEntity(this, timer);
        this.mesh.setRotation(this.rotation);
        this.mesh.setPosition(this.position);
    }
}