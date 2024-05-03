import { Lightsource } from "src/shared/scenery/light/lightsource";
import { Body3D } from "src/shared/base/body-3d";

export class BaseScene {
    public objects: Body3D[] = [];
    public lightsources: Lightsource[] = [];
}
