import { clearScreen, createProjectionMat, createTexture, getProgramWithCustomShader, gl } from "./util";

const vertexShaderSource = `
    attribute vec4 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;
    uniform mat4 u_projection;
    void main(){
        gl_Position = u_projection * a_position;
        v_texCoord = a_texCoord;
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    varying vec2 v_texCoord;
    uniform sampler2D u_texture;
    void main (){
        gl_FragColor = texture2D(u_texture, v_texCoord);
    }
`;

const canvasWidth = 500;
const canvasHeight = 500;

const program = getProgramWithCustomShader(vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

// 矩形 拆成两个三角形
const points = new Float32Array([0, 0, 359, 0, 359, 230, 359, 230, 0, 230, 0, 0]);
// 纹理采样同上、拆成两个区别在于、纹理坐标范围 【0-1】
const textureCoord = new Float32Array([0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0]);

// 顶点坐标
const aPosition = gl.getAttribLocation(program, "a_position");
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 2, 0);
gl.enableVertexAttribArray(aPosition);

// 纹理坐标
const aTexCoord = gl.getAttribLocation(program, "a_texCoord");
let texCoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
gl.bufferData(gl.ARRAY_BUFFER, textureCoord, gl.STATIC_DRAW);
gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 2, 0);
gl.enableVertexAttribArray(aTexCoord);

// 矩阵
const uProjection = gl.getUniformLocation(program, "u_projection");
const projectionMat = createProjectionMat(0, canvasWidth, canvasHeight, 0, 0, 1);
gl.uniformMatrix4fv(uProjection, false, projectionMat);

createTexture(gl);
const image = new Image();
image.src = "../assets/head.png";
image.onload = function () {
	clearScreen();
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.drawArrays(gl.TRIANGLES, 0, 6);
};
