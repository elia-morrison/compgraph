import { resizeCanvas } from "src/shared/ui/ui";
import { PointLight } from "src/shared/scenery/light/lightsource";
import { useDorimeRatModel } from "src/lab7/resources/dorime-rat";
import { useOrangeModel } from "src/lab7/resources/orange";
import { Skybox } from "src/shared/scenery/skybox";
import frag_shader from "src/shaders/shaded.frag";
import vert_shader from "src/shaders/shaded.vert";
import skyboxVertShader from "src/shared/scenery/skybox/shaders/cubemap.vert";
import skyboxFragShader from "src/shared/scenery/skybox/shaders/cubemap.frag";
import { SkyboxRendererGL } from "src/shared/scenery/skybox/renderer";
import { Timer } from "src/shared/runtime/timer";
import { Body3D } from "src/shared/body-3d";
import { PlayerMovementManager } from "src/shared/body-3d/movement/movement-managers/strafe-movement-manager";
import { BaseRendererGL, BaseScene } from "src/shared/renderers/base-renderer";
import { BaseShaderProgram } from "src/shared/webgl/base-shader-program";
import { Camera } from "src/shared/scenery/camera";


let cv = document.querySelector("#main_canvas") as HTMLCanvasElement;
resizeCanvas(cv);
window.addEventListener('resize', function (event) { resizeCanvas(cv); }, true);
let gl = cv.getContext("webgl2") as WebGL2RenderingContext;

const scene = new BaseScene();

let light1 = new PointLight();
light1.setPosition([-5, 10, -5]);
light1.radius = 50;
scene.lightsources.push(light1);

const timer = new Timer();

const dorimeRat = useDorimeRatModel();
const orangeMesh = useOrangeModel();

const orange = new Body3D(orangeMesh);
orange.setScale([0.01, 0.01, 0.01]);

/*const player = new Body3D(dorimeRat);
player.setScale([0.5, 0.5, 0.5]);

const playerMovementManager = new PlayerMovementManager();
playerMovementManager.attachToBody3D(player, timer);*/

/* const magManager = new MagManager();
magManager.attachToBody3D(player, timer, scene); */

scene.objects.push(orange);

const camera = new Camera(gl);
const shaderProgram = new BaseShaderProgram(vert_shader as string, frag_shader as string, gl);
shaderProgram.use();

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
    skyboxVertShader as string,
    skyboxFragShader as string,
    camera,
    skybox
);

const renderer = new BaseRendererGL(shaderProgram, scene, camera);

timer.reset();

const update = () => {
    timer.update();
    // player.move(timer);
    // magManager.moveBullets(timer);

    renderer.clear();

    // skyboxRenderer.render();
    renderer.render();
    requestAnimationFrame(update);
}

update();

