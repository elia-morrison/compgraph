import { ReadonlyVec3 } from "gl-matrix";

export class Material {
    public diffusion_map: HTMLImageElement | null = null;
    public color: ReadonlyVec3 = [0.5, 0.5, 0.5];

    public ambient: number = 0.3;
    public specular: number = 1;
    public diffusion: number = 1;

    public shininess: number = 32;

    public tooniness: number = 0;
    public rim_strength: number = 0;
    public rim_color: ReadonlyVec3 = [1, 0, 0];
}
