import { Movable } from "../movable";
import { Euler } from "three";
import { LinearMovement } from "../movable/movement-types/linear-movement";
import { BaseMovement } from "../movable/movement-types/base-movement";
import { vec3 } from "gl-matrix";
import { ObjectGL } from "../../../shared/mesh/objectGL";

export class Mag {

    // todo: share single objectGL between all bullets!!!
    bullets: Array<{
        movable: Movable,
        movement: LinearMovement // maybe add other types?
    }> = [];

    constructor(readonly origin: Movable) {}

    addBullet(
        mesh: ObjectGL,
        movement: BaseMovement,
    ) {
        const newBullet = new Movable({ mesh });
        newBullet.position = vec3.clone(this.origin.position);
        newBullet.rotation = (new Euler).copy(this.origin.rotation);
        this.bullets.push({
            movable: newBullet,
            movement
        });
    }
}