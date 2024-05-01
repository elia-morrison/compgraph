import { Movable } from "../movable";
import { ObjectGL } from "../../../shared/objectGL";
import { Euler } from "three";
import { LinearMovement } from "../movable/managers/linear-movement";

export class Mag {

    // todo: share single objectgl between all bullets!!!
    bullets: Array<{
        movable: Movable,
        movement: LinearMovement // maybe add other types?
    }> = [];

    constructor(
        readonly origin: Movable
    ) {}

    addBullet(mesh: ObjectGL) {
        const newBullet = new Movable({ mesh });
        newBullet.position = this.origin.position;
        newBullet.rotation = (new Euler).copy(this.origin.rotation);
        const bulletMovement = new LinearMovement({
            direction: this.origin.direction,
            movable: newBullet
        });
    }
}