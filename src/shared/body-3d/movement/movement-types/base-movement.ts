import { Body3D } from "src/shared/body-3d";
import { Timer } from "src/shared/runtime/timer";

export abstract class BaseMovement {
    abstract moveEntity(movable: Body3D, timer: Timer);
}