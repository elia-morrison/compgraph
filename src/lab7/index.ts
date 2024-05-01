import { Scene } from "../shared/rendererGL";
import { ShadedRendererGL } from "../shared/shadedrenderer";
import frag_shader from "../shaders/shaded.frag";
import vert_shader from "../shaders/shaded.vert";
import skyboxVertShader from "../shared/scenery/skybox/shaders/cubemap.vert";
import skyboxFragShader from "../shared/scenery/skybox/shaders/cubemap.frag";
import { PointLight } from "../shared/lightsource";
import { OBJLoaderGL } from "../shared/objloader";
import { resizeCanvas } from "../shared/ui";
import orange_file from "bundle-text:../../static/orange/Orange.obj"
import { Timer } from "../shared/timer";
import { orangeMtl } from "./resources/orange-mtl";
import { StrafeMovement } from "./utils/movable/managers/strafe-movement";
import { Movable } from "./utils/movable";
import { Skybox } from "../shared/scenery/skybox";
import { SkyboxRendererGL } from "../shared/scenery/skybox/renderer";

let cv = document.querySelector("#main_canvas") as HTMLCanvasElement;
resizeCanvas(cv);
window.addEventListener('resize', function (event) { resizeCanvas(cv); }, true);
let gl = cv.getContext("webgl2") as WebGL2RenderingContext;

let scene = new Scene();

let light1 = new PointLight();
light1.setPosition([5, 10, -5]);
light1.radius = 15;
scene.lightsources.push(light1);
let obj_loader = new OBJLoaderGL();

let orange_obj = obj_loader.load(orange_file);
orange_obj.setScale([0.01, 0.01, 0.01]);
orange_obj.material = orangeMtl;
scene.objects.push(orange_obj);


let renderer = new ShadedRendererGL(gl, vert_shader as string, frag_shader as string, scene);
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
    skyboxVertShader as string, skyboxFragShader as string, renderer.camera, skybox);

const movementManager = new StrafeMovement();
const timer = new Timer();
const player = new Movable({ mesh: orange_obj });
movementManager.attachToPlayer(player, timer);

timer.reset();

const update = () => {
    timer.update();
    player.move();
    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    skyboxRenderer.render();
    renderer.render(false);
    requestAnimationFrame(update);
}

update();

