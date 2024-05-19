import { Camera } from "src/shared/scenery/camera";
import { ParticleSystem } from "./particle-system";

class ShaderInfo {
    source: string
    type: number
}

class AttribInfo {
    constructor(
        public location: number,
        public num_components: number,
        public type: number,
        public divisor: null | number = null) {

    }
}

class BufferInfo {
    constructor(
        public buffer_object: WebGLBuffer,
        public stride: number,
        public attribs: { [key: string]: AttribInfo }) {
    }
}

class VAOInfo {
    constructor(
        public vao: WebGLVertexArrayObject,
        public buffers: BufferInfo[]) {

    }
}

class GLManager {
    gl: WebGL2RenderingContext
    camera: Camera
    particleRenderProgram: WebGLProgram
    particleUpdateProgam: WebGLProgram
    pS: ParticleSystem

    bornParticles: number;
    prevTimestamp: number;
    totalTime: number;
    noiseTexture: WebGLTexture;
    read: number;
    write: number;
    pSVaos: any;
    pSBuffers: any;
    particleTexture: WebGLTexture;

    constructor(gl: WebGL2RenderingContext, camera: Camera) {
        this.gl = gl;
        this.camera = camera
    }

    setupView() {
        let gl = this.gl;
        this.camera.make_view();
        gl.depthMask(false);
        gl.enable(gl.DEPTH_TEST);
        // gl.enable(gl.BLEND);
        // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.enable(gl.CULL_FACE);
        gl.frontFace(gl.CCW);
        gl.cullFace(gl.BACK);

        let matViewUniformLocation = gl.getUniformLocation(this.particleRenderProgram, 'mView') as WebGLUniformLocation;
        let matProjUniformLocation = gl.getUniformLocation(this.particleRenderProgram, 'mProj') as WebGLUniformLocation;
        gl.uniformMatrix4fv(matViewUniformLocation, false, this.camera.viewMatrix);
        gl.uniformMatrix4fv(matProjUniformLocation, false, this.camera.projMatrix);
    }

    setupUniforms() {
        let gl = this.gl
        let matWorldUniformLocation = gl.getUniformLocation(this.particleRenderProgram, 'mWorld') as WebGLUniformLocation;
        let matRotUniformLocation = gl.getUniformLocation(this.particleRenderProgram, 'rotMatr') as WebGLUniformLocation;
        gl.uniformMatrix4fv(matWorldUniformLocation, false, this.pS.worldMatrix);
        gl.uniformMatrix4fv(matRotUniformLocation, false, this.pS.rotMatr);
    }

