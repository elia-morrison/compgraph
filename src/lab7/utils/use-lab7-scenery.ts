import { BaseScene } from "src/shared/base/base-scene";
import { useDorimeRatModel } from "src/lab7/resources/dorime-rat";
import { useOrangeModel } from "src/lab7/resources/orange";
import { UncannyRotatingMovement } from "src/shared/base/movable/movement-types/uncanny-rotating-movement";
import { Body3D } from "src/shared/base/body-3d";
import { Euler } from "three";
import { PointLight } from "src/shared/scenery/light/lightsource";
import { vec3 } from "gl-matrix";
import { useLanternModel } from "src/lab7/resources/lantern-body";

export const useLab7Scenery = (scene: BaseScene, gl: WebGL2RenderingContext) => {
    const dorimeMesh = useDorimeRatModel();
    dorimeMesh.setup_buffers(gl);

    const lanternMesh = useLanternModel();
    lanternMesh.setup_buffers(gl);

    const orangeMesh = useOrangeModel();
    orangeMesh.setup_buffers(gl);

    const uncannyRotate = new UncannyRotatingMovement();
    const hugeDorime = new Body3D(dorimeMesh);
    hugeDorime.setScale([1, 1, 1]);
    hugeDorime.setPosition([3, 0, 10]);
    hugeDorime.setRotation(new Euler(0,-Math.PI / 3,0));
    uncannyRotate.attachToMovable(hugeDorime);

    const lanternBody = new Body3D(lanternMesh);
    lanternBody.setScale([1, 1, 1]);
    lanternBody.setPosition([-7, 7, 10]);
    lanternBody.setRotation(new Euler(0,-2 * Math.PI / 3,0));

    const lanternLight = new PointLight();
    const nimbusLightPos = vec3.clone(lanternBody.position);
    lanternLight.setPosition(nimbusLightPos);
    lanternLight.radius = 10;
    scene.lightsources.push(lanternLight);

    const hugeOrange = new Body3D(orangeMesh);
    hugeOrange.setScale([0.05, 0.05, 0.05]);
    hugeOrange.setPosition([-3, 0, 10]);
    hugeOrange.setRotation(new Euler(0,-Math.PI / 3,0));
    uncannyRotate.attachToMovable(hugeOrange);

    scene.objects.push(hugeDorime, lanternBody, hugeOrange);

    return {
        dorimeMesh, orangeMesh
    }
}