import { CullFaceBack, Euler } from "three";
import { Cube } from "../shared/mesh/primitives";
import { Scene } from "../shared/renderers/rendererGL";
import { ShadedRendererGL } from "../shared/renderers/shadedrenderer";
import frag_shader from "../shaders/shaded.frag";
import vert_shader from "../shaders/shaded.vert";
import { ReadonlyVec3, vec3 } from "gl-matrix";
import { PointLight } from "../shared/scenery/light/lightsource";
import { resizeCanvas } from "../shared/ui/ui";
import { Plane } from "src/shared/mesh/primitives";


let cv = document.querySelector("#main_canvas") as HTMLCanvasElement;
resizeCanvas(cv);
window.addEventListener('resize', function (event) { resizeCanvas(cv); }, true);
let gl = cv.getContext("webgl2") as WebGL2RenderingContext;

let scene = new Scene();

let light1 = new PointLight();
light1.setPosition([5, 10, -5]);
light1.radius = 15;
scene.lightsources.push(light1);

let plane = new Plane([0, 4, 0], new Euler(0, Math.PI, 0));
scene.objects.push(plane);

let renderer = new ShadedRendererGL(gl, vert_shader, frag_shader, scene);

let time = 0.;
function update() {
    renderer.render();
    requestAnimationFrame(() => { update() });
}

$('#term').terminal({
    square: function () {

    },
}, {
    greetings: 'WebGL / Labs 1_2',
    completion: ['square'],
});

update();

