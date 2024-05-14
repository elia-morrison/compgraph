import { mat4, ReadonlyVec3, vec3 } from "gl-matrix";
import { ObjectGL } from "src/shared/mesh/objectGL";
import { Camera } from "src/shared/scenery/camera";
import { DirectionalLight, PointLight, SpotLight } from "src/shared/scenery/light/lightsource";
import { BaseScene } from "src/shared/base/base-scene";
import { Body3D } from "./body-3d";
import { worldConfig } from "../resources/worldConfig";


export class BaseRenderer {
    textarea = document.getElementById('body');

    gl: WebGL2RenderingContext;
    _vertexShader: WebGLShader;
    _fragShader: WebGLShader;

    program: WebGLProgram;

    _objects: ObjectGL[];

    matWorldUniformLocation: WebGLUniformLocation;
    matRotUniformLocation: WebGLUniformLocation;
    matViewUniformLocation: WebGLUniformLocation;
    matProjUniformLocation: WebGLUniformLocation;

    positionAttribLocation: number;
    normalAttribLocation: number;
    uvAttribLocation: number;

    stop = false;

    constructor(
        gl: WebGL2RenderingContext,
        vSS: string,
        fSS: string,
        public scene: BaseScene,
        public camera: Camera,
    ) {
        this.gl = gl;

        this._vertexShader = this.createShader(gl.VERTEX_SHADER, vSS);
        this._fragShader = this.createShader(gl.FRAGMENT_SHADER, fSS);

        this.program = this.createProgram(this._vertexShader, this._fragShader);

        this.gl.useProgram(this.program);
        this.matWorldUniformLocation = gl.getUniformLocation(this.program, 'mWorld') as WebGLUniformLocation;
        this.matRotUniformLocation = gl.getUniformLocation(this.program, 'rotMatr') as WebGLUniformLocation;
        if (this.matWorldUniformLocation == null) {
            throw Error('wrong world uniform');
        }

        this.setup_view();

        this.positionAttribLocation = gl.getAttribLocation(this.program, 'vertPosition');
        this.normalAttribLocation = gl.getAttribLocation(this.program, 'vertNormal');
        this.uvAttribLocation = gl.getAttribLocation(this.program, 'vertUV');
    }

    createShader(type: number, source: string) {
        let gl = this.gl;
        let shader = gl.createShader(type) as WebGLShader;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }

