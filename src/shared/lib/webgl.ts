

export function initWebGL(
  canvas: HTMLCanvasElement,
  vertexShaderSource: string,
  fragmentShaderSource: string
): WebGLRenderingContext | null {
  const context = canvas.getContext("webgl", { premultipliedAlpha: false });
  if (!context) {
    alert("WebGL не поддерживается");
    return null;
  }
  
  const gl = context;
  const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
  
  if (!program) {
    return null;
  }

  gl.useProgram(program);
  return gl;
}

function createShaderProgram(
  gl: WebGLRenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string
): WebGLProgram | null {
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  if (!vertexShader || !fragmentShader) {
    alert("Ошибка при создании шейдеров");
    return null;
  }

  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);

  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    alert("Ошибка компиляции вершинного шейдера. " + gl.getShaderInfoLog(vertexShader));
    return null;
  }

  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);

  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    alert("Ошибка компиляции фрагментного шейдера. " + gl.getShaderInfoLog(fragmentShader));
    return null;
  }

  const program = gl.createProgram();
  if (!program) {
    alert("Ошибка при создании программы");
    return null;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    alert("Ошибка добавления WebGL программы. " + gl.getProgramInfoLog(program));
    return null;
  }

  return program;
}