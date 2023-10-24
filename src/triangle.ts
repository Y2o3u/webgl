const canvas: HTMLCanvasElement = document.getElementById("canvas") as any;
const gl = canvas.getContext("webgl");

// 设置清除颜色
gl.clearColor(1.0, 1.0, 0.0, 1.0);
// 清空颜色缓冲
gl.clear(gl.COLOR_BUFFER_BIT);
