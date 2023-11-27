import { clearScreen, createTexture, getProgramWithCustomShader, gl } from './util';

/** 顶点着色器 */
const vertexShaderSource = `
    attribute vec4 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;
    void main(){
        gl_Position = a_position;
        v_texCoord = a_texCoord;
    }
`;

/** 片段着色器 */
const fragmentShaderSource = `
    precision mediump float;
    varying vec2 v_texCoord;
    uniform sampler2D u_texture;
    void main(){
        gl_FragColor = texture2D(u_texture, v_texCoord);
    }
`;

// 创建自定义shader的程序
const program = getProgramWithCustomShader(vertexShaderSource, fragmentShaderSource);

// 使用程序
gl.useProgram(program);

// 矩形 拆成两个三角形 左上->左下->右上  右下->右上->左下
// const points = new Float32Array([-1, 1, -1, -1, 1, -1, 1, -1, 1, 1, -1, 1]);
const points = new Float32Array([-1, 0.695, -1, -0.695, 1, -0.695, 1, -0.695, 1, 0.695, -1, 0.695]);
// 纹理采样同上、拆成两个区别在于、纹理坐标范围 【0-1】
const textureCoord = new Float32Array([0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1]);

// 获取着色器属性
let aPosition = gl.getAttribLocation(program, 'a_position');
let aTexCoord = gl.getAttribLocation(program, 'a_texCoord');

// 创建坐标buffer
let buffer = gl.createBuffer();
// 绑定激活buffer
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
// 填充数据
gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
// 指定buffer读取规则
gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 2, 0);
gl.enableVertexAttribArray(aPosition);

// 创建纹理坐标buffer
let texCoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
gl.bufferData(gl.ARRAY_BUFFER, textureCoord, gl.STATIC_DRAW);

gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 2, 0);
gl.enableVertexAttribArray(aTexCoord);

// 创建纹理、并关联到gl中
createTexture(gl);
const image = new Image();
image.src = '../assets/head.png';
image.onload = function () {
    clearScreen();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
};

// 注意： 同时存在多个buffer、需要分开激活、不然会互相干扰
// gl.enableVertexAttribArray(aPosition);
