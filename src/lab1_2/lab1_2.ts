import { CullFaceBack, Euler } from "three";
import { Cube, Pentagon, Triangle } from "../shared/mesh/primitives";
import { Scene } from "../shared/renderers/rendererGL";
import { ShadedRendererGL } from "../shared/renderers/shadedrenderer";
import frag_shader from "../shaders/shaded.frag";
import vert_shader from "../shaders/shaded.vert";
import bypassVert from "../shaders/bypass.vert";
import solidFrag from "../shaders/solid.frag";
import textureCoordFrag from "../shaders/texture_coords.frag";
import stripesFrag from "../shaders/stripes.frag";
import normalCoordFrag from "../shaders/normal_coords.frag";
import { ReadonlyVec3, vec3 } from "gl-matrix";
import { PointLight } from "../shared/scenery/light/lightsource";
import { resizeCanvas } from "../shared/ui/ui";
import { Plane } from "src/shared/mesh/primitives";


let cv = document.querySelector("#main_canvas") as HTMLCanvasElement;
resizeCanvas(cv);
window.addEventListener('resize', function (event) { resizeCanvas(cv); }, true);
let gl = cv.getContext("webgl2") as WebGL2RenderingContext;

let renderer: null | ShadedRendererGL = null;
function setupSquare() {
    let scene = new Scene();
    let plane = new Plane([0, 3.5, 0], new Euler(0, Math.PI, 0));
    scene.objects.push(plane);
    renderer = new ShadedRendererGL(gl, bypassVert, textureCoordFrag, scene);
}

function setupTriangle() {
    let scene = new Scene();
    let tri = new Triangle([0, 2.5, 0], new Euler(0, Math.PI, 0));
    scene.objects.push(tri);
    renderer = new ShadedRendererGL(gl, bypassVert, normalCoordFrag, scene);
}

function setupPentagon() {
    let scene = new Scene();
    let pent = new Pentagon([0, 3.5, 0], new Euler(0, Math.PI, 0));
    scene.objects.push(pent);
    renderer = new ShadedRendererGL(gl, bypassVert, normalCoordFrag, scene);
}

function setupCube() {
    let scene = new Scene();
    let pent = new Cube([0, 3.5, 0], new Euler(Math.PI / 6, Math.PI / 3, 0,));
    scene.objects.push(pent);
    renderer = new ShadedRendererGL(gl, vert_shader, solidFrag, scene);
}

function setupStripes() {
    let scene = new Scene();
    let plane = new Plane([0, 3.5, 0], new Euler(0, Math.PI, 0));
    scene.objects.push(plane);
    renderer = new ShadedRendererGL(gl, bypassVert, stripesFrag, scene);
}


setupSquare();

function update() {
    renderer!.render();
    requestAnimationFrame(() => { update() });
}

$('#term').terminal({
    square: function () {
        setupSquare();
    },
    triangle: function () {
        setupTriangle();
    },
    pentagon: function () {
        setupPentagon();
    },
    cube: function () {
        setupCube();
    },
    stripes: function () {
        setupStripes();
    }
}, {
    greetings: 'WebGL / Labs 1_2',
    completion: ['square', 'triangle', 'pentagon', 'cube', 'stripes'],
});

update();

