import { Mag } from "./index";
import { KeyboardListener } from "src/shared/ui/keyboard-listener";
import { Timer } from "src/shared/runtime/timer";
import { LinearMovement } from "src/shared/base/movable/movement-types/linear-movement";
import { BaseMesh } from "src/shared/base/base-mesh";
import { Body3D } from "src/shared/base/body-3d";
import { BaseScene } from "src/shared/base/base-scene";
import { vec3 } from "gl-matrix";

export class MagManager {
    #mag: Mag;
    #keyboardListener = new KeyboardListener();
    #linearMovement = new LinearMovement();

    constructor(
        origin: Body3D,
        readonly bulletMesh: BaseMesh,
    ) {
        this.#mag = new Mag(origin);
    }

    addBullet = (mesh: BaseMesh) => {
        const offsetFromOrigin = vec3.create();
        vec3.scale(offsetFromOrigin, this.#mag.origin.up, 1.5);
        vec3.add(
            offsetFromOrigin,
            offsetFromOrigin,
            vec3.scale(vec3.create(), this.#mag.origin.direction, 1)
        );
        return this.#mag.addBullet(mesh, this.#linearMovement, offsetFromOrigin);
    }

    moveBullets(timer: Timer) {
        this.#mag.bullets.forEach((bullet) => {
            bullet.movement.moveEntity(bullet, timer);
        })
    }

    attachToKeyboard(scene: BaseScene) {
        this.#keyboardListener.setListener([
            {
                keys: ['F', 'f'],
                callback: () => {
                    const newBullet = this.addBullet(this.bulletMesh);
                    scene.objects.push(newBullet);
                }
            },
        ]);
    }

    detachFromKeyboard() {
        this.#keyboardListener.removeListener();
    };
}