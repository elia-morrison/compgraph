import { BaseScene } from "src/shared/base/base-scene";
import { useDorimeRatModel } from "src/lab7/resources/dorime-rat";
import { useOrangeModel } from "src/lab7/resources/orange";
import { UncannyRotatingMovement } from "src/shared/base/movable/movement-types/uncanny-rotating-movement";
import { Body3D } from "src/shared/base/body-3d";
import { Euler, Mesh } from "three";
import { DirectionalLight, PointLight, SpotLight } from "src/shared/scenery/light/lightsource";
import { vec3 } from "gl-matrix";
import { useLanternModel } from "src/lab7/resources/lantern-body";
import { MeshLoader } from "src/shared/resource-loaders/mesh-loader";
import boatObj from "bundle-text:../../../static/boat/boat.obj"
import benchObj from "bundle-text:../../../static/bench/bench.obj"
import utilityObj from "bundle-text:../../../static/utility/utility.obj"

export const useLab7Scenery = (scene: BaseScene, gl: WebGL2RenderingContext) => {
    const dorimeMesh = useDorimeRatModel();
    dorimeMesh.setup_buffers(gl);

    const lanternMesh = useLanternModel();
    lanternMesh.setup_buffers(gl);

    const orangeMesh = useOrangeModel();
    orangeMesh.setup_buffers(gl);

    let objLoader = new MeshLoader();
    const boatMesh = objLoader.load(boatObj);
    const boat = new Body3D(boatMesh);

    boat.setScale([1.5, 1.5, 1.5]);
    boat.setPosition([40, 0, 40]);
    boat.setRotation(new Euler(0, Math.PI / 2, 0));
    boatMesh.material.diff_map_1 = document.getElementById("boat") as HTMLImageElement;
    boatMesh.material.color_strength = 0;
    boatMesh.material.ambient = 0.2;
    boatMesh.material.diff_map_1_strength = 1.;
    boatMesh.material.shininess = 32;
    boatMesh.material.specular = 1;
    boatMesh.setup_buffers(gl);

    objLoader = new MeshLoader();
    const benchMesh = objLoader.load(benchObj);
    const bench = new Body3D(benchMesh, true, false);
    bench.setScale([3, 3, 3])

    benchMesh.material.diff_map_1 = document.getElementById("bench") as HTMLImageElement;
    benchMesh.material.color_strength = 0;
    benchMesh.material.ambient = 0.2;
    benchMesh.material.diff_map_1_strength = 1.;
    benchMesh.material.shininess = 32;
    benchMesh.material.specular = 1;
    benchMesh.setup_buffers(gl);

    const utilityMesh = objLoader.load(utilityObj);
    const utility = new Body3D(utilityMesh, true, false);
    utility.setScale([3, 3, 3])


    utilityMesh.material.diff_map_1 = document.getElementById("utility") as HTMLImageElement;
    utilityMesh.material.color_strength = 0;
    utilityMesh.material.ambient = 0.2;
    utilityMesh.material.diff_map_1_strength = 1.;
    utilityMesh.material.shininess = 32;
    utilityMesh.material.specular = 1;
    utilityMesh.setup_buffers(gl);

    const uncannyRotate = new UncannyRotatingMovement();
    const hugeDorime = new Body3D(dorimeMesh, true, false);
    hugeDorime.setScale([1, 1, 1]);
    hugeDorime.setPosition([3, 0, 10]);
    hugeDorime.setRotation(new Euler(0, -Math.PI / 3, 0));
    uncannyRotate.attachToMovable(hugeDorime);

    // headlights begin
    const firstHeadlightBody = new Body3D(lanternMesh);
    firstHeadlightBody.setScale([0.25, 0.25, 0.25]);
    const firstHeadlight = new SpotLight();
    firstHeadlight.color = [1, 0, 0];
    firstHeadlight.radius = 5;

    const secondHeadlightBody = new Body3D(lanternMesh);
    secondHeadlightBody.setScale([0.25, 0.25, 0.25]);
    const secondHeadlight = new SpotLight();
    secondHeadlight.color = [1, 0, 0];
    firstHeadlight.radius = 5;
    // end

    const lanternBody = new Body3D(lanternMesh);
    lanternBody.setScale([0.6, 0.6, 0.6]);
    lanternBody.setPosition([-7, 7, 10]);
    lanternBody.setRotation(new Euler(0, -2 * Math.PI / 3, 0));

    const hugeOrange = new Body3D(orangeMesh, true, false);
    hugeOrange.setScale([0.05, 0.05, 0.05]);
    hugeOrange.setPosition([-3, 0, 10]);
    hugeOrange.setRotation(new Euler(0, -Math.PI / 3, 0));
    uncannyRotate.attachToMovable(hugeOrange);

    const sun = new DirectionalLight();
    sun.color = [0.3, 0.3, 0.7]
    sun.intensity = 1
    sun.direction = [-Math.PI / 2, 0, 0]
    sun.direction = vec3.fromValues(1, 1, 1);

    const lanternLight = new PointLight();
    const lanternLightPos = vec3.clone(lanternBody.position);
    lanternLight.setPosition(lanternLightPos);
    lanternLight.radius = 10;
    lanternLight.color = [1, 1, 0.5]

    const lantern1 = new SpotLight();
    lantern1.direction = [0, -Math.PI, 0]
    lantern1.setPosition([20, 30, -20]);
    lantern1.radius = 25

    const lantern2 = new SpotLight();
    lantern2.direction = [0, -Math.PI, 0]
    lantern2.setPosition([20, 30, 10]);
    lantern2.radius = 25

    scene.lightsources.push(
        sun,
        lanternLight,
        firstHeadlight,
        secondHeadlight,
        lantern1,
        lantern2,
    );

    scene.addObjects([
        hugeDorime,
        boat,
        bench,
        lanternBody,
        hugeOrange,
        firstHeadlightBody,
        secondHeadlightBody,
        utility]
    );

    bench.setPosition([0, 0, -20])
    bench.setRotation(new Euler(0, Math.PI - 0.1, 0))

    utility.setRotation(new Euler(0, Math.PI / 2, 0))
    utility.setPosition([-7, 0, -5])

    return {
        meshes: {
            dorimeMesh, orangeMesh
        },
        lightsources: {
            lanternLight, sun, firstHeadlight, secondHeadlight
        },
        bodies: {
            hugeDorime, lanternBody, hugeOrange, firstHeadlightBody, secondHeadlightBody, boat, bench
        }
    }
}