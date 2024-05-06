import { ReadonlyVec3, vec3 } from "gl-matrix";
import { ObjectGL } from "src/shared/mesh/objectGL";

export class Lightsource extends ObjectGL {
    public intensity: number = 1.;
    public color: ReadonlyVec3 = [1, 1, 1];
}

export class PointLight extends Lightsource {
    public quadraticFalloff = true;
    public radius = 10;
}

export class DirectionalLight extends Lightsource {
    public color: ReadonlyVec3 = [1, 1, 0.5];
    public direction: vec3 = [-0.5, -0.5, -0.5];
}

export class SpotLight extends Lightsource {
    public radius = 6;
    public cutOff = 0.82;
    public outerCutOff = 0.91;
    public direction: vec3 = [-0, -1, -0];
}
