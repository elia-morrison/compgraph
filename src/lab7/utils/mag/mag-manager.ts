import { Mag } from "./index";
import { KeyboardListener } from "src/shared/ui/keyboard-listener";
import { Timer } from "src/shared/runtime/timer";
import { LinearMovement } from "src/shared/base/movable/movement-types/linear-movement";
import { BaseMesh } from "src/shared/base/base-mesh";
import { Body3D } from "src/shared/base/body-3d";
import { BaseScene } from "src/shared/base/base-scene";

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
        return this.#mag.addBullet(mesh, this.#linearMovement);
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