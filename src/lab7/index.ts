import frag_shader from "../shaders/shaded.frag";
import vert_shader from "../shaders/shaded.vert";
import skyboxVertShader from "../shared/scenery/skybox/shaders/cubemap.vert";
import skyboxFragShader from "../shared/scenery/skybox/shaders/cubemap.frag";
import { Movable } from "./utils/movable";
import { Skybox } from "../shared/scenery/skybox";
import { SkyboxRendererGL } from "../shared/scenery/skybox/renderer";
import { useDorimeRatModel } from "./resources/dorime-rat";
import { useOrangeModel } from "./resources/orange";
import { MagManager } from "./utils/mag/mag-manager";
import { PlayerMovementManager } from "./utils/movable/movement-managers/strafe-movement-manager";
import { resizeCanvas } from "../shared/ui/ui";
import { Scene } from "../shared/renderers/rendererGL";
import { PointLight } from "../shared/scenery/light/lightsource";
import { ShadedRendererGL } from "../shared/renderers/shadedrenderer";
import { Timer } from "../shared/runtime/timer";

let cv = document.querySelector("#main_canvas") as HTMLCanvasElement;
resizeCanvas(cv);
window.addEventListener('resize', function (event) { resizeCanvas(cv); }, true);
let gl = cv.getContext("webgl2") as WebGL2RenderingContext;

let scene = new Scene();

let light1 = new PointLight();
light1.setPosition([-5, 10, -5]);
light1.radius = 50;
scene.lightsources.push(light1);

const {
    dorimeRat: playerMesh
} = useDorimeRatModel();

const {
    orange
} = useOrangeModel();

scene.objects.push(playerMesh);

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

const timer = new Timer();

const player = new Movable({ mesh: playerMesh });

const playerMovementManager = new PlayerMovementManager();
playerMovementManager.attachToMovable(player, timer);

const magManager = new MagManager();
magManager.attachToMovable(player, timer, scene);

timer.reset();

const update = () => {
    timer.update();
    player.move(timer);
    magManager.moveBullets(timer);
    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    skyboxRenderer.render();
    renderer.render(false);
    requestAnimationFrame(update);
}

update();

