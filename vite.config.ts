import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import glsl from 'vite-plugin-glsl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(), 
    glsl({
      include: [                      // Glob pattern, or array of glob patterns to import
        '**/*.glsl', '**/*.wgsl',
        '**/*.vert', '**/*.frag',
        '**/*.vs', '**/*.fs'
      ],
      exclude: undefined,             // Glob pattern, or array of glob patterns to ignore
      warnDuplicatedImports: true,    // Warn if the same chunk was imported multiple times
      removeDuplicatedImports: false, // Automatically remove an already imported chunk
      defaultExtension: 'glsl',       // Shader suffix when no extension is specified
      compress: false,                // Compress output shader code
      watch: true,                    // Recompile shader on change
      root: '/'                       // Directory for root imports
    })
  ]
})
