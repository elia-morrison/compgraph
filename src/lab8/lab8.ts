import { resizeCanvas } from "../shared/ui/ui";
// import { ParticleSystem } from "./particle-system";
import particleRenderFrag from "./shaders/particle-render.frag";
import particleRenderVert from "./shaders/particle-render.vert";
import particleUpdateVert from "./shaders/particle-update.vert";
import passthruFrag from "./shaders/passthru.frag";
import { GLManager, ShaderInfo } from "./gl-manager";

// import { Timer } from "../shared/runtime/timer";

let canvas_element = document.querySelector("#main_canvas") as HTMLCanvasElement;
resizeCanvas(canvas_element);
window.addEventListener('resize', function (event) { resizeCanvas(canvas_element); }, true);
let webgl_context = canvas_element.getContext("webgl2") as WebGL2RenderingContext;
// let particleSystem = new ParticleSystem(gl, fireFragShader, fireVertShader);

// const timer = new Timer();
// timer.reset();

// const update = () => {
//     timer.update();

//     particleSystem.update(timer.timeDelta);
//     requestAnimationFrame(update);
// }

// update();

var particle_tex = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QYTCCY1R1556QAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAC4ElEQVRYw8VXa4/aMBAcB0OgB0ff///vVWpV0UAOcBz3w832hr0EyLVSLa0S7mLPePbhdcAbRykl2HsIobx1nTARMIzMVQJlCqEwATgAmMmcSj7rhUjm8y4iYQLwjKDxCoGO7/leIuEKeCXAkTZzZiM762j2ux8jEW+Az2kRwIIWxSA7NzvTZgCSrDtIIt4Ar/lcAVjSjNBcpiaCJwBH2pNz0yCJOOASBV/yueb7O5qpYcN23YpqAcDJC+wy5oXAwO4XBH0AsAGwJZG1/M/GkQT2tJ1sqFcrpVwEpSpQSZSb7Ab+HsAHIbKhMjZOABr+bTFQI7LLjHxBQFLO734l4F8APPK5ohI29iRWO2U0MC07+mcRnlWIIpWmXS0+3xB4C+ArgM/iCiWw5xrm+44xkfjbMiPTHYMEouT9gi5YO/BPVMRSsuM3P51LLCae3LqdumgsC6LLhC3VeATwkU9LSUu9wPeW3zeSxtGV8ZcsEP9X4oYosVC7gKxJ5kEIVNz1hsArCUglYBjB4iCOlGe1SpSpJM9tdxXlnssGdJ7a7VJ8x7Ag6giiB9DkEUMIpZRSXMHIUlq1yrUMOPW5xUCSb2xOkkNJ1y8+Df0OFdyKzJZRXYvPo+T5TqK+kUxQEqMusBrdOQItgAMXX4p/E4MwcN6BoD8AfOf3B6kDuu7FeaAEtJE40Vou7Gv/nhFvo6EbvhG8obWyVvZF6A8BxoH5J3GnR/5/5ypcIvjOHUYNi5E9d3THUVzR++YkurbKy++7prP425+GRmJPAr/43g4E4+s0pAomU5KioQfLgTbWD+wlE8wtploGkG81JBaIcOc5JNq16dCOyLLGuqFWsihJAI4XIlEBzjW9LB6lvKo6BnISRS7S8GZPOEJCY+N8R1fciSL5Gvg99wJ/QFUi/dC9IEmZzkNR/5abUTVwII0R6KXt6kMI/T+5G7pbUrhyNyxTrmWTLqcDt+JXBP7mlvzfxm8amZhMH7WSmQAAAABJRU5ErkJggg==`;

let glManager = new GLManager(webgl_context);

function randomRGData(size_x, size_y) {
    var d = [];
    for (var i = 0; i < size_x * size_y; ++i) {
        d.push(Math.random() * 255.0);
        d.push(Math.random() * 255.0);
    }
    return new Uint8Array(d);
}

function initialParticleData(num_parts, min_age, max_age) {
    var data = [];
    for (var i = 0; i < num_parts; ++i) {
        data.push(0.0);
        data.push(0.0);
        data.push(0.0);
        var life = min_age + Math.random() * (max_age - min_age);
        data.push(life + 1);
        data.push(life);
        data.push(0.0);
        data.push(0.0);
        data.push(0.0);
    }
    return data;
}

