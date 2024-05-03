import {  mat4, ReadonlyVec3 } from "gl-matrix";
import { Camera } from "src/shared/scenery/camera";
import { DirectionalLight, Lightsource, PointLight, SpotLight } from "src/shared/scenery/light/lightsource";
import { BaseShaderProgram } from "src/shared/webgl/base-shader-program";
import { Body3D } from "src/shared/body-3d";

export class BaseScene {
    public objects: Body3D[] = [];
    public lightsources: Lightsource[] = [];
}

export class BaseRendererGL {
    textarea = document.getElementById('body');

    gl: WebGL2RenderingContext;

    matWorldUniformLocation: WebGLUniformLocation;
    matRotUniformLocation: WebGLUniformLocation;
    matViewUniformLocation: WebGLUniformLocation;
    matProjUniformLocation: WebGLUniformLocation;

    positionAttribLocation: number;
    normalAttribLocation: number;
    uvAttribLocation: number;

    constructor(
        readonly shaderProgram: BaseShaderProgram,
        readonly scene: BaseScene,
        readonly camera: Camera,
    ) {
        if(!this.shaderProgram.program) throw new Error('УВАГА НЕТ ШЕЙДЕРНОЙ ПРОГРАММЫ');
        this.gl = this.shaderProgram.glContext;

        this.shaderProgram.use();

        this.matWorldUniformLocation = this.gl.getUniformLocation(this.shaderProgram.program, 'mWorld') as WebGLUniformLocation;
        this.matRotUniformLocation = this.gl.getUniformLocation(this.shaderProgram.program, 'rotMatr') as WebGLUniformLocation;

        console.log(this.matWorldUniformLocation, this.matRotUniformLocation);
        if (this.matWorldUniformLocation == null) {
            throw Error('wrong world uniform');
        }

        this.camera.setPosition([0, 0, -50]);
        this.setupView();

        for (let obj of this.scene.objects) {
            obj.mesh.setupBuffers(this.gl);
            obj.mesh.setupTextures(this.gl);
            obj.updateWorldMatrix();
        }

        this.positionAttribLocation = this.gl.getAttribLocation(this.shaderProgram.program, 'vertPosition');
        this.normalAttribLocation = this.gl.getAttribLocation(this.shaderProgram.program, 'vertNormal');
        this.uvAttribLocation = this.gl.getAttribLocation(this.shaderProgram.program, 'vertUV');
    }

    public clear() {
        let gl = this.gl;
        gl.clearColor(0, 0, 0, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    }

    setupView(eye: ReadonlyVec3 = [0, 5, -10]) {
        mat4.lookAt(this.camera.viewMatrix, eye, [0, 3, 4], [0, 1, 0]);

        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.frontFace(this.gl.CCW);
        this.gl.cullFace(this.gl.BACK);

        this.matViewUniformLocation = this.shaderProgram.setViewMat(this.camera.viewMatrix, 'mView') as WebGLUniformLocation;
        this.matProjUniformLocation = this.shaderProgram.setProjMat(this.camera.projMatrix, 'mProj') as WebGLUniformLocation;
    }

    setupLight() {
        let gl = this.gl;

        this.shaderProgram.setVec3('viewPos', this.camera._position);

        // TODO: refactor :(
        let pointlight_i = 0;
        let dirlight_i = 0;
        let spotlight_i = 0;

        if(!this.shaderProgram.program) throw new Error('УВАГА НЕТ ШЕЙДЕРНОЙ ПРОГРАММЫ');
        for (let ls of this.scene.lightsources) {
            if (ls instanceof PointLight) {
                let color_loc = gl.getUniformLocation(this.shaderProgram.program, 'pointLights[' + pointlight_i + '].color');
                gl.uniform3fv(color_loc, ls.color);

                let linear_loc = gl.getUniformLocation(this.shaderProgram.program, 'pointLights[' + pointlight_i + '].radius');
                gl.uniform1f(linear_loc, ls.radius);

                let position_loc = gl.getUniformLocation(this.shaderProgram.program, 'pointLights[' + pointlight_i + '].position');
                gl.uniform3fv(position_loc, ls._position);

                let falloff_loc = gl.getUniformLocation(this.shaderProgram.program, 'pointLights[' + pointlight_i + '].quadratic_falloff');
                gl.uniform1i(falloff_loc, ls.quadraticFalloff ? 1 : 0);

                pointlight_i += 1;
            }
            else if (ls instanceof DirectionalLight) {
                let color_loc = gl.getUniformLocation(this.shaderProgram.program, 'dirLights[' + dirlight_i + '].color');
                gl.uniform3fv(color_loc, ls.color);

                let intensity_loc = gl.getUniformLocation(this.shaderProgram.program, 'dirLights[' + dirlight_i + '].intensity');
                gl.uniform1f(intensity_loc, ls.intensity);

                let direction_loc = gl.getUniformLocation(this.shaderProgram.program, 'dirLights[' + dirlight_i + '].direction');
                gl.uniform3fv(direction_loc, ls.direction);
                dirlight_i += 1;
            }
            else if (ls instanceof SpotLight) {
                let color_loc = gl.getUniformLocation(this.shaderProgram.program, 'spotLight[' + spotlight_i + '].color');
                gl.uniform3fv(color_loc, ls.color);

                let linear_loc = gl.getUniformLocation(this.shaderProgram.program, 'spotLight[' + spotlight_i + '].radius');
                gl.uniform1f(linear_loc, ls.radius);

                let position_loc = gl.getUniformLocation(this.shaderProgram.program, 'spotLight[' + spotlight_i + '].position');
                gl.uniform3fv(position_loc, ls._position);

                let direction_loc = gl.getUniformLocation(this.shaderProgram.program, 'spotLight[' + spotlight_i + '].direction');
                gl.uniform3fv(direction_loc, ls.direction);

                let cutOff_loc = gl.getUniformLocation(this.shaderProgram.program, 'spotLight[' + spotlight_i + '].cutOff');
                gl.uniform1f(cutOff_loc, ls.cutOff);

                let outerCutOff_loc = gl.getUniformLocation(this.shaderProgram.program, 'spotLight[' + spotlight_i + '].outerCutOff');
                gl.uniform1f(outerCutOff_loc, ls.outerCutOff);

                spotlight_i += 1;
            }
        }
    }

    public render() {

        this.shaderProgram.use();

        this.setupLight();
        for (let obj of this.scene.objects) {
            obj.mesh.enableBuffers(this.gl, {
                normal: this.normalAttribLocation,
                uv: this.uvAttribLocation,
                position: this.positionAttribLocation
            });
            obj.mesh.enableTextures(this.gl);
            obj.mesh.enableMaterials(this.shaderProgram);

            this.gl.uniformMatrix4fv(this.matWorldUniformLocation, false, obj.worldMatrix);
            this.gl.uniformMatrix4fv(this.matRotUniformLocation, false, obj.rotMatr);

            this.gl.drawElements(
                this.gl.TRIANGLES,
                obj.mesh.faceIndices.length,
                this.gl.UNSIGNED_SHORT,
                0
            );

            let errcode = this.gl.getError()
            if (errcode != 0) {
                console.error("WEBGL ERROR: " + errcode);
            }
        }
    }
}

