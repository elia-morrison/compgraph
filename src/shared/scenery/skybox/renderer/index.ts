import { mat4 } from "gl-matrix";
import { Skybox } from "../index";
import { Camera } from "src/shared/scenery/camera";


export class SkyboxRendererGL {
    textarea = document.getElementById('body');

    _vertexShader: WebGLShader;
    _fragShader: WebGLShader;

    program: WebGLProgram;


    matViewUniformLocation: WebGLUniformLocation;
    matProjUniformLocation: WebGLUniformLocation;

    positionAttribLocation: number;

    constructor(readonly gl: WebGL2RenderingContext, vSS: string, fSS: string, readonly camera: Camera, readonly skybox: Skybox) {
        this._vertexShader = this.createShader(gl.VERTEX_SHADER, vSS);
        this._fragShader = this.createShader(gl.FRAGMENT_SHADER, fSS);
        this.program = this.createProgram(this._vertexShader, this._fragShader);
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

    public render() {
        let gl = this.gl;

        gl.useProgram(this.program);

        const viewNoTranslation = mat4.clone(this.camera.viewMatrix);
        viewNoTranslation[12] = 0;
        viewNoTranslation[13] = 0;
        viewNoTranslation[14] = 0;

        this.matViewUniformLocation = this.gl.getUniformLocation(this.program, 'mView') as WebGLUniformLocation;
        this.gl.uniformMatrix4fv(this.matViewUniformLocation, false, viewNoTranslation);

        this.matProjUniformLocation = this.gl.getUniformLocation(this.program, 'mProj') as WebGLUniformLocation;
        this.gl.uniformMatrix4fv(this.matProjUniformLocation, false, this.camera.projMatrix);

        this.positionAttribLocation = gl.getAttribLocation(this.program, 'vertPosition');
        this.skybox.enableBuffers(this.gl, this.positionAttribLocation);
        this.skybox.enableTexture(this.gl);

        gl.depthFunc(gl.LEQUAL);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
        gl.depthFunc(gl.LESS); // set depth function back to default

        let errcode = gl.getError()
        if (errcode != 0) {
            console.error("WEBGL ERROR: " + errcode);
        }
    }
}