        let e = gl.getShaderInfoLog(shader) + "";
        gl.deleteShader(shader);
        throw Error(e);
    }

    createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        let gl = this.gl;
        let program = gl.createProgram() as WebGLProgram;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        let success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            gl.validateProgram(program);
            if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
                throw Error('ERROR validating program!' + gl.getProgramInfoLog(program));
            }
            return program;
        } else {
            let e = gl.getProgramInfoLog(program) + "";
            gl.deleteProgram(program);
            throw Error(e);
        }

    }
    public clear() {
        let gl = this.gl;

        this.stop = true;
        gl.clearColor(0, 0, 0, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        //   cancelAnimationFrame();
    }

    public set vertexShaderSource(vss: string) {
        let vsh = this.createShader(this.gl.VERTEX_SHADER, vss);
        this.program = this.createProgram(vsh, this._fragShader);
        this._vertexShader = vsh;
        this.gl.useProgram(this.program);
    }

    public set fragShaderSource(fss: string) {
        let fsh = this.createShader(this.gl.FRAGMENT_SHADER, fss);
        this.program = this.createProgram(this._vertexShader, fsh);
        this._fragShader = fsh;
        this.gl.useProgram(this.program);
    }

    public set objects(objs: ObjectGL[]) {
        this._objects = objs;
    }

    setup_view() {
        let gl = this.gl;
        // let camera_lookingat = vec3.fromValues(0, 0, 0);
        // vec3.add(camera_lookingat, this.camera.position, this.camera.direction);
        // mat4.lookAt(this.camera.viewMatrix, this.camera.position, camera_lookingat, worldConfig.UP);
        this.camera.make_view()
        //this.camera.setPosition([0, 0, 50]);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.frontFace(gl.CCW);
        gl.cullFace(gl.BACK);

        this.matViewUniformLocation = gl.getUniformLocation(this.program, 'mView') as WebGLUniformLocation;
        this.matProjUniformLocation = gl.getUniformLocation(this.program, 'mProj') as WebGLUniformLocation;
        gl.uniformMatrix4fv(this.matViewUniformLocation, false, this.camera.viewMatrix);
        gl.uniformMatrix4fv(this.matProjUniformLocation, false, this.camera.projMatrix);
    }

    setup_basic_buffers(obj: Body3D) {
        let gl = this.gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.mesh.vertexbuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.mesh.indexbuffer);

        gl.vertexAttribPointer(
            this.positionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            false,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        );

        gl.vertexAttribPointer(
            this.normalAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            false,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        gl.vertexAttribPointer(
            this.uvAttribLocation, // Attribute location
            2, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            false,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            6 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        gl.enableVertexAttribArray(this.positionAttribLocation);
        gl.enableVertexAttribArray(this.normalAttribLocation);
        gl.enableVertexAttribArray(this.uvAttribLocation);

        if (obj.mesh.texture1 != null) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, obj.mesh.texture1);
        }

        if (obj.mesh.texture2 != null) {
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, obj.mesh.texture2);
        }
    }

    setup_light() {
        let gl = this.gl;

        let viewpos_loc = gl.getUniformLocation(this.program, 'viewPos');
        gl.uniform3fv(viewpos_loc, this.camera._position);

        // TODO: refactor :(
        let pointlight_i = 0;
        let dirlight_i = 0;
        let spotlight_i = 0;
        for (let ls of this.scene.lightsources) {
            if (ls instanceof PointLight) {
                let color_loc = gl.getUniformLocation(this.program, 'pointLights[' + pointlight_i + '].color');
                gl.uniform3fv(color_loc, ls.color);

                let intensity_loc = gl.getUniformLocation(this.program, 'pointLights[' + spotlight_i + '].intensity');
                gl.uniform1f(intensity_loc, ls.intensity);

                let linear_loc = gl.getUniformLocation(this.program, 'pointLights[' + pointlight_i + '].radius');
                gl.uniform1f(linear_loc, ls.radius);

                let position_loc = gl.getUniformLocation(this.program, 'pointLights[' + pointlight_i + '].position');
                gl.uniform3fv(position_loc, ls._position);

                let falloff_loc = gl.getUniformLocation(this.program, 'pointLights[' + pointlight_i + '].quadratic_falloff');
                gl.uniform1i(falloff_loc, ls.quadraticFalloff ? 1 : 0);

                pointlight_i += 1;
            }
            else if (ls instanceof DirectionalLight) {
                let color_loc = gl.getUniformLocation(this.program, 'dirLights[' + dirlight_i + '].color');
                gl.uniform3fv(color_loc, ls.color);

                let intensity_loc = gl.getUniformLocation(this.program, 'dirLights[' + dirlight_i + '].intensity');
                gl.uniform1f(intensity_loc, ls.intensity);

                let direction_loc = gl.getUniformLocation(this.program, 'dirLights[' + dirlight_i + '].direction');
                gl.uniform3fv(direction_loc, ls.direction);
                dirlight_i += 1;
            }
            else if (ls instanceof SpotLight) {
                let color_loc = gl.getUniformLocation(this.program, 'spotLights[' + spotlight_i + '].color');
                if (color_loc === null) throw new Error('color_loc');
                gl.uniform3fv(color_loc, ls.color);

                let linear_loc = gl.getUniformLocation(this.program, 'spotLights[' + spotlight_i + '].radius');
                if (linear_loc === null) throw new Error('linear_loc');
                gl.uniform1f(linear_loc, ls.radius);

                let intensity_loc = gl.getUniformLocation(this.program, 'spotLights[' + spotlight_i + '].intensity');
                if (intensity_loc === null) throw new Error('intensity_loc');
                gl.uniform1f(intensity_loc, ls.intensity);

                let position_loc = gl.getUniformLocation(this.program, 'spotLights[' + spotlight_i + '].position');
                if (position_loc === null) throw new Error('position_loc');
                gl.uniform3fv(position_loc, ls._position);

                let direction_loc = gl.getUniformLocation(this.program, 'spotLights[' + spotlight_i + '].direction');
                if (direction_loc === null) throw new Error('direction_loc');
                gl.uniform3fv(direction_loc, ls.direction);

                let cutOff_loc = gl.getUniformLocation(this.program, 'spotLights[' + spotlight_i + '].cutOff');
                if (cutOff_loc === null) throw new Error('cutOff_loc');
                gl.uniform1f(cutOff_loc, ls.cutOff);

                let outerCutOff_loc = gl.getUniformLocation(this.program, 'spotLights[' + spotlight_i + '].outerCutOff');
                if (outerCutOff_loc === null) throw new Error('outerCutOff_loc');
                gl.uniform1f(outerCutOff_loc, ls.outerCutOff);

                spotlight_i += 1;
            }
        }
    }

    setup_materials(obj: Body3D) {
        let gl = this.gl;

        let shineness_loc = gl.getUniformLocation(this.program, 'material.shininess');
        gl.uniform1f(shineness_loc, obj.mesh.material.shininess);

        let color_loc = gl.getUniformLocation(this.program, 'material.color');
        gl.uniform3fv(color_loc, obj.mesh.material.color);

        let color_strength_loc = gl.getUniformLocation(this.program, 'material.color_strength');
        gl.uniform1f(color_strength_loc, obj.mesh.material.color_strength);

        let ambient_loc = gl.getUniformLocation(this.program, 'material.ambient');
        gl.uniform1f(ambient_loc, obj.mesh.material.ambient);

        let specular_loc = gl.getUniformLocation(this.program, 'material.specular');
        gl.uniform1f(specular_loc, obj.mesh.material.specular);

        let diffusion_loc = gl.getUniformLocation(this.program, 'material.diffusion');
        gl.uniform1f(diffusion_loc, obj.mesh.material.diffusion);

        let tooniness_loc = gl.getUniformLocation(this.program, 'material.tooniness');
        gl.uniform1f(tooniness_loc, obj.mesh.material.tooniness);

        let rim_strength_loc = gl.getUniformLocation(this.program, 'material.rim_strength');
        gl.uniform1f(rim_strength_loc, obj.mesh.material.rim_strength);

        let rim_color_loc = gl.getUniformLocation(this.program, 'material.rim_color');
        gl.uniform3fv(rim_color_loc, obj.mesh.material.rim_color);

        let diff_map_1_loc = gl.getUniformLocation(this.program, 'material.diff_map_1');
        gl.uniform1i(diff_map_1_loc, 0);

        let diff_map_1_strength_loc = gl.getUniformLocation(this.program, 'material.diff_map_1_strength');
        gl.uniform1f(diff_map_1_strength_loc, obj.mesh.material.diff_map_1_strength);

        let diff_map_2_loc = gl.getUniformLocation(this.program, 'material.diff_map_2');
        gl.uniform1i(diff_map_2_loc, 1);

        let diff_map_2_strength_loc = gl.getUniformLocation(this.program, 'material.diff_map_2_strength');
        gl.uniform1f(diff_map_2_strength_loc, obj.mesh.material.diff_map_2_strength);

        let use_fragment_loc = gl.getUniformLocation(this.program, 'material.use_fragment_shading');
        gl.uniform1i(use_fragment_loc, obj.mesh.material.use_fragment_shading ? 1 : 0);

        let normal_map_loc = gl.getUniformLocation(this.program, 'material.normal_map');
        gl.uniform1i(normal_map_loc, 2);

        let normal_map_strength_loc = gl.getUniformLocation(this.program, 'material.normal_map_strength');
        gl.uniform1f(normal_map_strength_loc, obj.mesh.material.normal_map_strength);

        let bump_map_loc = gl.getUniformLocation(this.program, 'material.bump_map');
        if (bump_map_loc !== null) gl.uniform1i(bump_map_loc, 3);

        let bumpiness_loc = gl.getUniformLocation(this.program, 'material.bumpiness');
        if (bumpiness_loc !== null) gl.uniform1f(bumpiness_loc, obj.mesh.material.bumpiness);

        let normal_bump_mix_loc = gl.getUniformLocation(this.program, 'material.normal_bump_mix');
        if (normal_bump_mix_loc !== null) gl.uniform1f(normal_bump_mix_loc, obj.mesh.material.normal_bump_mix);
    }

    public render(clear = true) {
        let gl = this.gl;

        gl.useProgram(this.program);

        if (clear) {
            this.clear();
        }

        this.setup_view();
        this.setup_light();
        for (let obj of this.scene.objects) {
            if (obj.hidden) continue;

            // let ext = gl.getExtension('OES_element_index_uint');
            // if (!ext) {
            //     console.error("Required extension OES_element_index_uint is not supported");
            // }

            this.setup_materials(obj);
            this.setup_basic_buffers(obj)
            gl.uniformMatrix4fv(this.matWorldUniformLocation, false, obj.worldMatrix);
            gl.uniformMatrix4fv(this.matRotUniformLocation, false, obj.rotMatr);
            gl.drawElements(gl.TRIANGLES, obj.mesh.faceIndices.length, gl.UNSIGNED_INT, 0);

            let errcode = gl.getError()
            if (errcode != 0) {
                console.error("WEBGL ERROR: " + errcode);
            }
        }
    }
}

