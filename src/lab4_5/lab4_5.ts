import { Euler } from "three";
import { Cube } from "../shared/primitives";
import { Scene } from "../shared/rendererGL";
import { ShadedRendererGL } from "../shared/shadedrenderer";
import frag_shader from "../shaders/shaded.frag";
import vert_shader from "../shaders/shaded.vert";
import { ReadonlyVec3, vec3 } from "gl-matrix";
import { PointLight } from "../shared/lightsource";

let cv = document.querySelector("#main_canvas") as HTMLCanvasElement;
let gl = cv.getContext("webgl2") as WebGL2RenderingContext;
let body: HTMLElement = document.getElementById('body') as HTMLElement;

let pedestal_position = vec3.fromValues(0, -5, 20)

let scene = new Scene();
let lightsource = new PointLight();
lightsource.translate(pedestal_position);
lightsource.translate([0, 5, 0]);
lightsource.radius = 5;
scene.lightsources.push(lightsource);

function makePedestalPart(origin: ReadonlyVec3, color: ReadonlyVec3, scale: ReadonlyVec3,
    texture1: HTMLElement | null = null, texture2: HTMLElement | null = null): Cube {
    let obj = new Cube(origin, new Euler());
    obj.translate(pedestal_position);
    obj.material.color = color;
    obj.material.diff_map_1 = texture1 as HTMLImageElement;
    obj.material.diff_map_2 = texture2 as HTMLImageElement;

    obj.setScale(scale);
    scene.objects.push(obj);
    return obj
}

let pedestal_parts = new Map<string, Cube>();
let material_texture = document.getElementById("texture2");
pedestal_parts.set("ground", makePedestalPart([0, -2, 0], [1, 1, 1], [10, 1, 10]));
pedestal_parts.set("first",
    makePedestalPart(
        [0, 0.5, 0], [1., 1., 0.], [1.5, 1.5, 1.5],
        document.getElementById("number1"),
        material_texture
    ));
pedestal_parts.set("second",
    makePedestalPart([-3, -0.2, 0], [0.7, 0.7, 0.7], [1.5, 0.8, 1.5],
        document.getElementById("number2"),
        material_texture
    ));
pedestal_parts.set("third",
    makePedestalPart([3, -0.5, 0], [0.8, 0.5, 0.2], [1.5, 0.5, 1.5],
        document.getElementById("number3"),
        material_texture
    ));

let renderer = new ShadedRendererGL(gl, vert_shader, frag_shader, scene);

function rotatePedestal(how: string = "pedestal", amount: number) {
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
    if (['a', 'A', 'ф', 'Ф'].includes(e.key)) {
        rotateObjectsLocally(0.1);
    }
    if (['d', 'D', 'в', 'В'].includes(e.key)) {
        rotateObjectsLocally(-0.1);
    }
    if (['z', 'Z', 'я', 'Я'].includes(e.key)) {
        rotatePedestal("center", 0.05);
    }
    if (['c', 'C', 'с', 'С'].includes(e.key)) {
        rotatePedestal("center", -0.05);
    }
    if (['й', 'Й', 'q', 'Q'].includes(e.key)) {
        rotatePedestal("pedestal", 0.05);
    }
    if (['e', 'E', 'у', 'У'].includes(e.key)) {
        rotatePedestal("pedestal", -0.05);
    }
});
console.log("hello from lab 4")


$('#term').terminal({
    hello: function (what: string) {
        this.echo('Hello, ' + what +
            '. Wellcome to this terminal.');
    },
    toon: function (how_much: number) {
        for (let x of pedestal_parts.values()) {
            x.material.tooniness = how_much;
        }
    },
    rim: function (how_much: number) {
        for (let x of pedestal_parts.values()) {
            x.material.rim_strength = how_much;
            x.material.diffusion = 1 - how_much;
        }
    },
    radius: function (radius: number) {
        lightsource.radius = radius;
    },
    blend: function (color: number, texture1: number, texture2: number) {
        for (let x of ["first", "second", "third"]) {
            let part = pedestal_parts.get(x);
            part!.material.diff_map_1_strength = texture1;
            part!.material.diff_map_2_strength = texture2;
            part!.material.color_strength = color;
        }
    },
    falloff: function (falloff: "quadratic" | "linear") {
        switch (falloff) {
            case "quadratic":
                lightsource.quadraticFalloff = true;
                break;
            case "linear":
                lightsource.quadraticFalloff = false;
                break;

            default:
                this.echo("Wrong parameter!")
                break;
        }
    },
    shading: function (shading: "phong" | "gouraud") {
        switch (shading) {
            case "phong":
                for (let x of pedestal_parts.values()) {
                    x.material.use_fragment_shading = true;
                }
                break;
            case "gouraud":
                for (let x of pedestal_parts.values()) {
                    x.material.use_fragment_shading = false;
                }
                break;

            default:
                this.echo("Wrong parameter!")
                break;
        }
    },
    illumination: function (illumination: "lambertian" | "phong") {
        switch (illumination) {
            case "lambertian":
                for (let x of pedestal_parts.values()) {
                    x.material.ambient = 0;
                    x.material.specular = 0;
                }
                break;
            case "phong":
                for (let x of pedestal_parts.values()) {
                    x.material.ambient = 0.3;
                    x.material.specular = 1;
                }
                break;

            default:
                this.echo("Wrong parameter!")
                break;
        }
    }
}, {
    greetings: 'WebGL / Lab4 / Lab5'
});


