class BaseShaderProgram {
    #program: WebGLProgram | null = null;
    #vertexShader:  WebGLShader | null = null;
    #fragmentShader:  WebGLShader | null = null;
    #matWorldUniformLocation: WebGLUniformLocation | null = null;
    #matViewUniformLocation: WebGLUniformLocation | null = null;
    #matProjUniformLocation: WebGLUniformLocation | null = null;

    constructor(
        private readonly vertexShaderSource: string,
        private readonly fragmentShaderSource: string,
        readonly glContext: WebGL2RenderingContext,
    ) {
        this.#initShaders();
        this.#compileShaders();
        this.#createProgram();
    }

    #initShaders = ( ) => {
        this.#vertexShader = this.glContext.createShader(this.glContext.VERTEX_SHADER);
        this.#fragmentShader = this.glContext.createShader(this.glContext.FRAGMENT_SHADER);
    };

    #compileShaders = () => {
        if (!this.#vertexShader) {
            throw new Error('Vertex shader not found')
        }
        if (!this.#fragmentShader) {
            throw new Error('Fragment shader not found')
        }

        this.glContext.shaderSource(this.#vertexShader, this.vertexShaderSource);
        this.glContext.shaderSource(this.#fragmentShader, this.fragmentShaderSource);

        this.glContext.compileShader(this.#vertexShader);
        if (!this.glContext.getShaderParameter(this.#vertexShader, this.glContext.COMPILE_STATUS)) {
            console.error(
                'ERROR compiling vertex shader!',
                this.glContext.getShaderInfoLog(this.#vertexShader)
            );
            return;
        }
        this.glContext.compileShader(this.#fragmentShader);
        if (!this.glContext.getShaderParameter(this.#fragmentShader, this.glContext.COMPILE_STATUS)) {
            console.error(
                'ERROR compiling fragment shader!',
                this.glContext.getShaderInfoLog(this.#fragmentShader)
            );
            return;
        }
    }

    #createProgram = () => {
        if (!this.#vertexShader) {
            throw new Error('Vertex shader not found')
        }
        if (!this.#fragmentShader) {
            throw new Error('Fragment shader not found')
        }
        this.#program = this.glContext.createProgram() as WebGLProgram;
        if (!this.#program) {
            throw new Error('Error creating gl program')
        }
        this.glContext.attachShader(this.#program, this.#vertexShader);
        this.glContext.attachShader(this.#program, this.#fragmentShader);
        this.glContext.linkProgram(this.#program);
        if (!this.glContext.getProgramParameter(this.#program, this.glContext.LINK_STATUS)) {
            console.error('ERROR linking program!', this.glContext.getProgramInfoLog(this.#program));
            return;
        }
        this.glContext.validateProgram(this.#program);
        if (!this.glContext.getProgramParameter(this.#program, this.glContext.VALIDATE_STATUS)) {
            console.error('ERROR validating program!', this.glContext.getProgramInfoLog(this.#program));
            return;
        }
    }

    #getUniformLocation = (name: string) => {
        if (!this.#program) throw new Error('Shader program not defined');
        const location = this.glContext.getUniformLocation(this.#program, name);
        if (location === -1) throw new Error(`Uniform '${name}' not defined`);
        return location;
    }

    setMat4 = (name: string, val: Float32Array) => {
        const location = this.#getUniformLocation(name);
        this.glContext.uniformMatrix4fv(location, false, val);
    }

    setInteger = (name: string, val: number) => {
        const location = this.#getUniformLocation(name);
        this.glContext.uniform1i(location, val);
    }

    setFloat = (name: string, val: number) => {
        const location = this.#getUniformLocation(name);
        this.glContext.uniform1f(location, val);
    }

    setVec2 = (name: string, val: Float32List) => {
        const location = this.#getUniformLocation(name);
        this.glContext.uniform2fv(location, val);
    }

    setVec3 = (name: string, val: Float32List) => {
        const location = this.#getUniformLocation(name);
        this.glContext.uniform3fv(location, val);
    }

    setVec4 = (name: string, val: Float32List) => {
        const location = this.#getUniformLocation(name);
        this.glContext.uniform4fv(location, val);
    }

    setWorldMat = (val: Float32Array, name = 'mWorld') => {
        const location = this.#getUniformLocation(name);
        this.glContext.uniformMatrix4fv(this.#matWorldUniformLocation, false, val);
    }

    setViewMat = (val: Float32Array, name = 'mView') => {
        const location = this.#getUniformLocation(name);
        this.glContext.uniformMatrix4fv(this.#matViewUniformLocation, false, val);
    }

    setProjMat = (val: Float32Array, name = 'mProj') => {
        const location = this.#getUniformLocation(name);
        this.glContext.uniformMatrix4fv(this.#matProjUniformLocation, false, val);
    }

    get program() {
        return this.#program;
    }

    use = ()=> {
        this.glContext.useProgram(this.#program);
    }
}

export {
    BaseShaderProgram
}