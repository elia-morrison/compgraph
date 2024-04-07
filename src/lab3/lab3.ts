import { Color, Euler, ToneMapping, Vector3 } from "three";
import { Cube } from "../shared/primitives";
import { RendererGL, Scene } from "../shared/rendererGL";
import frag_shader from "../shaders/generic.frag";
import vert_shader from "../shaders/generic.vert";
import { ReadonlyVec3, vec3 } from "gl-matrix";

let cv = document.querySelector("#main_canvas") as HTMLCanvasElement;
let gl = cv.getContext("webgl") as WebGL2RenderingContext;
let body: HTMLElement = document.getElementById('body') as HTMLElement;

let scene = new Scene();

let pedestal_position = vec3.fromValues(0, -5, 20)

function makePedestalPart(origin: ReadonlyVec3, color: ReadonlyVec3, scale: ReadonlyVec3): Cube
{
    let obj = new Cube(origin, new Euler());
    obj.translate(pedestal_position);
    obj.material.color = color
    obj.setScale(scale);
    scene.objects.push(obj);
    return obj
}

let pedestal_parts = new Map<string, Cube>();

pedestal_parts.set("ground", makePedestalPart([0, -2, 0], [1, 1, 1], [10, 1, 10]));
pedestal_parts.set("first", makePedestalPart([0, 0, 0], [1., 1., 0.], [1.5, 1.5, 1.5]));
pedestal_parts.set("second", makePedestalPart([-3, -0.2, 0], [0.7, 0.7, 0.7], [1.5, 0.8, 1.5]));
pedestal_parts.set("third", makePedestalPart([3, -0.5, 0], [0.8, 0.5, 0.2], [1.5, 0.5, 1.5]));

let renderer = new RendererGL(gl, vert_shader, frag_shader, scene);

function rotatePedestal(how: string = "pedestal", amount: number){
    let origin = how == "pedestal" ? pedestal_parts.get('ground')?.position! : vec3.fromValues(0., 0., 0.)

    for (let x of pedestal_parts.values()) {
        x?.rotateAroundYAxis(amount, origin);
    }
}

function rotateObjectsLocally(amount: number) {
    for (let x of ["first", "second", "third"]) {
        let part = pedestal_parts.get(x);
        part?.rotateAroundYAxis(amount, part.position);
    }
}

function update() {
    renderer.render();
    requestAnimationFrame(() => { update() });
}

update()
body.addEventListener('keydown', (e) => {
    if (['a','A','ф','Ф'].includes(e.key)) {
        rotateObjectsLocally(0.1);
    }
    if (['d','D','в','В'].includes(e.key)) {
        rotateObjectsLocally(-0.1);
    }
    if (['z','Z','я','Я'].includes(e.key)) {
        rotatePedestal("center", 0.05);
    }
    if (['c','C','с','С'].includes(e.key)) {
        rotatePedestal("center", -0.05);
    }
    if (['й','Й','q','Q'].includes(e.key)) {
        rotatePedestal("pedestal", 0.05);
    }
    if (['e','E','у','У'].includes(e.key)) {
        rotatePedestal("pedestal", -0.05);
    }
  });
console.log("hello from lab 3")