function setupParticleBufferVAO(gl, buffers, vao) {
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
                    gl.vertexAttribDivisor(attrib_desc.location, attrib_desc.divisor);
                }
            }
        }
    }
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

function init(
    gl,
    num_particles,
    particle_birth_rate,
    min_age,
    max_age,
    min_theta,
    max_theta,
    min_speed,
    max_speed,
    gravity,
    part_img) { // Note the new parameter.
    if (max_age < min_age) {
        throw "Invalid min-max age range.";
    }
    if (max_theta < min_theta ||
        min_theta < -Math.PI ||
        max_theta > Math.PI) {
        throw "Invalid theta range.";
    }
    if (min_speed > max_speed) {
        throw "Invalid min-max speed range.";
    }
    var update_program = glManager.createGLProgram(
        [
            { source: particleUpdateVert, type: gl.VERTEX_SHADER },
            { source: passthruFrag, type: gl.FRAGMENT_SHADER },
        ],
        [
            "v_Position",
            "v_Age",
            "v_Life",
            "v_Velocity",
        ]);
    var render_program = glManager.createGLProgram(
        [
            { source: particleRenderVert, type: gl.VERTEX_SHADER },
            { source: particleRenderFrag, type: gl.FRAGMENT_SHADER },
        ],
        null);
    var update_attrib_locations = {
        i_Position: {
            location: gl.getAttribLocation(update_program, "i_Position"),
            num_components: 3,
            type: gl.FLOAT
        },
        i_Age: {
            location: gl.getAttribLocation(update_program, "i_Age"),
            num_components: 1,
            type: gl.FLOAT
        },
        i_Life: {
            location: gl.getAttribLocation(update_program, "i_Life"),
            num_components: 1,
            type: gl.FLOAT
        },
        i_Velocity: {
            location: gl.getAttribLocation(update_program, "i_Velocity"),
            num_components: 3,
            type: gl.FLOAT
        }
    };
    var render_attrib_locations = {
        i_Position: {
            location: gl.getAttribLocation(render_program, "i_Position"),
            num_components: 3,
            type: gl.FLOAT,
            divisor: 1
        },
        i_Age: {
            location: gl.getAttribLocation(render_program, "i_Age"),
            num_components: 1,
            type: gl.FLOAT,
            divisor: 1
        },
        i_Life: {
            location: gl.getAttribLocation(render_program, "i_Life"),
            num_components: 1,
            type: gl.FLOAT,
            divisor: 1
        }
    };
    var vaos = [
        gl.createVertexArray(),
        gl.createVertexArray(),
        gl.createVertexArray(),
        gl.createVertexArray()
    ];
    var buffers = [
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
    var sprite_attrib_locations = {
        i_Coord: {
            location: gl.getAttribLocation(render_program, "i_Coord"),
            num_components: 3,
            type: gl.FLOAT,
        },
        i_TexCoord: {
            location: gl.getAttribLocation(render_program, "i_TexCoord"),
            num_components: 2,
            type: gl.FLOAT
        }
    };
    var sprite_vert_buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sprite_vert_buf);
    gl.bufferData(gl.ARRAY_BUFFER, sprite_vert_data, gl.STATIC_DRAW);
    var vao_desc = [
        {
            vao: vaos[0],
            buffers: [{
                buffer_object: buffers[0],
                stride: 4 * 8,
                attribs: update_attrib_locations
            }]
        },
        {
            vao: vaos[1],
            buffers: [{
                buffer_object: buffers[1],
                stride: 4 * 8,
                attribs: update_attrib_locations
            }]
        },
        {
            vao: vaos[2],
            buffers: [{
                buffer_object: buffers[0],
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
            vao: vaos[3],
            buffers: [{
                buffer_object: buffers[1],
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
        new Float32Array(initialParticleData(num_particles, min_age, max_age));
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers[0]);
    gl.bufferData(gl.ARRAY_BUFFER, initial_data, gl.STREAM_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers[1]);
    gl.bufferData(gl.ARRAY_BUFFER, initial_data, gl.STREAM_DRAW);
    for (var i = 0; i < vao_desc.length; i++) {
        setupParticleBufferVAO(gl, vao_desc[i].buffers, vao_desc[i].vao);
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    var rg_noise_texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, rg_noise_texture);
    gl.texImage2D(gl.TEXTURE_2D,
        0,
        gl.RG8,
        512, 512,
        0,
        gl.RG,
        gl.UNSIGNED_BYTE,
        randomRGData(512, 512));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    var particle_tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, particle_tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 32, 32, 0, gl.RGBA, gl.UNSIGNED_BYTE, part_img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return {
        particle_sys_buffers: buffers,
        particle_sys_vaos: vaos,
        read: 0,
        write: 1,
        particle_update_program: update_program,
        particle_render_program: render_program,
        num_particles: initial_data.length / 8,
        old_timestamp: 0.0,
        rg_noise: rg_noise_texture,
        total_time: 0.0,
        born_particles: 0,
        birth_rate: particle_birth_rate,
        gravity: gravity,
        origin: [0.0, 0.0, 0.0],
        min_theta: min_theta,
        max_theta: max_theta,
        min_speed: min_speed,
        max_speed: max_speed,
        particle_tex: particle_tex
    };
}

function render(gl, state, timestamp_millis) {
    var num_part = state.born_particles;
    var time_delta = 0.0;
    if (state.old_timestamp != 0) {
        time_delta = timestamp_millis - state.old_timestamp;
        if (time_delta > 500.0) {
            time_delta = 0.0;
        }
    }
    if (state.born_particles < state.num_particles) {
        state.born_particles = Math.min(state.num_particles,
            Math.floor(state.born_particles + state.birth_rate * time_delta));
    }
    state.old_timestamp = timestamp_millis;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(state.particle_update_program);
    gl.uniform1f(
        gl.getUniformLocation(state.particle_update_program, "u_TimeDelta"),
        time_delta / 1000.0);
    gl.uniform1f(
        gl.getUniformLocation(state.particle_update_program, "u_TotalTime"),
        state.total_time);
    gl.uniform3f(
        gl.getUniformLocation(state.particle_update_program, "u_Gravity"),
        state.gravity[0], state.gravity[1], state.gravity[2]);
    gl.uniform3f(
        gl.getUniformLocation(state.particle_update_program, "u_Origin"),
        state.origin[0],
        state.origin[1],
        state.origin[2]);
    gl.uniform1f(
        gl.getUniformLocation(state.particle_update_program, "u_MinTheta"),
        state.min_theta);
    gl.uniform1f(
        gl.getUniformLocation(state.particle_update_program, "u_MaxTheta"),
        state.max_theta);
    gl.uniform1f(
        gl.getUniformLocation(state.particle_update_program, "u_MinSpeed"),
        state.min_speed);
    gl.uniform1f(
        gl.getUniformLocation(state.particle_update_program, "u_MaxSpeed"),
        state.max_speed);
    state.total_time += time_delta;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, state.rg_noise);
    gl.uniform1i(
        gl.getUniformLocation(state.particle_update_program, "u_RgNoise"),
        0);
    gl.bindVertexArray(state.particle_sys_vaos[state.read]);
    gl.bindBufferBase(
        gl.TRANSFORM_FEEDBACK_BUFFER, 0, state.particle_sys_buffers[state.write]);
    gl.enable(gl.RASTERIZER_DISCARD);
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, num_part);
    gl.endTransformFeedback();
    gl.disable(gl.RASTERIZER_DISCARD);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
    gl.bindVertexArray(state.particle_sys_vaos[state.read + 2]);
    gl.useProgram(state.particle_render_program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, state.particle_tex);
    gl.uniform1i(
        gl.getUniformLocation(state.particle_render_program, "u_Sprite"),
        0);
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, num_part);
    var tmp = state.read;
    state.read = state.write;
    state.write = tmp;
    window.requestAnimationFrame(function (ts) { render(gl, state, ts); });
}

var part_img = new Image();
part_img.src = particle_tex;
part_img.onload = function () {
    var state =
        init(
            webgl_context,
            800,
            0.5,
            0.8, 0.9,
            -Math.PI, Math.PI,
            0.1, 0.5,
            [0.0, 5.0, 0.0],
            part_img);
    // canvas_element.onmousemove = function (e) {
    //     var x = 2.0 * (e.pageX - this.offsetLeft) / this.width - 1.0;
    //     var y = -(2.0 * (e.pageY - this.offsetTop) / this.height - 1.0);
    //     state.origin = [x, y, 0.];
    // };
    state.origin = [0, -0.5, 0];
    window.requestAnimationFrame(
        function (ts) { render(webgl_context, state, ts); });
};

$('#term').terminal({
    sparkler: function () {

    },
}, {
    greetings: 'WebGL / Lab8',
    completion: ['sparkler'],
});