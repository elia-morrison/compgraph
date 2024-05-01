import { Mag } from "./index";
import { KeyboardListener } from "../../../shared/keyboard-listener";
import { Movable } from "../movable";
import { Timer } from "../../../shared/timer";
import { useOrangeModel } from "../../resources/orange";
import { Scene } from "../../../shared/rendererGL";

export class MagManager {
    mag: Mag;
    #keyboardListener = new KeyboardListener();

    addBullet = () => {
        console.log('adding bullet');
        const {
            orange
        } = useOrangeModel();
        this.mag.addBullet(orange);
        return orange;
    }

    moveBullets(timer: Timer) {
        this.mag.bullets.forEach(({ movement}) => {
            movement.move(timer);
        })
    }

    attachToMovable(
        player: Movable,
        timer: Timer,
        scene: Scene
    ) {
        this.mag = new Mag(player);
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