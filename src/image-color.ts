import { clearScreen, createTexture, getProgramWithCustomShader, gl } from './util';

const vertexShaderSource = `
    attribute vec4 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;
    void main(){
        gl_Position = a_position;
        v_texCoord = a_texCoord;
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    uniform sampler2D u_texture;
    varying vec2 v_texCoord;
    uniform mat4 u_hueMat;
    void main(){
        vec4 o = texture2D(u_texture, v_texCoord);
        // 置灰
        // o = vec4(vec3(dot(o.rgb, vec3(0.3))), o.a);
        // 色相
        o = u_hueMat * o;
        gl_FragColor = o;
    }
`;

/** 创建色相矩阵 */
function createHueMatrix(angle: number) {
    let radius = (Math.PI / 180) * angle;
    let sin = Math.sin(radius);
    let cos = Math.cos(radius);
    // prettier-ignore
    return new Float32Array([
        0.213 + cos * 0.787 - sin * 0.213, 0.213 - cos * 0.213 + sin * 0.143, 0.213 - cos * 0.213 - sin * 0.787, 0.0,
        0.715 - cos * 0.715 - sin * 0.715, 0.715 + cos * 0.285 + sin * 0.14, 0.715 - cos * 0.715 + sin * 0.715, 0.0,
        0.072 - cos * 0.072 + sin * 0.928, 0.072 - cos * 0.072 - sin * 0.283, 0.072 + cos * 0.928 + sin * 0.072, 0.0,
        0.0, 0.0, 0.0, 1.0,
    ]);
}

const program = getProgramWithCustomShader(vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

// 矩形 拆成两个三角形 左上->左下->右上  右下->右上->左下
const points = new Float32Array([-1, 0.695, -1, -0.695, 1, -0.695, 1, -0.695, 1, 0.695, -1, 0.695]);
// 纹理采样同上、拆成两个区别在于、纹理坐标范围 【0-1】
const texCoord = new Float32Array([0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1]);

let aPosition = gl.getAttribLocation(program, 'a_position');
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(aPosition);

// 纹理坐标缓冲
let aTexCoord = gl.getAttribLocation(program, 'a_texCoord');
const texCoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
gl.bufferData(gl.ARRAY_BUFFER, texCoord, gl.STATIC_DRAW);
gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(aTexCoord);

// 色相旋转矩阵
let uHueMat = gl.getUniformLocation(program, 'u_hueMat');
const hueMat = createHueMatrix(100);
gl.uniformMatrix4fv(uHueMat, false, hueMat);

createTexture(gl);
let image = new Image();
image.src = '../assets/head.png';
image.onload = function () {
    clearScreen();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
};

// 总结
// 1. 图片置灰
// 顶点使用公示： g_FragColor = vec4(vec3(dot(originColor, 0.33)), orignColor.a);
// dot(originColor, 0.33) 等价于 originColor.r * 0.33 + originColor.g * 0.33 + originColor.b * 0.33

// 色相计算，参考w3c标准 https://www.w3.org/TR/2018/WD-filter-effects-1-20181218/#values
//    a00, a01, a02, 0, 0,     R    R`
//    a10, a11, a12, 0, 0,     G    G`
//    a20, a21, a22, 0, 0,  *  B  = B`
//    0,   0,   0,   1, 0,     A    A`
//    0,   0,   0,   0, 1,     1    1

//    a00, a01, a02     0.213 0.715, 0.072                      0.787, -0.715, -0.072                     -0.213, -0.715, 0.928
//    a10, a11, a12  =  0.213 0.715, 0.072 + cos(hueRotate) *   -0.213, 0.285, -0.072 + sin(hueRotate) *  0.143,  0.140, -0.283
//    a20, a21, a22     0.213 0.715, 0.072                      -0.213, -0.715, 0.928                     -0.787, 0.715, 0.072

// a00 = 0.213 + cos(hueRotate) * 0.787 - sin(hueRotate) * 0.213;
// 以此类推
// R` = a00 * R + a01 * G + a02 * B;