    createShader(shaderInfo: ShaderInfo) {
        const gl = this.gl
        let shader = gl.createShader(shaderInfo.type)!;
        let i = 0;
        let shader_source = shaderInfo.source;
        gl.shaderSource(shader, shader_source);
        gl.compileShader(shader);
        let compile_status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compile_status) {
            let error_message = gl.getShaderInfoLog(shader);
            throw "Could not compile shader \"" +
            shaderInfo.source +
            "\" \n" +
            error_message;
        }
        return shader;
    }

    randomRGData(size_x: number, size_y: number) {
        var d = [];
        for (var i = 0; i < size_x * size_y; ++i) {
            d.push(Math.random() * 255.0);
            d.push(Math.random() * 255.0);
        }
        return new Uint8Array(d);
    }

    createGLProgram(shaderList: ShaderInfo[], transform_feedback_varyings: null | string[]) {
        let gl = this.gl;
        let program = gl.createProgram()!;
        for (let i = 0; i < shaderList.length; i++) {
            let shader_info = shaderList[i];
            let shader = this.createShader(shader_info);
            gl.attachShader(program, shader);
        }

        /* Specify varyings that we want to be captured in the transform
           feedback buffer. */
        if (transform_feedback_varyings != null) {
            gl.transformFeedbackVaryings(program,
                transform_feedback_varyings,
                gl.INTERLEAVED_ATTRIBS);
        }
        gl.linkProgram(program);
        var link_status = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!link_status) {
            var error_message = gl.getProgramInfoLog(program);
            throw "Could not link program.\n" + error_message;
        }
        return program;
    }

    setupParticleBufferVAO(vaoInfo: VAOInfo) {
        let vao = vaoInfo.vao
        let buffers = vaoInfo.buffers
        let gl = this.gl;
        gl.bindVertexArray(vao);
        for (var i = 0; i < buffers.length; i++) {
            var buffer = buffers[i];
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer_object);
            var offset = 0;
            for (var attrib_name in buffer.attribs) {
                if (buffer.attribs.hasOwnProperty(attrib_name)) {
                    var attrib_desc = buffer.attribs[attrib_name];
                    gl.enableVertexAttribArray(attrib_desc.location);
                    gl.vertexAttribPointer(
                        attrib_desc.location,
                        attrib_desc.num_components,
                        attrib_desc.type,
                        false,
                        buffer.stride,
                        offset);
                    var type_size = 4; /* we're only dealing with types of 4 byte size in this demo, unhardcode if necessary */
                    offset += attrib_desc.num_components * type_size;
                    if (attrib_desc.hasOwnProperty("divisor")) {
                        gl.vertexAttribDivisor(attrib_desc.location, attrib_desc.divisor!);
                    }
                }
            }
        }
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    init(pS: ParticleSystem) {
        let gl = this.gl
        this.pS = pS;
        this.bornParticles = 0;
        this.totalTime = 0;
        this.read = 0;
        this.write = 1;
        this.prevTimestamp = 0;
        if (pS.maxAge < pS.minAge) {
            throw "Invalid min-max age range.";
        }
        if (pS.maxTheta < pS.minTheta ||
            pS.minTheta < -Math.PI ||
            pS.maxTheta > Math.PI) {
            throw "Invalid theta range.";
        }
        if (pS.minSpeed > pS.maxSpeed) {
            throw "Invalid min-max speed range.";
        }
        this.particleUpdateProgam = this.createGLProgram(
            [
                { source: pS.particleUpdateVert, type: gl.VERTEX_SHADER },
                { source: pS.passthruFrag, type: gl.FRAGMENT_SHADER },
            ],
            [
                "v_Position",
                "v_Age",
                "v_Life",
                "v_Velocity",
            ]);
        this.particleRenderProgram = this.createGLProgram(
            [
                { source: pS.particleRenderVert, type: gl.VERTEX_SHADER },
                { source: pS.particleRenderFrag, type: gl.FRAGMENT_SHADER },
            ],
            null);
        var update_attrib_locations = {
            i_Position: {
                location: gl.getAttribLocation(this.particleUpdateProgam, "i_Position"),
                num_components: 3,
                type: gl.FLOAT
            },
            i_Age: {
                location: gl.getAttribLocation(this.particleUpdateProgam, "i_Age"),
                num_components: 1,
                type: gl.FLOAT
            },
            i_Life: {
                location: gl.getAttribLocation(this.particleUpdateProgam, "i_Life"),
                num_components: 1,
                type: gl.FLOAT
            },
            i_Velocity: {
                location: gl.getAttribLocation(this.particleUpdateProgam, "i_Velocity"),
                num_components: 3,
                type: gl.FLOAT
            }
        };
        var render_attrib_locations = {
            i_Position: {
                location: gl.getAttribLocation(this.particleRenderProgram, "i_Position"),
                num_components: 3,
                type: gl.FLOAT,
                divisor: 1
            },
            i_Age: {
                location: gl.getAttribLocation(this.particleRenderProgram, "i_Age"),
                num_components: 1,
                type: gl.FLOAT,
                divisor: 1
            },
            i_Life: {
                location: gl.getAttribLocation(this.particleRenderProgram, "i_Life"),
                num_components: 1,
                type: gl.FLOAT,
                divisor: 1
            }
        };
        this.pSVaos = [
            gl.createVertexArray(),
            gl.createVertexArray(),
            gl.createVertexArray(),
            gl.createVertexArray()
        ];
        this.pSBuffers = [
            gl.createBuffer(),
            gl.createBuffer(),
        ];
        var sprite_vert_data =
            new Float32Array([
                1, 1, 0,
                1, 1,

                -1, 1, 0,
                0, 1,

                -1, -1, 0,
                0, 0,

                1, 1, 0,
                1, 1,

                -1, -1, 0,
                0, 0,

                1, -1, 0,
                1, 0]);
        var sprite_attrib_locations: AttribInfo = {
            i_Coord: {
                location: gl.getAttribLocation(this.particleRenderProgram, "i_Coord"),
                num_components: 3,
                type: gl.FLOAT,
            },
            i_TexCoord: {
                location: gl.getAttribLocation(this.particleRenderProgram, "i_TexCoord"),
                num_components: 2,
                type: gl.FLOAT
            }
        };
        var sprite_vert_buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sprite_vert_buf);
        gl.bufferData(gl.ARRAY_BUFFER, sprite_vert_data, gl.STATIC_DRAW);
        var vao_desc = [
            new VAOInfo(
                this.pSVaos[0],
                [{
                    buffer_object: this.pSBuffers[0],
                    stride: 4 * 8,
                    attribs: update_attrib_locations
                }]
            ),
            {
                vao: this.pSVaos[1],
                buffers: [{
                    buffer_object: this.pSBuffers[1],
                    stride: 4 * 8,
                    attribs: update_attrib_locations
                }]
            },
            {
                vao: this.pSVaos[2],
                buffers: [{
                    buffer_object: this.pSBuffers[0],
                    stride: 4 * 8,
                    attribs: render_attrib_locations
                },
                {
                    buffer_object: sprite_vert_buf,
                    stride: 4 * 5,
                    attribs: sprite_attrib_locations
                }],
            },
            {
                vao: this.pSVaos[3],
                buffers: [{
                    buffer_object: this.pSBuffers[1],
                    stride: 4 * 8,
                    attribs: render_attrib_locations
                },
                {
                    buffer_object: sprite_vert_buf,
                    stride: 4 * 5,
                    attribs: sprite_attrib_locations
                }],
            },
        ];
        var initial_data =
            new Float32Array(pS.initialParticleData());
        gl.bindBuffer(gl.ARRAY_BUFFER, this.pSBuffers[0]);
        gl.bufferData(gl.ARRAY_BUFFER, initial_data, gl.STREAM_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.pSBuffers[1]);
        gl.bufferData(gl.ARRAY_BUFFER, initial_data, gl.STREAM_DRAW);
        for (var i = 0; i < vao_desc.length; i++) {
            this.setupParticleBufferVAO(vao_desc[i]);
        }

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.noiseTexture = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_2D, this.noiseTexture);
        gl.texImage2D(gl.TEXTURE_2D,
            0,
            gl.RG8,
            512, 512,
            0,
            gl.RG,
            gl.UNSIGNED_BYTE,
            this.randomRGData(512, 512));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

        this.particleTexture = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_2D, this.particleTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 32, 32, 0, gl.RGBA, gl.UNSIGNED_BYTE, pS.particleImage);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    }

    render(timestampMs: number) {
        let gl = this.gl;
        let pS = this.pS;
        var num_part = this.bornParticles;
        var time_delta = 0.0;
        if (this.prevTimestamp != 0) {
            time_delta = timestampMs - this.prevTimestamp;
            if (time_delta > 500.0) {
                time_delta = 0.0;
            }
        }
        pS.update(time_delta);
        if (this.bornParticles < pS.numParticles) {
            this.bornParticles = Math.min(pS.numParticles,
                Math.floor(this.bornParticles + pS.birthRatio * time_delta));
        }
        this.prevTimestamp = timestampMs;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(this.particleUpdateProgam);
        gl.uniform1f(
            gl.getUniformLocation(this.particleUpdateProgam, "u_TimeDelta"),
            time_delta / 1000.0);
        gl.uniform1f(
            gl.getUniformLocation(this.particleUpdateProgam, "u_TotalTime"),
            this.totalTime);
        gl.uniform3f(
            gl.getUniformLocation(this.particleUpdateProgam, "u_Gravity"),
            pS.gravity[0], pS.gravity[1], pS.gravity[2]);
        gl.uniform3f(
            gl.getUniformLocation(this.particleUpdateProgam, "u_Origin"),
            pS.origin[0],
            pS.origin[1],
            pS.origin[2]);
        gl.uniform3f(
            gl.getUniformLocation(this.particleUpdateProgam, "u_MaxVelocity"),
            pS.maxVelocity[0],
            pS.maxVelocity[1],
            pS.maxVelocity[2]);
        gl.uniform1f(
            gl.getUniformLocation(this.particleUpdateProgam, "u_MinTheta"),
            pS.minTheta);
        gl.uniform1f(
            gl.getUniformLocation(this.particleUpdateProgam, "u_MaxTheta"),
            pS.maxTheta);
        gl.uniform1f(
            gl.getUniformLocation(this.particleUpdateProgam, "u_MinSpeed"),
            pS.minSpeed);
        gl.uniform1f(
            gl.getUniformLocation(this.particleUpdateProgam, "u_MaxSpeed"),
            pS.maxSpeed);
        this.totalTime += time_delta;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.noiseTexture);
        gl.uniform1i(
            gl.getUniformLocation(this.particleUpdateProgam, "u_RgNoise"),
            0);
        gl.bindVertexArray(this.pSVaos[this.read]);
        gl.bindBufferBase(
            gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.pSBuffers[this.write]);
        gl.enable(gl.RASTERIZER_DISCARD);
        gl.beginTransformFeedback(gl.POINTS);
        gl.drawArrays(gl.POINTS, 0, num_part);
        gl.endTransformFeedback();
        gl.disable(gl.RASTERIZER_DISCARD);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
        gl.bindVertexArray(this.pSVaos[this.read + 2]);
        gl.useProgram(this.particleRenderProgram);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.particleTexture);
        gl.uniform1i(
            gl.getUniformLocation(this.particleRenderProgram, "u_Sprite"),
            0);
        this.setupView();
        this.setupUniforms();
        gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, num_part);
        var tmp = this.read;
        this.read = this.write;
        this.write = tmp;
    }
}

export { ShaderInfo, GLManager, VAOInfo, BufferInfo, AttribInfo }