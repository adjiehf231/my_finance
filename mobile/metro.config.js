const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Ensure Metro prioritizes local mobile/node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
];

// Block watching parent Next.js build directories
config.resolver.blockList = [
  new RegExp(path.resolve(projectRoot, "..", ".next")),
];

module.exports = config;
