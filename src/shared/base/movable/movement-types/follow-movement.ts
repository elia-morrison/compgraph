import { BaseMovement } from "./base-movement";
import { Movable } from "../index";
import { vec3 } from "gl-matrix";
import { Euler } from "three";
import { Body3D } from "../../body-3d";
import { ObjectGL } from "src/shared/mesh/objectGL";

export class FollowMovement extends BaseMovement {
    attachToMovable(movable: Movable | ObjectGL) {
        movable.movement = this;
        this.moveEntity(movable);
    }

    constructor(
        readonly target: Body3D,
        readonly offsets: vec3
    ) {
        super();
    }

    setFollowerRotation(movable: Movable | ObjectGL) {
        movable.setRotation((new Euler).copy(this.target.rotation));
        // todo: come up with something better
        if (!(movable instanceof Body3D)) {
            movable.direction = vec3.clone(this.target.direction);
        }
        // if (movable instanceof Body3D) {
        //     (movable as Body3D).setRotationAroundOrigin(this.target._rotation, this.offsets);
        // }
    }

    setFollowerPosition(movable: Movable | ObjectGL) {
        const newPosition = vec3.clone(this.target.position);
        vec3.add(
            newPosition,
            newPosition,
            vec3.scale(vec3.create(), this.target.right, this.offsets[0]),
        );
        vec3.add(
            newPosition,
            newPosition,
            vec3.scale(vec3.create(), this.target.up, this.offsets[1]),
        );
        vec3.add(
            newPosition,
            newPosition,
            vec3.scale(vec3.create(), this.target.direction, this.offsets[2]),
        );
        movable.setPosition(newPosition);
    }

    moveEntity(movable: Movable | ObjectGL) {
        this.setFollowerRotation(movable);
        this.setFollowerPosition(movable);
    }
}