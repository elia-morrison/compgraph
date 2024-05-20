import { ParticleSystem } from "./particle-system";
import particleRenderFrag from "./shaders/smoke/smoke-render.frag";
import particleRenderVert from "./shaders/smoke/smoke-render.vert";
import particleUpdateVert from "./shaders/smoke/smoke-update.vert";
import passthruFrag from "./shaders/passthru.frag";
import smokeData from "bundle-text:./shaders/smoke/smoke_image.txt";

class SmokeParticleSystem extends ParticleSystem {
    constructor(gl: WebGL2RenderingContext, onload: CallableFunction) {
        let data = smokeData;
        super(gl, data, onload);
        this.particleRenderFrag = particleRenderFrag;
        this.particleRenderVert = particleRenderVert;
        this.particleUpdateVert = particleUpdateVert;
        this.passthruFrag = passthruFrag;

        this.numParticles = 800;
        this.birthRatio = 0.3;
        this.minAge = 0.;
        this.maxAge = 6.;
        this.minTheta = this.minAge;
        this.maxTheta = this.maxAge;
        this.minSpeed = 0.1;
        this.maxSpeed = 0.4;
        this.maxVelocity = [1000., 2000., 1000.];
        this.gravity = [0., 5., 0.];
        this.origin = [0., -2, 0.];

    }

    // update(timeDelta: number): void {
    //     this.gravity[0] += timeDelta * (Math.random() * 2 - 1);
    //     this.gravity[1] += timeDelta * (Math.random() * 2 - 1);
    //     this.gravity[2] += timeDelta * (Math.random() * 2 - 1);
    // }

    initialParticleData() {
        var data = [];
        for (var i = 0; i < this.numParticles; ++i) {
            data.push((Math.random() - 0.5) * 5);
            data.push(this.origin[1]);
            data.push((Math.random() - 0.5) * 5);
            data.push(this.minAge);
            data.push((Math.random() * 0.3 + 0.7) * this.maxAge);
            data.push(0.0);
            data.push(0.0);
            data.push(0.0);
        }
        return data;
    }

    setupBlend() {
        let gl = this.gl;
        gl.depthMask(false);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendEquation(gl.FUNC_REVERSE_SUBTRACT);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_CONSTANT_ALPHA);
    }
}

export { SmokeParticleSystem }