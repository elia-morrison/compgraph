import file from "bundle-text:../../../static/sphere.obj"
import { Material } from "src/shared/mesh/material";
import { MeshLoader } from "src/shared/resource-loaders/mesh-loader";

export const useLanternModel = () => {

    const mtl = new Material();
    mtl.color_strength = 1;
    mtl.color = [1, 1, 1];
    mtl.ambient = 1;

    const objLoader = new MeshLoader();
    let orange = objLoader.load(file);
    orange.material = mtl;

    return orange;
}