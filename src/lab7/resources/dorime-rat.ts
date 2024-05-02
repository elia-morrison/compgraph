import dorimeObj from "bundle-text:../../../static/dorime/rat_main.obj"
import { Material } from "../../shared/mesh/material";
import { OBJLoaderGL } from "../../shared/obj-loader/objloader";


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

    const objLoader = new OBJLoaderGL();
    const dorimeRat = objLoader.load(dorimeObj);
    dorimeRat.setScale([0.5, 0.5, 0.5]);
    dorimeRat.material = dorimeMtl;

    return { dorimeRat }
}