class ShaderInfo {
    source: string
    type: number
}

class GLManager {
    gl: WebGL2RenderingContext

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
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
}

export { ShaderInfo, GLManager }