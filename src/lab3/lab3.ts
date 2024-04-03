import { Color, Euler, ToneMapping, Vector3 } from "three";
import { Cube } from "../shared/primitives";
import { RendererGL, Scene } from "../shared/rendererGL";
import frag_shader from "../shaders/generic.frag";
import vert_shader from "../shaders/generic.vert";
import { getRandomFloat, matr_from_euler } from "../shared/utils";
import { mat4, vec3 } from "gl-matrix";

let cv = document.querySelector("#main_canvas") as HTMLCanvasElement;
let gl = cv.getContext("webgl") as WebGL2RenderingContext;
let body: HTMLElement = document.getElementById('body') as HTMLElement;

let scene = new Scene();

let LOCAL_ROTATION = 0;
let PEDESTAL_ROTATION = 0;
let WORLD_ROTATION = 0;


let firstPlace = new Cube([0.5, 0, 0], new Euler())
firstPlace.material.color = [1., 1., 0.]
scene.objects.push(firstPlace);


let renderer = new RendererGL(gl, vert_shader, frag_shader, scene);

function update() {
    renderer.render();
    requestAnimationFrame(() => { update() });
}

update()
body.addEventListener('keydown', (e) => {
    if (['a','A','ф','Ф'].includes(e.key)) {
        console.log("Move left")
    }
    if (['d','D','в','В'].includes(e.key)) {
        console.log("Move left")
    }
    if (['w','W','ц','Ц'].includes(e.key)) {
        console.log("Move left")
    }
    if (['s','S','ы','Ы'].includes(e.key)) {
        console.log("Move left")
    }
    if (['й','Й','q','Q'].includes(e.key)) {
        console.log("Move left")
    }
    if (['e','E','у','У'].includes(e.key)) {
        console.log("Move left")
    }
  });
console.log("hello from lab 3")
