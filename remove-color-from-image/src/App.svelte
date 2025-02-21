<script lang="ts">
  import { initWebGL, setupTexture } from "./lib/webgl";
  import { hexToRgb } from "./lib/utils";

  let canvas: HTMLCanvasElement;
  let fileInput: HTMLInputElement;
  let colorPicker: HTMLInputElement;
  let tolerance = 30;
  let gl: WebGLRenderingContext | null = null;

  function handleImage(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        gl = initWebGL(canvas);
        if (!gl) return;

        setupTexture(gl, img);
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
        Tolerance (0-100):
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
