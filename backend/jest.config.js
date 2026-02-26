const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  setupFiles: ["<rootDir>/tests/jest.setup.ts"],
  
  // reduce worker and max RAM Usage to prevent slowness
  maxWorkers: 2,
  workerIdleMemoryLimit: "1024MB",
};