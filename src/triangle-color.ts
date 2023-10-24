import { clearScreen, getProgramWithCustomShader, gl } from "./util";

const vertexShaderSource = `
    attribute vec4 a_position;
    attribute vec4 a_color;
    varying vec4 v_color;
    void main(){
        gl_Position = a_position;
        gl_PointSize = 10.0;
        v_color = a_color;
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    varying vec4 v_color;
    void main(){
        gl_FragColor = v_color;
    }
`;

const program = getProgramWithCustomShader(
	vertexShaderSource,
	fragmentShaderSource
);

// 清空屏幕
clearScreen();
// 绑定程序
gl.useProgram(program);

// 顶点信息
// `x|y|r|g|g|a`
const data = new Float32Array([
	0.0, 0.5, 1.0, 0.0, 0.0, 1.0, -0.5, -0.5, 0.0, 1.0, 0.0, 1.0, 0.5, -0.5,
	0.0, 0.0, 1.0, 1.0,
]);

let aPosition = gl.getAttribLocation(program, "a_position");
let aColor = gl.getAttribLocation(program, "a_color");

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

let per = Float32Array.BYTES_PER_ELEMENT;
console.log(per);
gl.vertexAttribPointer(
	aPosition,
	2,
	gl.FLOAT,
	false,
	Float32Array.BYTES_PER_ELEMENT * 6,
	0
);
gl.vertexAttribPointer(
	aColor,
	4,
	gl.FLOAT,
	false,
	Float32Array.BYTES_PER_ELEMENT * 6,
	Float32Array.BYTES_PER_ELEMENT * 2
);

gl.enableVertexAttribArray(aPosition);
gl.enableVertexAttribArray(aColor);
gl.drawArrays(gl.TRIANGLES, 0, 3);
