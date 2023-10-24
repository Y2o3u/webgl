import { gl } from "./util";

const vertextShaderSource = `
    attribute vec4 a_position;
    void main(){
        gl_Position = a_position;
        gl_PointSize = 10.0;
    }
`;
const fragmentShaderSource = `
    precision mediump float;
    void main(){
        gl_FragColor = vec4(1.0, 0.5, 1.0, 1.0);
    }
`;

/** 创建shader对象 */
function createShader(gl: WebGLRenderingContext, type: number, source: string) {
	// 创建shader对象
	let shader = gl.createShader(type);
	// 传入源码
	gl.shaderSource(shader, source);
	// 编译shader
	gl.compileShader(shader);
	// 判断shader是否编译成功
	let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (success) {
		return shader;
	}
	console.log(gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
}

/** 创建propgram对象 */
function createProgram(
	gl: WebGLRenderingContext,
	vertexShader: WebGLShader,
	fragmentShader: WebGLShader
) {
	// 创建propgram对象
	let program = gl.createProgram();
	// 往program中传入shader对象
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);

	// 链接program
	gl.linkProgram(program);
	// 判断program是否链接成功
	let success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (success) {
		return program;
	}

	console.log(gl.getProgramInfoLog(program));
	gl.deleteProgram(program);
}

/** 初始化webgl */
function initWebgl() {
	let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertextShaderSource);
	let fragmentShader = createShader(
		gl,
		gl.FRAGMENT_SHADER,
		fragmentShaderSource
	);
	let program = createProgram(gl, vertexShader, fragmentShader);
	return program;
}

// 设置清除颜色
gl.clearColor(0.0, 0.0, 0.0, 1.0);
// 清空颜色缓冲
gl.clear(gl.COLOR_BUFFER_BIT);

// 初始化shader程序
const program = initWebgl();
// 告诉webgl使用该程序
gl.useProgram(program);
// 获取shader中的a_position的地址
const a_position = gl.getAttribLocation(program, "a_position");
// 填充顶点数据
// gl.vertexAttrib3f(a_position, 0.0, 0.0, 0.0);

// 修改为用buffer填充数据
const data = new Float32Array([0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5]);
const buffer = gl.createBuffer();
// 绑定缓冲区对象、激活buffer
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
// 顶点数据传入缓冲区
gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
// 指定缓冲区数据读取规则
gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);
// 允许数据传递
gl.enableVertexAttribArray(a_position);
// 开始绘制

// 矩型
gl.drawArrays(gl.LINE_LOOP, 0, 4);

// 三角形
gl.drawArrays(gl.TRIANGLES, 1, 3);
