import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Use 'node' for server utility tests (no DOM needed)
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    globals: true,
  }
})
