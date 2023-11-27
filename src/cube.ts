import { createRotateMat, createScaleMat, createTranslateMat, getProgramWithCustomShader, gl } from './util';

const vertexShaderSource = `
    attribute vec4 a_position;
    attribute vec2 a_texCoord;
    attribute vec3 a_color;
    varying vec2 v_texCoord;
    varying vec3 v_color;
    uniform mat4 u_projection;
    uniform mat4 u_view;
    uniform mat4 u_translate;
    uniform mat4 u_rotate;
    uniform mat4 u_scale;
    void main(){
        gl_Position = u_projection * u_view * u_rotate * a_position;
        v_texCoord = a_texCoord;
        v_color = a_color;
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    varying vec2 v_texCoord;
    uniform sampler2D u_texture;
    varying vec3 v_color;
    void main (){
        gl_FragColor = vec4(v_color, 1.0);
    }
`;

const canvasWidth = 500;
const canvasHeight = 500;

const program = getProgramWithCustomShader(vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

const width = 100;
const height = 100;
const depth = -100;

// prettier-ignore
const points = new Float32Array([
    // front-face
    0,0,0, width,0,0,width,height,0,width,height,0,0,height,0,0,0,0,
    // back-face
    0,0,depth,width,0,depth,width,height,depth,width,height,depth,0,height,depth,0,0,depth,
    // left-face
    0,0,0,0,height,0,0,height,depth,0,height,depth,0,0,depth,0,0,0,
    // right-face
    width,0,0,width,height,0,width,height,depth,width,height,depth,width,0,depth,width,0,0,
    // top-face
    0,height,0,width,height,0,width,height,depth,width,height,depth,0,height,depth,0,height,0,
    // bottom-face
    0,0,0,width,0,0,width,0,depth,width,0,depth,0,0,depth,0,0,0,
]);

// prettier-ignore
const colors = new Float32Array([
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
    1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0,
    1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1,
    0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
    0.5, 1, 1, 0.5, 1, 1, 0.5, 1, 1, 0.5, 1, 1, 0.5, 1, 1, 0.5, 1, 1,
    0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1,
    0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
])

// 顶点坐标
const aPosition = gl.getAttribLocation(program, 'a_position');
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 3, 0);
gl.enableVertexAttribArray(aPosition);

const aColor = gl.getAttribLocation(program, 'a_color');
const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 3, 0);
gl.enableVertexAttribArray(aColor);

const uProjection = gl.getUniformLocation(program, 'u_projection');
const projMatrix = getPerspective(30, 1, 1, 2000);
// let mat1 = getOrthographicMatrix(-250, 250, 250, -250, -300, 300);
gl.uniformMatrix4fv(uProjection, false, projMatrix);

const uView = gl.getUniformLocation(program, 'u_view');

// prettier-ignore
const viewMatrix = createViewMatrix(
    0, 200, 0, // 观察点
    0, 0, 0, // 视点
    0, 1, 0 // 上方向
)

gl.uniformMatrix4fv(uView, false, viewMatrix);

let rotateAngle = 10;
// 渲染
const render = () => {
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // 我们需要往shader中传入矩阵
    const uTranslate = gl.getUniformLocation(program, 'u_translate');
    const uRotate = gl.getUniformLocation(program, 'u_rotate');
    const uScale = gl.getUniformLocation(program, 'u_scale');

    const matTranslate = createTranslateMat(200, 200);
    const matRotate = createRotateMat(rotateAngle);
    const matScale = createScaleMat(1, 1);

    gl.uniformMatrix4fv(uTranslate, false, matTranslate);
    gl.uniformMatrix4fv(uRotate, false, matRotate);
    gl.uniformMatrix4fv(uScale, false, matScale);

    // clearScreen();

    gl.drawArrays(gl.TRIANGLES, 0, 36);
};

function animate() {
    rotateAngle += 1;
    render();
    requestAnimationFrame(animate);
}
animate();

function createViewMatrix(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ) {
    const normalize = (v) => {
        const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        return [v[0] / length, v[1] / length, v[2] / length];
    };
    const subtract = (v1, v2) => {
        return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
    };
    const cross = (v1, v2) => {
        return [v1[1] * v2[2] - v1[2] * v2[1], v1[2] * v2[0] - v1[0] * v2[2], v1[0] * v2[1] - v1[1] * v2[0]];
    };

    const zAxis = normalize(subtract([eyeX, eyeY, eyeZ], [atX, atY, atZ]));
    const xAxis = normalize(cross([upX, upY, upZ], zAxis));
    const yAxis = normalize(cross(zAxis, xAxis));

    // prettier-ignore
    return new Float32Array([
        xAxis[0],yAxis[0],zAxis[0],0,
        xAxis[1],yAxis[1],zAxis[1],0,
        xAxis[2],yAxis[2],zAxis[2],0,
        -(xAxis[0] * eyeX + xAxis[1] * eyeY + xAxis[2] * eyeZ),
        -(yAxis[0] * eyeX + yAxis[1] * eyeY + yAxis[2] * eyeZ),
        -(zAxis[0] * eyeX + zAxis[1] * eyeY + zAxis[2] * eyeZ),
        // - eyeX,
        // - eyeY,
        // - eyeZ,
        1,
    ]);
}

function angleToRadian(angle) {
    return (Math.PI * angle) / 180;
}

/** 透视矩阵 */
function getPerspective(fov, aspect, near, far) {
    fov = angleToRadian(fov); // 角度转弧度
    const f = 1.0 / Math.tan(fov / 2);
    const nf = 1 / (near - far);
    // prettier-ignore
    return new Float32Array([
        f / aspect, 0, 0,                  0,
        0,          f, 0,                  0,
        0,          0, (far + near) * nf, -1,
        0,          0, 2 * far * near * nf, 0,
    ]);
}

/** 正交投影 */
function getOrthographicMatrix(left: number, right: number, top: number, bottom: number, near: number, far: number) {
    // prettier-ignore
    const mat = new Float32Array([
        2/(right -left), 0, 0, 0,
        0, 2/(top - bottom),0, 0,
        0, 0, -2 / (far-near), 0,
        -(right + left) / (right - left),-(top + bottom) / (top - bottom),-(far + near) / (far-near),1
    ]);
    return mat;
}

// 正交、透视投影计算
// https://blog.csdn.net/qq_40765480/article/details/128017757
// https://www.cnblogs.com/leixinyue/p/11166135.html
