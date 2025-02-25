<script lang="ts">
  import { onMount } from "svelte";
  import { initWebGL } from "../../shared/lib/webgl";
  import {
    vertexShaderSource,
    fragmentShaderSource,
    initBuffers,
    createViewMatrix,
  } from "./lib/shaders";
  import { mat4Perspective } from "../../shared/lib/math/matrix";

  let canvas: HTMLCanvasElement;
  let gl: WebGLRenderingContext | null = null;
  let programInfo: {
    program: WebGLProgram;
    attribLocations: {
      position: number;
      color: number;
    };
    uniformLocations: {
      projectionMatrix: WebGLUniformLocation;
      modelViewMatrix: WebGLUniformLocation;
    };
  } | null = null;
  let buffers: {
    position: WebGLBuffer | null;
    color: WebGLBuffer | null;
    indices: WebGLBuffer | null;
  } | null = null;

  let animationFrameId: number;
  let startTime: number;

  onMount(() => {
    gl = initWebGL(canvas, vertexShaderSource, fragmentShaderSource);
    if (!gl) {
      console.error("Unable to initialize WebGL");
      return;
    }

    const program = gl.getParameter(gl.CURRENT_PROGRAM);
    if (!program) {
      console.error("Failed to get program");
      return;
    }

    programInfo = {
      program,
      attribLocations: {
        position: gl.getAttribLocation(program, "aPosition"),
        color: gl.getAttribLocation(program, "aColor"),
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(program, "uProjectionMatrix")!,
        modelViewMatrix: gl.getUniformLocation(program, "uModelViewMatrix")!,
      },
    };

    buffers = initBuffers(gl);
    startTime = performance.now();
    render();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  });

  function render() {
    if (!gl || !programInfo || !buffers) return;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fieldOfView = (45 * Math.PI) / 180;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4Perspective(fieldOfView, aspect, zNear, zFar);

    // Вычисляем позицию камеры с двунаправленным движением
    const currentTime = (performance.now() - startTime) / 1000;
    const period = 6; // Полный цикл движения в одну сторону
    const normalizedTime = (currentTime % (period * 2)) / (period * 2); // Удваиваем период для движения туда-обратно

    const maxX = 8; // Максимальное отклонение по X
    const baseZ = 16; // Базовое расстояние от центра сцены

    // Движение слева направо и обратно
    const triangleWave = Math.abs(2 * normalizedTime - 1); // Создает треугольную волну от 0 до 1 и обратно
    const cameraX = maxX * (1 - 2 * triangleWave); // Преобразуем в движение от +maxX до -maxX и обратно
    const cameraZ = baseZ; // Фиксированное расстояние от центра
    const cameraY = 3;

    const viewMatrix = createViewMatrix(
      [cameraX, cameraY, cameraZ],
      [0, 0, 0],
      [0, 1, 0]
    );

    // Настраиваем буферы и атрибуты
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      programInfo.attribLocations.position,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.position);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
      programInfo.attribLocations.color,
      4,
      gl.FLOAT,
      false,
      0,
      0
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.color);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    gl.useProgram(programInfo.program);

    gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix
    );
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      viewMatrix
    );

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

    animationFrameId = requestAnimationFrame(render);
  }
</script>

<main>
  <canvas bind:this={canvas} width="800" height="600"></canvas>
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background: #000;
  }

  canvas {
    border: 1px solid #333;
  }
</style>
