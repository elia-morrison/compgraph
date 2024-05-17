import { vec4 } from "gl-matrix";

class Particle {
    startPosition: vec4;
    speed: vec4;
    size: number;
    color: vec4;
    isAlive: boolean;
    texture: HTMLImageElement;

    constructor(startPosition: vec4, speed: vec4, size: number, color: vec4, texture: HTMLImageElement) {
        this.startPosition = startPosition;
        this.speed = speed;
        this.size = size;
        this.color = color;
        this.isAlive = true;
        this.texture = texture;
    }
}

class ParticleSystem {
    fragShader: WebGLShader;
    vertexShader: WebGLShader;
    gl: WebGL2RenderingContext;
    program: WebGLProgram;
    particlesPositionBuffer: WebGLBuffer;
    particlesColorBuffer: WebGLBuffer;
    particlesVelocityBuffer: WebGLBuffer;
    particlePositions: Float32Array;
    particleColors: Uint8Array;
    particleVelocities: Float32Array;
    particles: Particle[];
    maxParticles: number = 1000000;
    singleParticleVertexBuffer: WebGLBuffer | null;
    deltaTimeUniform: WebGLUniformLocation;

    constructor(gl: WebGL2RenderingContext, fragShader: string, vertexShader: string) {
        this.gl = gl;
        this.vertexShader = this.createShader(gl.VERTEX_SHADER, vertexShader);
        this.fragShader = this.createShader(gl.FRAGMENT_SHADER, fragShader);
        this.program = this.createProgram(this.vertexShader, this.fragShader);
        gl.useProgram(this.program);
        this.setupBuffers();
        this.particles = [];
        this.singleParticleVertexBuffer = null;
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

    public clear() {
        let gl = this.gl;

        gl.clearColor(0, 0, 0, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
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

    public setupBuffers() {
        let gl = this.gl;
        const g_vertex_buffer_data = new Float32Array([
            -0.5, -0.5, 0.0,
            0.5, -0.5, 0.0,
            -0.5, 0.5, 0.0,
            0.5, 0.5, 0.0,
        ]);

        this.singleParticleVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.singleParticleVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, g_vertex_buffer_data, gl.STATIC_DRAW);

        this.particlesPositionBuffer = gl.createBuffer()!;
        this.particlePositions = new Float32Array(this.maxParticles * 4);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.particlesPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.particlePositions, gl.DYNAMIC_COPY);

        this.particlesColorBuffer = gl.createBuffer()!;
        this.particleColors = new Uint8Array(this.maxParticles * 4);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.particlesColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.particleColors, gl.DYNAMIC_COPY);

        this.particlesVelocityBuffer = gl.createBuffer()!;
        this.particleVelocities = new Float32Array(this.maxParticles * 4);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.particlesVelocityBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.particleVelocities, gl.DYNAMIC_COPY);

        this.setupVertexAttribs();
    }

    private setupVertexAttribs() {
        let gl = this.gl;
        gl.enableVertexAttribArray(0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.singleParticleVertexBuffer);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(1);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.particlesPositionBuffer);
        gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(2);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.particlesColorBuffer);
        gl.vertexAttribPointer(2, 4, gl.UNSIGNED_BYTE, true, 0, 0);

        gl.enableVertexAttribArray(3);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.particlesVelocityBuffer);
        gl.vertexAttribPointer(3, 4, gl.FLOAT, false, 0, 0);
    }

    public initParticles() {
        for (let i = 0; i < 100; i++) {
            let startPosition = vec4.fromValues(Math.random(), Math.random(), Math.random(), 1);
            let speed = vec4.fromValues(Math.random() * 0.01 - 0.005, Math.random() * 0.01 - 0.005, 0, 0);
            let size = Math.random() * 10 + 5;
            let color = vec4.fromValues(Math.random(), Math.random(), Math.random(), 1);
            let texture = new Image(); // Assume some texture for all particles
            texture.src = 'path_to_texture.png';
            let particle = new Particle(startPosition, speed, size, color, texture);
            this.particles.push(particle);
        }
    }

    public update(deltaTime: number) {
        let gl = this.gl;
        gl.useProgram(this.program);
        gl.uniform1f(this.deltaTimeUniform, deltaTime);

        // Update data on the GPU
        gl.bindBuffer(gl.ARRAY_BUFFER, this.particlesPositionBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.particlePositions);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.particlesVelocityBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.particleVelocities);

        this.setupInstancing();
    }

    public setupInstancing() {
        let gl = this.gl;
        gl.vertexAttribDivisor(0, 0);
        gl.vertexAttribDivisor(1, 1);
        gl.vertexAttribDivisor(2, 1);
        gl.vertexAttribDivisor(3, 1);

        gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.particles.length);
    }
}


export { Particle, ParticleSystem };
