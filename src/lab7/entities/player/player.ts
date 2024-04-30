import { vec3 } from "gl-matrix";
import { ObjectGL } from "../../../shared/objectGL";
import { Euler } from "three";

export class Player {
    position: vec3 = [0.0, 0.0, 0.0];
    rotation= new Euler(0.0, 0.0, 0.0);
    mesh: ObjectGL;


    constructor({ mesh } : { mesh: ObjectGL }){
        this.mesh = mesh;
    }

    move() {
        this.mesh.setRotation(this.rotation);
        this.mesh.setPosition(this.position);
    }
}