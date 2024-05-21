import { ParticleSystem } from "./particle-system";
import particleRenderFrag from "./shaders/sparkler/sparkler-render.frag";
import particleRenderVert from "./shaders/sparkler/sparkler-render.vert";
import particleUpdateVert from "./shaders/sparkler/sparkler-update.vert";
import passthruFrag from "./shaders/passthru.frag";
import sparklerData from "bundle-text:./shaders/sparkler/sparkler_image.txt";

class SparklerParticleSystem extends ParticleSystem {
    constructor(gl: WebGL2RenderingContext, onload: CallableFunction) {
        let data = sparklerData;
        super(gl, data, onload);
        this.particleRenderFrag = particleRenderFrag;
        this.particleRenderVert = particleRenderVert;
        this.particleUpdateVert = particleUpdateVert;
        this.passthruFrag = passthruFrag;

        this.numParticles = 300;
        this.birthRatio = 0.5;
        this.minAge = 0.0;
        this.maxAge = 0.4;
        this.minTheta = this.minAge;
        this.maxTheta = this.maxAge;
        this.minSpeed = 0.1;
        this.maxSpeed = 0.4;
        this.maxVelocity = [1., 2., 1.];
        this.gravity = [0., 5., 0.];
        this.origin = [0., 0., 0.];
    }

    generateInitialVelocity(): number[] {
        let phi = 2.0 * 3.14159265 * (Math.random()); // Azimuthal angle
        let theta = Math.acos(2.0 * Math.random() - 1.0); // Polar angle
        let radius = Math.random() * 0.1 + 0.9;

        let x = Math.sin(theta) * Math.cos(phi);
        let y = Math.sin(theta) * Math.sin(phi);
        let z = Math.cos(theta);

        return [x * radius, y * radius, z * radius];
    }

    initialParticleData() {
        var data = [];
        for (var i = 0; i < this.numParticles; ++i) {
            data.push(this.origin[0]);
            data.push(this.origin[1]);
            data.push(this.origin[2]);
            data.push(this.minAge);
            data.push((Math.random() * 0.3 + 0.7) * this.maxAge);
            let initVel = this.generateInitialVelocity();
            data.push(initVel[0]);
            data.push(initVel[1]);
            data.push(initVel[2]);
        }
        return data;
    }

    // update(timeDelta: number): void {
    //     this.gravity[0] += timeDelta * (Math.random() * 2 - 1);
    //     this.gravity[1] += timeDelta * (Math.random() * 2 - 1);
    //     this.gravity[2] += timeDelta * (Math.random() * 2 - 1);
    // }
}

export { SparklerParticleSystem }