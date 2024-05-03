import { BufferAttribute, Mesh } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { ObjectGL } from "../mesh/objectGL";
import { BaseMesh } from "src/shared/base/base-mesh";


export class MeshLoader {
    loader: OBJLoader = new OBJLoader()

    public load(file: string): BaseMesh {
        let obj = this.loader.parse(file);

        let geometries = [];
        console.log(obj);
        for (let child of obj.children) {
            if (!(child instanceof Mesh)) continue;

            geometries.push(child.geometry)
        }
        console.log(geometries.length)
        let merged_geom = BufferGeometryUtils.mergeGeometries(geometries);
        merged_geom = BufferGeometryUtils.mergeVertices(merged_geom);

        let vertexbuffer = [];
        let num_faces = merged_geom.attributes["position"].count;
        for (let j = 0; j < num_faces; j++) {
            vertexbuffer.push(merged_geom.attributes["position"].array[3 * j]);
            vertexbuffer.push(merged_geom.attributes["position"].array[3 * j + 1]);
            vertexbuffer.push(merged_geom.attributes["position"].array[3 * j + 2]);

            vertexbuffer.push(merged_geom.attributes["normal"].array[3 * j]);
            vertexbuffer.push(merged_geom.attributes["normal"].array[3 * j + 1]);
            vertexbuffer.push(merged_geom.attributes["normal"].array[3 * j + 2]);

            if (merged_geom.attributes["uv"] == null) {
                vertexbuffer.push(0);
                vertexbuffer.push(1);
            }
            else {
                vertexbuffer.push(merged_geom.attributes["uv"].array[2 * j]);
                vertexbuffer.push(1 - merged_geom.attributes["uv"].array[2 * j + 1]);
            }

        }


        let result = new BaseMesh();

        result.flat_vertices = vertexbuffer;

        let indexbuffer = []

        for (let j = 0; j < (merged_geom.index as BufferAttribute).count; j++) {
            indexbuffer.push(merged_geom.index?.array[j] as number);
        }

        result.faceIndices = indexbuffer;

        return result;
    }
}
