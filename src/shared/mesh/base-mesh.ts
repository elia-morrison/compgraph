import { ReadonlyVec3 } from "gl-matrix";
import { createTexture } from "src/shared/resource-loaders/texture-loader";
import { Material } from "src/shared/mesh/material";
import { BaseShaderProgram } from "src/shared/webgl/base-shader-program";

export class BaseMesh {
    vertices: ReadonlyVec3[];
    flat_vertices: Float32Array;
    faceIndices: Uint16Array;

    public vertexbuffer: WebGLBuffer;
    public indexbuffer: WebGLBuffer;

    public texture1: WebGLTexture;
    public texture2: WebGLTexture;
    public normal_map: WebGLTexture;
    public bump_map: WebGLTexture;

    public material: Material = new Material();

    public fromObj() {
        //TODO заполнить соответствующие поля объекта используюя вызов import_obj
    }

    #setupVBO(gl: WebGL2RenderingContext, vertices: Float32Array) {
        const vertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        return vertexBufferObject;
    }

    #setupEBO(gl: WebGL2RenderingContext, indices: Uint16Array) {
        const indexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        return indexBufferObject;
    }

    public setupBuffers(gl: WebGL2RenderingContext) {
        this.vertexbuffer = this.#setupVBO(gl, this.flat_vertices) as WebGLBuffer;
        this.indexbuffer = this.#setupEBO(gl, this.faceIndices) as WebGLBuffer;
    }

    public setupTextures(gl: WebGL2RenderingContext) {
        if (this.material.diff_map_1) {
            this.texture1 = createTexture(gl, this.material.diff_map_1, 0);
        }
        if (this.material.diff_map_2) {
            this.texture2 = createTexture(gl, this.material.diff_map_2, 1);
        }
        if (this.material.normal_map) {
            this.normal_map = createTexture(gl, this.material.normal_map, 2);
        }
        if (this.material.bump_map) {
            this.bump_map = createTexture(gl, this.material.bump_map, 3, true);
        }
    }

    public enableTextures(gl: WebGL2RenderingContext) {
        if (this.texture1) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture1);
        }

        if (this.texture2) {
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, this.texture2);
        }
    }

    public enableBuffers(
        gl: WebGL2RenderingContext,
        attribLocations: { position, normal, uv }
    ) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexbuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexbuffer);

        gl.vertexAttribPointer(
            attribLocations.position, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            false,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        );
        gl.enableVertexAttribArray(attribLocations.position);

        gl.vertexAttribPointer(
            attribLocations.normal, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            false,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );
        gl.enableVertexAttribArray(attribLocations.normal);

        gl.vertexAttribPointer(
            attribLocations.uv, // Attribute location
            2, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            false,
            8 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            6 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );
        gl.enableVertexAttribArray(attribLocations.uv);
    }

    public enableMaterials(program: BaseShaderProgram) {

        program.setFloat('material.shininess', this.material.shininess);

        program.setVec3('material.color', this.material.color);

        program.setFloat('material.color_strength', this.material.color_strength);

        program.setFloat('material.ambient', this.material.ambient);

        program.setFloat('material.specular', this.material.specular);

        program.setFloat('material.diffusion', this.material.diffusion);

        program.setFloat('material.tooniness', this.material.tooniness);

        program.setFloat('material.rim_strength', this.material.rim_strength);

        program.setVec3('material.rim_color', this.material.rim_color);

        program.setInteger('material.diff_map_1', 0);

        program.setFloat('material.diff_map_1_strength', this.material.diff_map_1_strength);

        program.setInteger('material.diff_map_2', 1);

        program.setFloat('material.diff_map_2_strength', this.material.diff_map_2_strength);

        program.setInteger('material.use_fragment_shading', this.material.use_fragment_shading ? 1 : 0);

        if (this.normal_map) {
            program.setInteger('material.normal_map', 2);
            program.setFloat('material.normal_map_strength', this.material.normal_map_strength);
        }

        if (this.material.bump_map) {
            program.setInteger('material.bump_map', 3);
        }

        program.setFloat('material.bumpiness', this.material.bumpiness);
        program.setFloat('material.normal_bump_mix', this.material.normal_bump_mix);
    }
}
