import { CullFaceBack, Euler } from "three";
import { Cube } from "../shared/primitives";
import { Scene } from "../shared/rendererGL";
import { ShadedRendererGL } from "../shared/shadedrenderer";
import frag_shader from "../shaders/shaded.frag";
import vert_shader from "../shaders/shaded.vert";
import { ReadonlyVec3, vec3 } from "gl-matrix";
import { PointLight } from "../shared/lightsource";
import { OBJLoaderGL } from "../shared/objloader";

import orange_file from "bundle-text:../../static/orange/Orange.obj"

let cv = document.querySelector("#main_canvas") as HTMLCanvasElement;
let gl = cv.getContext("webgl2") as WebGL2RenderingContext;

let scene = new Scene();

let light1 = new PointLight();
light1.setPosition([5, 10, -5]);
light1.radius = 15;
scene.lightsources.push(light1);
let obj_loader = new OBJLoaderGL();

let orange_obj = obj_loader.load(orange_file);
orange_obj.setPosition([0, 1.3, 0]);
orange_obj.setScale([0.05, 0.05, 0.05]);
orange_obj.setRotation(new Euler(0, 2.5, 0));
orange_obj.material.diff_map_1 = (document.getElementById("orange_texture")) as HTMLImageElement;
orange_obj.material.color_strength = 0;
orange_obj.material.diff_map_1_strength = 1.;
orange_obj.material.normal_map = (document.getElementById("orange_normal")) as HTMLImageElement;
orange_obj.material.bumpiness = 0.6;
scene.objects.push(orange_obj);

let renderer = new ShadedRendererGL(gl, vert_shader, frag_shader, scene);

let time = 0.;
function update() {
    time += 0.0015;
    orange_obj.setRotation(new Euler(0, 2 * time * Math.PI - Math.PI / 2, 0));
    renderer.render();
    requestAnimationFrame(() => { update() });
}

update();

