import { defineConfig } from "vitest/config";
import path from "path";
import * as dotenv from "dotenv";

// Charge les variables d'environnement pour les tests
dotenv.config({ path: process.env.DOTENV_CONFIG_PATH ?? ".env" });

export default defineConfig({
  resolve: {
    alias: {
      src: path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
    include: ["__tests__/**/*.{spec,test}.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
});
