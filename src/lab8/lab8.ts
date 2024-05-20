import { resizeCanvas } from "../shared/ui/ui";
import { ParticleSystem } from "./particle-system";
import { AttribInfo, GLManager, ShaderInfo, VAOInfo } from "./gl-manager";
import { Timer } from "../shared/runtime/timer";
import { Camera } from "src/shared/scenery/camera";
import { FireParticleSystem } from "./fire";
import { FireworksParticleSystem } from "./fireworks";
import { Euler } from "three";

let canvas_element = document.querySelector("#main_canvas") as HTMLCanvasElement;
resizeCanvas(canvas_element);
window.addEventListener('resize', function (event) { resizeCanvas(canvas_element); }, true);
let webgl_context = canvas_element.getContext("webgl2") as WebGL2RenderingContext;

let camera = new Camera(webgl_context);
camera.setPosition([0, 0, -3]);

let glManager = new GLManager(webgl_context, camera);

function initParticleSystem(ParticleClass: { new(gl: WebGL2RenderingContext, onload: CallableFunction): ParticleSystem }) {
    let pS = new ParticleClass(webgl_context, function () {
        glManager.init(pS);

        let update = function (ts: number) {
            pS.setRotation(new Euler(0, 2 * glManager.totalTime / 1000. * Math.PI - Math.PI / 2, 0));
            glManager.render(ts);
            window.requestAnimationFrame(update);
        };

        window.requestAnimationFrame(update);
    });
}

initParticleSystem(FireParticleSystem);

$('#term').terminal({
    sparkler: function () {

    },
    fireworks: function () {
        initParticleSystem(FireworksParticleSystem);
    },
    fire: function () {
        initParticleSystem(FireParticleSystem);
    }
}, {
    greetings: 'WebGL / Lab8',
    completion: ['sparkler', 'fireworks', 'fire'],
});