import { resizeCanvas } from "../shared/ui/ui";
import { ParticleSystem } from "./particle-system";
import fireFragShader from "./shaders/fire.frag";
import fireVertShader from "./shaders/fire.vert";
import { Timer } from "../shared/runtime/timer";

let cv = document.querySelector("#main_canvas") as HTMLCanvasElement;
resizeCanvas(cv);
window.addEventListener('resize', function (event) { resizeCanvas(cv); }, true);
let gl = cv.getContext("webgl2") as WebGL2RenderingContext;
let particleSystem = new ParticleSystem(gl, fireFragShader, fireVertShader);

const timer = new Timer();
timer.reset();

const update = () => {
    timer.update();

    particleSystem.update(timer.timeDelta);
    requestAnimationFrame(update);
}

update();

$('#term').terminal({
    sparkler: function (bumpiness: number) {

    },
}, {
    greetings: 'WebGL / Lab8',
    completion: ['sparkler'],
});