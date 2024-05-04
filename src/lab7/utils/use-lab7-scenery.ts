import { BaseScene } from "src/shared/base/base-scene";
import { useDorimeRatModel } from "src/lab7/resources/dorime-rat";
import { useOrangeModel } from "src/lab7/resources/orange";
import { UncannyRotatingMovement } from "src/shared/base/movable/movement-types/uncanny-rotating-movement";
import { Body3D } from "src/shared/base/body-3d";
import { Euler } from "three";

export const useLab7Scenery = (scene: BaseScene, gl: WebGL2RenderingContext) => {
    const dorimeMesh = useDorimeRatModel();
    dorimeMesh.setup_buffers(gl);

    const orangeMesh = useOrangeModel();
    orangeMesh.setup_buffers(gl);

    const uncannyRotate = new UncannyRotatingMovement();
    const hugeDorime = new Body3D(dorimeMesh);
    hugeDorime.setScale([1, 1, 1]);
    hugeDorime.setPosition([3, 0, 10]);
    hugeDorime.setRotation(new Euler(0,-Math.PI / 3,0));
    uncannyRotate.attachToMovable(hugeDorime);

    const secondHugeDorime = new Body3D(dorimeMesh);
    secondHugeDorime.setScale([1, 1, 1]);
    secondHugeDorime.setPosition([-7, 0, 10]);
    secondHugeDorime.setRotation(new Euler(0,Math.PI / 3,0));
    uncannyRotate.attachToMovable(secondHugeDorime);

    const hugeOrange = new Body3D(orangeMesh);
    hugeOrange.setScale([0.05, 0.05, 0.05]);
    hugeOrange.setPosition([-3, 0, 10]);
    hugeOrange.setRotation(new Euler(0,-Math.PI / 3,0));
    uncannyRotate.attachToMovable(hugeOrange);

    scene.objects.push(hugeDorime, secondHugeDorime, hugeOrange);

    return {
        dorimeMesh, orangeMesh
    }
}