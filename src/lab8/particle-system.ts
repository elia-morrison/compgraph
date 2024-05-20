import { vec4 } from "gl-matrix";
import { ObjectGL } from "src/shared/mesh/objectGL";

class ParticleSystem extends ObjectGL {
    gl: WebGL2RenderingContext

    particleUpdateVert: string
    passthruFrag: string

    particleRenderVert: string
    particleRenderFrag: string

    particleTex: string
    particleImage: HTMLImageElement

    numParticles: number
    birthRatio: number
    minAge: number
    maxAge: number
    minTheta: number
    maxTheta: number
    minSpeed: number
    maxSpeed: number
    maxVelocity: number[]
    gravity: number[]
    origin: number[]

    constructor(gl: WebGL2RenderingContext, particleTex: string, onload: CallableFunction) {
        super();
        this.updateWorldMatrix();
        this.gl = gl;
        this.particleImage = new Image();
        this.particleTex = particleTex;
        this.particleImage.src = this.particleTex;
        this.particleImage.onload = function () { onload(); };
    }

    initialParticleData() {
        var data = [];
        for (var i = 0; i < this.numParticles; ++i) {
            data.push(0.0);
            data.push(0.0);
            data.push(0.0);
            var life = this.minAge + Math.random() * (this.maxAge - this.minAge);
            data.push(life + 1);
            data.push(life);
            data.push(0.0);
            data.push(0.0);
            data.push(0.0);
        }
        return data;
    }

    update(timeDelta: number) {

    }

    setupBlend() {
        let gl = this.gl;
        gl.depthMask(false);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendEquation(gl.FUNC_ADD);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    }
}


export { ParticleSystem };
