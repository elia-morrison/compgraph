import { Euler } from "three";
import { vec3 } from "gl-matrix";
import { ObjectGL } from "src/shared/mesh/objectGL";
import { Body3D } from "src/shared/body-3d";
import { BaseMovement } from "src/shared/body-3d/movement/movement-types/base-movement";


export class Mag {

    // todo: share single objectGL between all bullets!!!
    bullets: Array<{
        movable: Body3D,
        movement: BaseMovement // maybe add other types?
    }> = [];

    constructor(readonly origin: Body3D) {}

    addBullet(
        mesh: ObjectGL,
        movement: BaseMovement,
    ) {
        const newBullet = new Body3D({ mesh });
        newBullet.position = vec3.clone(this.origin.position);
        newBullet.rotation = (new Euler).copy(this.origin.rotation);
        this.bullets.push({
            movable: newBullet,
            movement
        });
    }
}