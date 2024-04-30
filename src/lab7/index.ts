import { Scene } from "../shared/rendererGL";
import { ShadedRendererGL } from "../shared/shadedrenderer";
import frag_shader from "../shaders/shaded.frag";
import vert_shader from "../shaders/shaded.vert";
import { PointLight } from "../shared/lightsource";
import { OBJLoaderGL } from "../shared/objloader";
import { resizeCanvas } from "../shared/ui";
import orange_file from "bundle-text:../../static/orange/Orange.obj"
import { Timer } from "../shared/timer";
import { orangeMtl } from "./resources/orange-mtl";
import { Player } from "./entities/player/player";
import { StrafeMovement } from "./entities/player/movement/strafe-movement";

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

let renderer = new ShadedRendererGL(gl, vert_shader, frag_shader, scene);

const movementManager = new StrafeMovement();
const timer = new Timer();
const player = new Player({ mesh: orange_obj });
movementManager.attachToPlayer(player, timer);

timer.reset();

const update = () => {
    timer.update();
    player.move();
    renderer.render();
    requestAnimationFrame(update);
}

update();

