import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    // some paths to the files that are test files
    include: ["./**/*.test.ts", "./**/*.test.tsx"],
    globals: true,
    environment: "jsdom",
  },
});
