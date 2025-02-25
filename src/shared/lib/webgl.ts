import { vertexShaderSource, fragmentShaderSource } from '../../modules/remove-picked-color/lib/shaders';

export function initWebGL(canvas: HTMLCanvasElement): WebGLRenderingContext | null {
  const context = canvas.getContext("webgl", { premultipliedAlpha: false });
  if (!context) {
    alert("WebGL не поддерживается");
    return null;
  }
  
  const gl = context;
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  if (!vertexShader || !fragmentShader) {
    alert("Ошибка при создании шейдеров");
    return null;
  }

  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);

  const program = gl.createProgram();
  if (!program) {
    alert("Ошибка при создании программы");
    return null;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  setupBuffers(gl);

  return gl;
}

function setupBuffers(gl: WebGLRenderingContext) {
  const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(gl.getParameter(gl.CURRENT_PROGRAM), "position");
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
}

export function setupTexture(gl: WebGLRenderingContext, img: HTMLImageElement) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
} 