import { Movable } from "../index";
import { Timer } from "../../../../shared/timer";

export abstract class BaseMovement {
    /*abstract attachToMovable(player: Movable, timer: Timer);
    abstract detachFromMovable();*/
    abstract moveEntity(movable: Movable, timer: Timer);
}