import { ReadonlyVec3, vec3 } from "gl-matrix";
import { Material } from "src/shared/mesh/material";
import { create_texture } from "src/shared/resource-loaders/texture-loader";
import * as CANNON from 'cannon-es'

export class BaseMesh {
    vertices: ReadonlyVec3[];
    flat_vertices: number[];
    faceIndices: number[];

    public material: Material = new Material();

    public vertexbuffer: WebGLBuffer;
    public indexbuffer: WebGLBuffer;

    public texture1: WebGLTexture;
    public texture2: WebGLTexture;
    public normal_map: WebGLTexture;
    public bump_map: WebGLTexture;

    public fromObj() {
        //TODO заполнить соответствующие поля объекта используюя вызов import_obj
    }

    public setup_buffers(gl: WebGL2RenderingContext) {

        var boxVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.flat_vertices), gl.STATIC_DRAW);

        this.vertexbuffer = boxVertexBufferObject as WebGLBuffer;

        var boxIndexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faceIndices), gl.STATIC_DRAW);

        this.indexbuffer = boxIndexBufferObject as WebGLBuffer;

        if (this.material.diff_map_1 != null) {
            this.texture1 = create_texture(gl, this.material.diff_map_1, 0);
        }
        if (this.material.diff_map_2 != null) {
            this.texture2 = create_texture(gl, this.material.diff_map_2, 1);
        }
        if (this.material.normal_map != null) {
            this.normal_map = create_texture(gl, this.material.normal_map, 2);
        }
        if (this.material.bump_map != null) {
            this.bump_map = create_texture(gl, this.material.bump_map, 3, true);
        }
    }

    public calculateBoundingBox(scale: ReadonlyVec3, kinematic: boolean): CANNON.Body {
        let minX = Infinity;
        let minY = Infinity;
        let minZ = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        let maxZ = -Infinity;

        for (let i = 0; i < this.flat_vertices.length; i += 8) {
            const x = this.flat_vertices[i] * scale[0];
            const y = this.flat_vertices[i + 1] * scale[1];
            const z = this.flat_vertices[i + 2] * scale[2];

            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
            minZ = Math.min(minZ, z);
            maxZ = Math.max(maxZ, z);
        }

        const width = maxX - minX;
        const height = maxY - minY;
        const depth = maxZ - minZ;

        const originX = minX + width / 2;
        const originY = minY + height / 2;
        const originZ = minZ + depth / 2;

        const halfExtents = new CANNON.Vec3(width / 2, height / 2, depth / 2);
        const boundingBox = new CANNON.Box(halfExtents);

        let boundingBoxBody = new CANNON.Body({
            mass: kinematic ? 1 : 0,
            shape: boundingBox
        });
        boundingBoxBody.angularFactor = new CANNON.Vec3(0, 0, 0);
        boundingBoxBody.angularDamping = 1.;
        boundingBoxBody.linearDamping = 0.9;
        boundingBoxBody.position.x = originX;
        boundingBoxBody.position.y = originY;
        boundingBoxBody.position.z = originZ;

        return boundingBoxBody;
    }
}
