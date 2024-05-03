export const createTexture = (
    gl: WebGL2RenderingContext,
    diff_map: HTMLImageElement,
    index: number,
    grayscale: boolean = false
): WebGLTexture => {
    let tex = gl.createTexture() as WebGLTexture;
    gl.activeTexture(gl.TEXTURE0 + index);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    if (grayscale) {
        // All of this is to convert possibly RGB texture to grayscale
        let canvas = document.createElement('canvas');
        canvas.width = diff_map.width;
        canvas.height = diff_map.height;
        let ctx = canvas.getContext('2d')!;

        ctx.drawImage(diff_map, 0, 0);

        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let pixels = imgData.data;

        let grayscalePixels = new Uint8Array(canvas.width * canvas.height);
        for (let i = 0; i < pixels.length; i += 4) {
            let gray = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
            grayscalePixels[i / 4] = gray;
        }
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, canvas.width, canvas.height, 0, gl.RED, gl.UNSIGNED_BYTE, grayscalePixels);
    }
    else {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, diff_map);
    }
    return tex;
}
