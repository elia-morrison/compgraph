import orangeFile from "bundle-text:../../../static/orange/Orange.obj"
import { Material } from "src/shared/mesh/material";
import { MeshLoader } from "src/shared/resource-loaders/mesh-loader";

export const useOrangeModel = () => {
    const texture = document.getElementById("orange_texture");
    const normal = document.getElementById("orange_normal");
    const bump = document.getElementById("orange_bump");
    if (!texture || !normal || !bump) throw new Error('orange_bump not found');

    const orangeMtl = new Material();
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

    let objLoader = new MeshLoader();
    let orange = objLoader.load(orangeFile);
    orange.material = orangeMtl;

    return orange;
}