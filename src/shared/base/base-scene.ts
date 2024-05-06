import { Lightsource } from "src/shared/scenery/light/lightsource";
import { Body3D } from "./body-3d";
import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { vec3 } from "gl-matrix";

export class BaseScene {
    public objects: Body3D[] = [];
    public lightsources: Lightsource[] = [];
    public clock: THREE.Clock = new THREE.Clock();
    public physicsWorld: CANNON.World = new CANNON.World();

    constructor() {
        // this.physicsWorld.gravity.set(0, -9.82, 0);
    }

    public addObjects(objects: Body3D[]) {
        for (let obj of objects) {
            this.objects.push(obj);
            if (obj.collision) {
                obj.initPhysics();
                this.physicsWorld.addBody(obj.bbox!);
            }
        }
    }

    public updatePhysics() {
        let delta = Math.min(this.clock.getDelta(), 0.1);
        this.physicsWorld.step(delta);

        for (let obj of this.objects) {
            obj.syncVisualsToCollision();
        }
    }
}
