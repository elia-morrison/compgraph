import { Movable } from "../index";
import { Timer } from "src/shared/runtime/timer";

export abstract class BaseMovement {
    abstract moveEntity(movable: Movable, timer: Timer);

    abstract attachToMovable(player: Movable);
}