import { vec3 } from "gl-matrix";
import { ObjectGL } from "../../../shared/objectGL";
import { Euler } from "three";

export class Movable {
    position: vec3 = [0.0, 0.0, 0.0];
    direction: vec3 = [0.0, 0.0, 0.0];
    rotation= new Euler(0.0, 0.0, 0.0);
    mesh: ObjectGL;

    // todo: place movement manager in this class

    constructor({ mesh } : { mesh: ObjectGL }){
        this.mesh = mesh;
    }

    move() {
        this.mesh.setRotation(this.rotation);
        this.mesh.setPosition(this.position);
    }
}