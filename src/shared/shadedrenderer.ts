import { ObjectGL } from "./objectGL";

import { glMatrix, mat4, ReadonlyVec3 } from "gl-matrix";
import { Camera } from "./camera";
import { Euler } from "three";
import { DirectionalLight, Lightsource, PointLight, SpotLight } from "./lightsource";

export class Scene {
    public objects: ObjectGL[] = [];
    public lightsources: Lightsource[] = [];
}

export class ShadedRendererGL {
    textarea = document.getElementById('body');

    gl: WebGL2RenderingContext;
    _vertexShader: WebGLShader;
    _fragShader: WebGLShader;

    program: WebGLProgram;

    _objects: ObjectGL[];

    scene: Scene;

    matWorldUniformLocation: WebGLUniformLocation;
    matRotUniformLocation: WebGLUniformLocation;
    matViewUniformLocation: WebGLUniformLocation;
    matProjUniformLocation: WebGLUniformLocation;

    positionAttribLocation: number;
    normalAttribLocation: number;
    uvAttribLocation: number;

    public camera: Camera;

    stop = false;

    constructor(gl: WebGL2RenderingContext, vSS: string, fSS: string, scene: Scene) {
        this.gl = gl;
        this.camera = new Camera(gl);
        this._vertexShader = this.createShader(gl.VERTEX_SHADER, vSS);
        this._fragShader = this.createShader(gl.FRAGMENT_SHADER, fSS);

        this.program = this.createProgram(this._vertexShader, this._fragShader);

        this.gl.useProgram(this.program);
        this.matWorldUniformLocation = gl.getUniformLocation(this.program, 'mWorld') as WebGLUniformLocation;
        this.matRotUniformLocation = gl.getUniformLocation(this.program, 'rotMatr') as WebGLUniformLocation;
        if (this.matWorldUniformLocation == null) {
            throw Error('wrong world uniform');
        }

        this.camera.setPosition([0, 0, -50]);
        this.setup_view();

        for (let obj of scene.objects) {
            obj.setup_buffers(this.gl);
        }

        this.scene = scene;

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
        gl.clearColor(0.9, 0.9, 0.99, 1.0);
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

    setup_view(eye: ReadonlyVec3 = [0, 5, -10]) {
        let gl = this.gl;
        mat4.lookAt(this.camera.viewMatrix, eye, [0, 0, 4], [0, 1, 0]);
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

    setup_basic_buffers(obj: ObjectGL) {
        let gl = this.gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexbuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexbuffer);

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

        if (obj.texture != null)
        {
            gl.bindTexture(gl.TEXTURE_2D, obj.texture);
            gl.activeTexture(gl.TEXTURE0);
        }
    }

    setup_light()
    {
        let gl = this.gl;

        let viewpos_loc = gl.getUniformLocation(this.program, 'viewPos');
        gl.uniform3fv(viewpos_loc, this.camera._position);

        let pointlight_i = 0;
        for (let ls of this.scene.lightsources)
        {
            if (ls instanceof PointLight)
            {
                let color_loc = gl.getUniformLocation(this.program, 'pointLights[' + pointlight_i + '].color');
                gl.uniform3fv(color_loc, ls.color);

                let linear_loc = gl.getUniformLocation(this.program, 'pointLights[' + pointlight_i + '].radius');
                gl.uniform1f(linear_loc, ls.radius);

                let position_loc = gl.getUniformLocation(this.program, 'pointLights[' + pointlight_i + '].position');
                gl.uniform3fv(position_loc, ls._position);


                pointlight_i += 1;
            }
            else if (ls instanceof DirectionalLight)
            {
                let color_loc = gl.getUniformLocation(this.program, 'dirLight.color');
                gl.uniform3fv(color_loc, ls.color);

                let intensity_loc = gl.getUniformLocation(this.program, 'dirLight.intensity');
                gl.uniform1f(intensity_loc, ls.intensity);

                let direction_loc = gl.getUniformLocation(this.program, 'dirLight.direction');
                gl.uniform3fv(direction_loc, ls.direction);
            }
            else if (ls instanceof SpotLight)
            {
                let color_loc = gl.getUniformLocation(this.program, 'spotLight.color');
                gl.uniform3fv(color_loc, ls.color);

                let linear_loc = gl.getUniformLocation(this.program, 'spotLight.radius');
                gl.uniform1f(linear_loc, ls.radius);

                let position_loc = gl.getUniformLocation(this.program, 'spotLight.position');
                gl.uniform3fv(position_loc, ls._position);

                let direction_loc = gl.getUniformLocation(this.program, 'spotLight.direction');
                gl.uniform3fv(direction_loc, ls.direction);

                let cutOff_loc = gl.getUniformLocation(this.program, 'spotLight.cutOff');
                gl.uniform1f(cutOff_loc, ls.cutOff);

                let outerCutOff_loc = gl.getUniformLocation(this.program, 'spotLight.outerCutOff');
                gl.uniform1f(outerCutOff_loc, ls.outerCutOff);
            }
        }
    }

    setup_materials(obj: ObjectGL)
    {
        let gl = this.gl;

        let use_texture_loc = gl.getUniformLocation(this.program, 'material.use_texture');
        gl.uniform1i(use_texture_loc, +(obj.material.diffusion_map != null));

        let shineness_loc = gl.getUniformLocation(this.program, 'material.shininess');
        gl.uniform1f(shineness_loc, obj.material.shininess);

        let color_loc = gl.getUniformLocation(this.program, 'material.color');
        gl.uniform3fv(color_loc, obj.material.color);

        let ambient_loc = gl.getUniformLocation(this.program, 'material.ambient');
        gl.uniform1f(ambient_loc, obj.material.ambient);

        let specular_loc = gl.getUniformLocation(this.program, 'material.specular');
        gl.uniform1f(specular_loc, obj.material.specular);

        let diffusion_loc = gl.getUniformLocation(this.program, 'material.diffusion');
        gl.uniform1f(diffusion_loc, obj.material.diffusion);

        let tooniness_loc = gl.getUniformLocation(this.program, 'material.tooniness');
        gl.uniform1f(tooniness_loc, obj.material.tooniness);

        let rim_strength_loc = gl.getUniformLocation(this.program, 'material.rim_strength');
        gl.uniform1f(rim_strength_loc, obj.material.rim_strength);

        let rim_color_loc = gl.getUniformLocation(this.program, 'material.rim_color');
        gl.uniform3fv(rim_color_loc, obj.material.rim_color);
    }

    public render() {
        let gl = this.gl;

        gl.clearColor(0.9, 0.9, 0.99, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        this.setup_light();
        for (let obj of this.scene.objects) {
            this.setup_materials(obj);
            this.setup_basic_buffers(obj)
            gl.uniformMatrix4fv(this.matWorldUniformLocation, false, obj.worldMatrix);    
            gl.uniformMatrix4fv(this.matRotUniformLocation, false, obj.rotMatr);    
            gl.drawElements(gl.TRIANGLES, obj.faceIndices.length, gl.UNSIGNED_SHORT, 0);
            
            let errcode = gl.getError()
            if (errcode != 0)
            {
                console.error("WEBGL ERROR: " + errcode);
            }
        }
    }
}
