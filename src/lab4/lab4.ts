let canvas = document.querySelector("#main_canvas") as HTMLCanvasElement;
let gl = canvas.getContext("webgl");

if (!gl) {
    throw Error('no gl in lab12');
}
gl.clearColor(0.9, 0.9, 0.99, 1.0);
gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

$('#term').terminal({
    hello: function (what: string) {
        this.echo('Hello, ' + what +
            '. Wellcome to this terminal.');
    },
    task1: function () {
        //
        this.disable();
    },
}, {
    greetings: 'WebGL / Lab4'
});


