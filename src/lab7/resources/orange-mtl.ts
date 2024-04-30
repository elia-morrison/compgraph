import { Material } from "../../shared/material";

const orangeMtl = new Material();

const texture = document.getElementById("orange_texture");
if (!texture) throw new Error('orange_texture not found');

const normal = document.getElementById("orange_normal");
if (!texture) throw new Error('orange_normal not found');

const bump = document.getElementById("orange_bump");
if (!texture) throw new Error('orange_bump not found');

orangeMtl.diff_map_1 = texture as HTMLImageElement;
orangeMtl.color_strength = 0;
orangeMtl.ambient = 0.2;
orangeMtl.diff_map_1_strength = 1.;
orangeMtl.normal_map = normal as HTMLImageElement;
orangeMtl.normal_map_strength = 1.;
orangeMtl.bump_map = bump as HTMLImageElement;
orangeMtl.bumpiness = 0.05;
orangeMtl.shininess = 32;
orangeMtl.specular = 1;

export {
    orangeMtl
}