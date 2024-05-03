import { Mag } from "src/lab7/utils/mag/index";
import { KeyboardListener } from "src/shared/ui/keyboard-listener";
import { LinearMovement } from "src/shared/body-3d/movement/movement-types/linear-movement";
import { useOrangeModel } from "src/lab7/resources/orange";
import { Timer } from "src/shared/runtime/timer";
import { Body3D } from "src/shared/body-3d";
import { BaseScene } from "src/shared/renderers/base-renderer";
import { BaseMesh } from "src/shared/mesh/base-mesh";

export class MagManager {
    #mag: Mag | undefined;
    #keyboardListener = new KeyboardListener();
    #linearMovement = new LinearMovement();

    addBullet = (mesh: BaseMesh) => {
        console.log('adding bullet');
        this.#mag?.addBullet(mesh, this.#linearMovement);
    }

    moveBullets(timer: Timer) {
        this.#mag?.bullets.forEach(({ movement, movable}) => {
            movement.moveEntity(movable, timer);
        })
    }

    attachToBody3D(
        player: Body3D,
        timer: Timer,
        scene: BaseScene
    ) {
        this.#mag = new Mag(player);
        this.#keyboardListener.setListener([
            {
                keys: ['F', 'f'],
                callback: () => {
                    const newBullet = this.addBullet();
                    scene.objects.push(newBullet);
                }
            },
        ]);
    }

    detachFromBody3D() {
        this.#keyboardListener.removeListener();
    };
}