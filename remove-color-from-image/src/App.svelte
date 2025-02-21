<script lang="ts">
  import { onMount } from "svelte";

  let canvas: HTMLCanvasElement;
  let fileInput: HTMLInputElement;
  let colorPicker: HTMLInputElement;
  let tolerance = 30;
  let gl: WebGLRenderingContext;

  // Шейдеры
  const vertexShaderSource = `
    attribute vec2 position;
    varying vec2 texCoord;
    void main() {
      texCoord = position * 0.5 + 0.5;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;
    uniform sampler2D uImage;
    uniform vec3 uTargetColor;
    uniform float uTolerance;
    varying vec2 texCoord;
    
    void main() {
      vec4 color = texture2D(uImage, texCoord);
      float distance = length(color.rgb - uTargetColor);
      
      if (distance < uTolerance / 255.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      } else {
        gl_FragColor = color;
      }
    }
  `;

  function initWebGL() {
    const context = canvas.getContext("webgl", { premultipliedAlpha: false });
    if (!context) {
      alert("WebGL не поддерживается");
      return;
    }
    gl = context as WebGLRenderingContext;

    // Создаем шейдеры
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) {
      alert("Ошибка при создании шейдеров");
      return;
    }

    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    // Создаем программу
    const program = gl.createProgram();
    if (!program) {
      alert("Ошибка при создании программы");
      return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Создаем буфер вершин
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    return program;
  }

  function handleImage(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        const program = initWebGL();

        // Создаем текстуру
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          img
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        updateImage();
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  function updateImage() {
    if (!gl) return;

    const color = hexToRgb(colorPicker.value);
    if (!color) return;

    gl.viewport(0, 0, canvas.width, canvas.height);

    const targetColorLocation = gl.getUniformLocation(
      gl.getParameter(gl.CURRENT_PROGRAM),
      "uTargetColor"
    );
    gl.uniform3f(
      targetColorLocation,
      color.r / 255,
      color.g / 255,
      color.b / 255
    );

    const toleranceLocation = gl.getUniformLocation(
      gl.getParameter(gl.CURRENT_PROGRAM),
      "uTolerance"
    );
    gl.uniform1f(toleranceLocation, tolerance);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  $: if (gl && colorPicker?.value) {
    updateImage();
  }

  $: if (tolerance !== undefined) {
    updateImage();
  }
</script>

<main>
  <h1>Удаление цвета из изображения</h1>

  <div class="controls">
    <input
      type="file"
      accept="image/*"
      bind:this={fileInput}
      on:change={handleImage}
    />
    <div class="color-control">
      <label>
        Выберите цвет для удаления:
        <input type="color" bind:this={colorPicker} on:input={updateImage} />
      </label>
    </div>
    <div class="tolerance-control">
      <label>
        Допуск (0-100):
        <input type="range" min="0" max="100" bind:value={tolerance} />
      </label>
      <span>{tolerance}</span>
    </div>
  </div>

  <canvas bind:this={canvas}></canvas>
</main>

<style>
  main {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }

  .controls {
    margin: 20px 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  canvas {
    max-width: 100%;
    background: #f0f0f0;
    border: 1px solid #ccc;
  }

  .color-control,
  .tolerance-control {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  label {
    display: flex;
    align-items: center;
    gap: 10px;
  }
</style>
