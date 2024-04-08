import { ReadonlyVec3 } from "gl-matrix";

export class Material {
    public use_fragment_shading = true;
    public diff_map_1: HTMLImageElement | null = null;
    public diff_map_1_strength: number = 0.;
    public diff_map_2: HTMLImageElement | null = null;
    public diff_map_2_strength: number = 0.;
    public color: ReadonlyVec3 = [0.5, 0.5, 0.5];
    public color_strength: number = 1.;

    public ambient: number = 0.3;
    public specular: number = 1;
    public diffusion: number = 1;

    public shininess: number = 32;

    public tooniness: number = 0;
    public rim_strength: number = 0;
    public rim_color: ReadonlyVec3 = [1, 1, 1];
}
