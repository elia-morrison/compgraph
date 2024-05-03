import dorimeObj from "bundle-text:../../../static/dorime/rat_main.obj"
import { Material } from "src/shared/mesh/material";
import { MeshLoader } from "src/shared/resource-loaders/mesh-loader";


export const useDorimeRatModel = () => {

    const dorimeTexture = document.getElementById("dorime");
    if (!dorimeTexture) throw new Error('dorime not found');
    const dorimeMtl = new Material();
    dorimeMtl.diff_map_1 = dorimeTexture as HTMLImageElement;
    dorimeMtl.color_strength = 0;
    dorimeMtl.ambient = 0.2;
    dorimeMtl.diff_map_1_strength = 1.;
    dorimeMtl.shininess = 32;
    dorimeMtl.specular = 1;

    const objLoader = new MeshLoader();
    const dorimeRat = objLoader.load(dorimeObj);
    dorimeRat.material = dorimeMtl;

    return dorimeRat;
}