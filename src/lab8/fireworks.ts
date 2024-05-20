import { ParticleSystem } from "./particle-system";
import particleRenderFrag from "./shaders/fireworks/fireworks-render.frag";
import particleRenderVert from "./shaders/fireworks/fireworks-render.vert";
import particleUpdateVert from "./shaders/fireworks/fireworks-update.vert";
import passthruFrag from "./shaders/passthru.frag";

class FireworksParticleSystem extends ParticleSystem {
    constructor(gl: WebGL2RenderingContext, onload: CallableFunction) {
        let data = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QYTCCY1R1556QAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAC4ElEQVRYw8VXa4/aMBAcB0OgB0ff///vVWpV0UAOcBz3w832hr0EyLVSLa0S7mLPePbhdcAbRykl2HsIobx1nTARMIzMVQJlCqEwATgAmMmcSj7rhUjm8y4iYQLwjKDxCoGO7/leIuEKeCXAkTZzZiM762j2ux8jEW+Az2kRwIIWxSA7NzvTZgCSrDtIIt4Ar/lcAVjSjNBcpiaCJwBH2pNz0yCJOOASBV/yueb7O5qpYcN23YpqAcDJC+wy5oXAwO4XBH0AsAGwJZG1/M/GkQT2tJ1sqFcrpVwEpSpQSZSb7Ab+HsAHIbKhMjZOABr+bTFQI7LLjHxBQFLO734l4F8APPK5ohI29iRWO2U0MC07+mcRnlWIIpWmXS0+3xB4C+ArgM/iCiWw5xrm+44xkfjbMiPTHYMEouT9gi5YO/BPVMRSsuM3P51LLCae3LqdumgsC6LLhC3VeATwkU9LSUu9wPeW3zeSxtGV8ZcsEP9X4oYosVC7gKxJ5kEIVNz1hsArCUglYBjB4iCOlGe1SpSpJM9tdxXlnssGdJ7a7VJ8x7Ag6giiB9DkEUMIpZRSXMHIUlq1yrUMOPW5xUCSb2xOkkNJ1y8+Df0OFdyKzJZRXYvPo+T5TqK+kUxQEqMusBrdOQItgAMXX4p/E4MwcN6BoD8AfOf3B6kDuu7FeaAEtJE40Vou7Gv/nhFvo6EbvhG8obWyVvZF6A8BxoH5J3GnR/5/5ypcIvjOHUYNi5E9d3THUVzR++YkurbKy++7prP425+GRmJPAr/43g4E4+s0pAomU5KioQfLgTbWD+wlE8wtploGkG81JBaIcOc5JNq16dCOyLLGuqFWsihJAI4XIlEBzjW9LB6lvKo6BnISRS7S8GZPOEJCY+N8R1fciSL5Gvg99wJ/QFUi/dC9IEmZzkNR/5abUTVwII0R6KXt6kMI/T+5G7pbUrhyNyxTrmWTLqcDt+JXBP7mlvzfxm8amZhMH7WSmQAAAABJRU5ErkJggg==`;
        super(gl, data, onload);
        this.particleRenderFrag = particleRenderFrag;
        this.particleRenderVert = particleRenderVert;
        this.particleUpdateVert = particleUpdateVert;
        this.passthruFrag = passthruFrag;

        this.numParticles = 5000;
        this.birthRatio = 50;
        this.minAge = 0.;
        this.maxAge = 1.;
        this.minTheta = this.minAge;
        this.maxTheta = this.maxAge;
        this.minSpeed = 0.1;
        this.maxSpeed = 0.4;
        this.maxVelocity = [1000., 2000., 1000.];
        this.gravity = [0., 5., 0.];
        this.origin = [0., -0.5, 0.];
    }

    // update(timeDelta: number): void {
    //     this.gravity[0] += timeDelta * (Math.random() * 2 - 1);
    //     this.gravity[1] += timeDelta * (Math.random() * 2 - 1);
    //     this.gravity[2] += timeDelta * (Math.random() * 2 - 1);
    // }

    initialParticleData() {
        var data = [];
        for (var i = 0; i < this.numParticles; ++i) {
            data.push(0.0);
            data.push(0.0);
            data.push(0.0);
            data.push(this.maxAge);
            data.push(this.maxAge);
            data.push(0.0);
            data.push(0.0);
            data.push(0.0);
        }
        return data;
    }
}

export { FireworksParticleSystem }