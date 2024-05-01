import { Mag } from "./index";
import { KeyboardListener } from "../../../shared/keyboard-listener";
import { Movable } from "../movable";
import { Timer } from "../../../shared/timer";
import { useOrangeModel } from "../../resources/orange";
import { Scene } from "../../../shared/rendererGL";
import { LinearMovement } from "../movable/movement-types/linear-movement";

export class MagManager {
    #mag: Mag | undefined;
    #keyboardListener = new KeyboardListener();
    #linearMovement = new LinearMovement();

    addBullet = () => {
        console.log('adding bullet');
        const {
            orange
        } = useOrangeModel();
        this.#mag?.addBullet(orange, this.#linearMovement);
        return orange;
    }

    moveBullets(timer: Timer) {
        this.#mag?.bullets.forEach(({ movement, movable}) => {
            movement.moveEntity(movable, timer);
        })
    }

    attachToMovable(
        player: Movable,
        timer: Timer,
        scene: Scene
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

    detachFromMovable() {
        this.#keyboardListener.removeListener();
    };
}