import frag_shader from "../shaders/shaded.frag";
import vert_shader from "../shaders/shaded.vert";
import skyboxVertShader from "../shared/scenery/skybox/shaders/cubemap.vert";
import skyboxFragShader from "../shared/scenery/skybox/shaders/cubemap.frag";
import { Skybox } from "../shared/scenery/skybox";
import { SkyboxRendererGL } from "../shared/scenery/skybox/renderer";
import { resizeCanvas } from "../shared/ui/ui";
import { Timer } from "../shared/runtime/timer";
import { Camera } from "src/shared/scenery/camera";
import { BaseRenderer } from "src/shared/base/base-renderer";
import { BaseScene } from "src/shared/base/base-scene";
import { Body3D } from "src/shared/base/body-3d";
import { MagManager } from "src/lab7/utils/mag/mag-manager";
import { useLab7Scenery } from "src/lab7/utils/use-lab7-scenery";
import { FollowMovement } from "src/shared/base/movable/movement-types/follow-movement";
import { vec3 } from "gl-matrix";
import { PlayerMovementManager } from "src/shared/ui/movement-managers/strafe-movement-manager";
import { KeyboardListener } from "src/shared/ui/keyboard-listener";
import { Lightsource } from "src/shared/scenery/light/lightsource";

try {
    const audio = document.querySelector("#audio-player") as HTMLAudioElement;
    audio.loop = true;
    audio.play();
} catch (e) {
    console.log(e)
}

const cv = document.querySelector("#main_canvas") as HTMLCanvasElement;
resizeCanvas(cv);
window.addEventListener('resize', function (event) { resizeCanvas(cv); }, true);
const gl = cv.getContext("webgl2") as WebGL2RenderingContext;

const scene = new BaseScene();

const {
    meshes: {
        dorimeMesh,
        orangeMesh
    },
    lightsources: {
        lanternLight,
        sun,
        firstHeadlight,
        secondHeadlight
    },
    bodies: {
        hugeDorime,
        lanternBody,
        hugeOrange,
        firstHeadlightBody,
        secondHeadlightBody
    }
} = useLab7Scenery(scene, gl);

const player = new Body3D(dorimeMesh, true, true);
player.setScale([0.5, 0.5, 0.5]);

scene.addObjects([player]);

const firstHLMovement = new FollowMovement(player, vec3.fromValues(0.4, 2.75, 0.75));
firstHLMovement.attachToMovable(firstHeadlightBody);
firstHLMovement.attachToMovable(firstHeadlight);

const secondHLMovement = new FollowMovement(player, vec3.fromValues(-0.4, 2.75, 0.75));
secondHLMovement.attachToMovable(secondHeadlightBody);
secondHLMovement.attachToMovable(secondHeadlight);

const camera = new Camera(gl);
const renderer = new BaseRenderer(gl, vert_shader as string, frag_shader as string, scene, camera);
const skybox = new Skybox(gl, 10, [
    document.getElementById("skybox-right"),
    document.getElementById("skybox-left"),
    document.getElementById("skybox-top"),
    document.getElementById("skybox-bottom"),
    document.getElementById("skybox-front"),
    document.getElementById("skybox-back"),
] as Array<HTMLImageElement>)

const skyboxRenderer = new SkyboxRendererGL(
    gl,
    skyboxVertShader as string, skyboxFragShader as string, camera, skybox);

const timer = new Timer();

const playerMovementManager = new PlayerMovementManager();
playerMovementManager.attachToMovable(player, timer);

const magManager = new MagManager(player, orangeMesh);
magManager.attachToKeyboard(scene);

const toggleLight = (light: Lightsource, body?: Body3D) => {
    if (body) body.hidden = !body.hidden;

    if (light.intensity) light.intensity = 0;
    else light.intensity = 1;
}

// todo: consider intensity when calculating point light illumination & spotlight illumination
// it's only considered in directional light for now
const lightToggler = new KeyboardListener();
lightToggler.setListener([
    {
        keys: ['G', 'g'],
        callback: () => {
            toggleLight(firstHeadlight, firstHeadlightBody);
            toggleLight(secondHeadlight, secondHeadlightBody);
        }
    },
    {
        keys: ['H', 'h'],
        callback: () => {
            toggleLight(lanternLight, lanternBody);
        }
    },
    {
        keys: ['J', 'j'],
        callback: () => {
            toggleLight(sun);
        }
    }
]);

timer.reset();

const update = () => {
    timer.update();

    firstHeadlight.move(timer);
    secondHeadlight.move(timer);

    scene.objects.forEach((obj) => {
        obj.move(timer);
    });

    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    skyboxRenderer.render();
    renderer.render(false);
    requestAnimationFrame(update);
    scene.updatePhysics();
}

update();

