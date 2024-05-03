import frag_shader from "../shaders/shaded.frag";
import vert_shader from "../shaders/shaded.vert";
import skyboxVertShader from "../shared/scenery/skybox/shaders/cubemap.vert";
import skyboxFragShader from "../shared/scenery/skybox/shaders/cubemap.frag";
import { Skybox } from "../shared/scenery/skybox";
import { SkyboxRendererGL } from "../shared/scenery/skybox/renderer";
import { useDorimeRatModel } from "./resources/dorime-rat";
import { useOrangeModel } from "./resources/orange";
import { PlayerMovementManager } from "./utils/movable/movement-managers/strafe-movement-manager";
import { resizeCanvas } from "../shared/ui/ui";
import { PointLight } from "../shared/scenery/light/lightsource";
import { Timer } from "../shared/runtime/timer";
import { Camera } from "src/shared/scenery/camera";
import { BaseRenderer } from "src/shared/base/base-renderer";
import { BaseScene } from "src/shared/base/base-scene";
import { Body3D } from "src/shared/base/body-3d";

let cv = document.querySelector("#main_canvas") as HTMLCanvasElement;
resizeCanvas(cv);
window.addEventListener('resize', function (event) { resizeCanvas(cv); }, true);
let gl = cv.getContext("webgl2") as WebGL2RenderingContext;

let scene = new BaseScene();

let light1 = new PointLight();
light1.setPosition([-5, 10, -5]);
light1.radius = 50;
scene.lightsources.push(light1);

const { dorimeRat } = useDorimeRatModel();
const { orange } = useOrangeModel();

const player = new Body3D(dorimeRat);
player.setScale([0.5, 0.5, 0.5]);
player.updateWorldMatrix();

scene.objects.push(player);

const camera = new Camera(gl);
const renderer = new BaseRenderer(gl, vert_shader as string, frag_shader as string, scene, camera);
const skybox = new Skybox(gl, 60, [
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

/*
const magManager = new MagManager();
magManager.attachToMovable(player, timer, scene);
*/

timer.reset();

const update = () => {
    timer.update();
    player.move(timer);
    // magManager.moveBullets(timer);
    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    skyboxRenderer.render();
    renderer.render(false);
    requestAnimationFrame(update);
}

update();

