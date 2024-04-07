import { ObjectGL } from "./objectGL";

import { glMatrix, mat4, ReadonlyVec3 } from "gl-matrix";
import { Camera } from "./camera";
import { Lightsource } from "./lightsource";

export class Scene {
    public objects: ObjectGL[] = [];
    public lightsources: Lightsource[] = [];
}


export class RendererGL {
    textarea = document.getElementById('body');

    gl: WebGL2RenderingContext;
    _vertexShader: WebGLShader;
    _fragShader: WebGLShader;

    program: WebGLProgram;

    _objects: ObjectGL[];

    scene: Scene;

    matWorldUniformLocation: WebGLUniformLocation;
    matViewUniformLocation: WebGLUniformLocation;
    matProjUniformLocation: WebGLUniformLocation;

    positionAttribLocation: number;
    colorAttribLocation: number;

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
        this.colorAttribLocation = gl.getAttribLocation(this.program, 'vertColor');
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

    setup_view(eye: ReadonlyVec3 = [0, 0, 50]) {
        let gl = this.gl;
        //mat4.lookAt(this.camera.viewMatrix, eye, [0, 0, 0], [0, 1, 0]);
        this.camera.setPosition(eye);
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
            this.colorAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            false,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        gl.enableVertexAttribArray(this.positionAttribLocation);
        gl.enableVertexAttribArray(this.colorAttribLocation);
    }

    setup_meterials(obj: ObjectGL) {
        let gl = this.gl;
        let color_loc = gl.getUniformLocation(this.program, 'materialColor');
        gl.uniform3fv(color_loc, obj.material.color);
    }

    public render() {
        let gl = this.gl;

        gl.clearColor(0.9, 0.9, 0.99, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        for (let obj of this.scene.objects) {
            this.setup_meterials(obj);
            this.setup_basic_buffers(obj);
            gl.uniformMatrix4fv(this.matWorldUniformLocation, false, obj.worldMatrix);
            gl.drawElements(gl.TRIANGLES, obj.faceIndices.length, gl.UNSIGNED_SHORT, 0);

            let errcode = gl.getError()
            if (errcode != 0) {
                console.error("WEBGL ERROR: " + errcode);
            }
        }
    }
}
