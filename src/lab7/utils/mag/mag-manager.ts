import { Mag } from "./index";
import { Movable } from "../movable";
import { useOrangeModel } from "../../resources/orange";
import { LinearMovement } from "../movable/movement-types/linear-movement";
import { KeyboardListener } from "../../../shared/ui/keyboard-listener";
import { Timer } from "../../../shared/runtime/timer";
import { Scene } from "../../../shared/renderers/rendererGL";

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