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
      textureCoord: number;
    };
    uniformLocations: {
      projectionMatrix: WebGLUniformLocation;
      modelViewMatrix: WebGLUniformLocation;
      uSampler: WebGLUniformLocation;
    };
  } | null = null;
  let buffers: {
    position: WebGLBuffer | null;
    color: WebGLBuffer | null;
    indices: WebGLBuffer | null;
    textureCoord: WebGLBuffer | null;
  } | null = null;
  let texture: WebGLTexture | null = null;

  let animationFrameId: number;
  let startTime: number;

  function loadTexture(
    gl: WebGLRenderingContext,
    url: string
  ): Promise<WebGLTexture> {
    return new Promise((resolve, reject) => {
      const texture = gl.createTexture();
      if (!texture) {
        reject(new Error("Failed to create texture"));
        return;
      }

      const image = new Image();
      image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          image
        );

        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
          gl.generateMipmap(gl.TEXTURE_2D);
        } else {
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
        resolve(texture);
      };
      image.onerror = () => {
        reject(new Error("Failed to load texture"));
      };
      image.src = url;
    });
  }

  function isPowerOf2(value: number): boolean {
    return (value & (value - 1)) === 0;
  }

  onMount(async () => {
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
        textureCoord: gl.getAttribLocation(program, "aTextureCoord"),
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(program, "uProjectionMatrix")!,
        modelViewMatrix: gl.getUniformLocation(program, "uModelViewMatrix")!,
        uSampler: gl.getUniformLocation(program, "uSampler")!,
      },
    };

    buffers = initBuffers(gl);

    try {
      texture = await loadTexture(gl, "example.jpg");
    } catch (error) {
      console.error("Failed to load texture:", error);
    }

    startTime = performance.now();
    render();
  });

  onMount(() => {
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  });

  function render() {
    if (!gl || !programInfo || !buffers || !texture) return;

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
    const baseZ = 8; // Базовое расстояние от центра сцены

    // Движение слева направо и обратно
    const triangleWave = Math.abs(2 * normalizedTime - 1); // Создает треугольную волну от 0 до 1 и обратно
    const cameraX = maxX * (1 - 2 * triangleWave); // Преобразуем в движение от +maxX до -maxX и обратно
    const cameraZ = baseZ; // Фиксированное расстояние от центра
    const cameraY = 5;

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

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
    gl.vertexAttribPointer(
      programInfo.attribLocations.textureCoord,
      2,
      gl.FLOAT,
      false,
      0,
      0
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

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

<div class="page">
  <h1>Кинотеатр</h1>

  <canvas bind:this={canvas} width="800" height="600"></canvas>
</div>

<style>
  .page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  canvas {
    border: 1px solid #333;
  }
</style>
