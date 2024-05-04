import { Euler } from "three";
import { vec3 } from "gl-matrix";
import { Body3D } from "src/shared/base/body-3d";
import { Movable } from "src/shared/base/movable";
import { BaseMovement } from "src/shared/base/movable/movement-types/base-movement";
import { BaseMesh } from "src/shared/base/base-mesh";

export class Mag {

    bullets: Array<Body3D> = [];

    constructor(readonly origin: Movable) {}

    addBullet(
        mesh: BaseMesh,
        movement: BaseMovement,
        offsetFromOrigin: vec3 = vec3.create()
    ) {
        const newBullet = new Body3D(mesh);
        newBullet.movement = movement;
        newBullet.setScale([0.01, 0.01, 0.01]);
        newBullet.setPosition(
            vec3.add(
                vec3.create(),
                this.origin.position,
                offsetFromOrigin,
            )
        )
        newBullet.setRotation((new Euler).copy(this.origin.rotation))
        this.bullets.push(newBullet);
        return newBullet;
    }
}