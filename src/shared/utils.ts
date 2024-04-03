import { Euler, Quaternion } from "three";
import { mat4 } from "gl-matrix";

export function matr_from_euler(rotation: Euler)
{
    let q = new Quaternion().setFromEuler(rotation);
    let rot_matr = new Float32Array(16);
    mat4.fromQuat(rot_matr, [q.x, q.y, q.z, q.w]);

    return rot_matr
}

export function getRandomFloat(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
