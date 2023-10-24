/** 默认顶点着色器 */
export const defaultVertextShaderSource = `
    attribute vec4 a_position;
    void main(){
        gl_Position = a_position;
        gl_PointSize = 10.0;
    }
`;

/** 默认片段着色器 */
export const defaultFragmentShaderSource = `
    precision mediump float;
    void main(){
        gl_FragColor = vec4(1.0, 0.5, 1.0, 1.0);
    }
`;

/** 获取webgl对象 */
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
export const gl = canvas.getContext("webgl");

/** 获取自定义program对象 */
let vertexShader = createShader(
	gl,
	gl.VERTEX_SHADER,
	defaultVertextShaderSource
);
let fragmentShader = createShader(
	gl,
	gl.FRAGMENT_SHADER,
	defaultFragmentShaderSource
);
export const program = createProgram(gl, vertexShader, fragmentShader);

/** 获取自定义shader的program对象 */
export function getProgramWithCustomShader(
	vertexShaderSource: string,
	fragmentShaderSource: string
) {
	let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	let fragmentShader = createShader(
		gl,
		gl.FRAGMENT_SHADER,
		fragmentShaderSource
	);
	let program = createProgram(gl, vertexShader, fragmentShader);
	return program;
}

/** 创建shader */
export function createShader(
	gl: WebGLRenderingContext,
	type: number,
	source: string
) {
	let shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (success) {
		return shader;
	} else {
		console.error(gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
}

/** 创建program程序 */
export function createProgram(
	gl: WebGLRenderingContext,
	vertexShader: WebGLShader,
	fragmentShader: WebGLShader
) {
	let program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	let success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (success) {
		return program;
	} else {
		console.error(gl.getProgramInfoLog(program));
		gl.deleteProgram(program);
		return null;
	}
}

/** 清除颜色 */
export function clearScreen(
	r: number = 0.0,
	g: number = 0.0,
	b: number = 0.0,
	a: number = 1.0
) {
	gl.clearColor(r, g, b, a);
	gl.clear(gl.COLOR_BUFFER_BIT);
}

/** 创建纹理 */
export function createTexture(gl: WebGLRenderingContext) {
	let texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	return texture;
}
