const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Explicitly handle resolver configuration
config.resolver = {
  ...config.resolver,
  assetExts: [
    ...config.resolver.assetExts.filter((ext) => ext !== "ttf"),
    "ttf",
  ], // Ensure 'ttf' is included
  sourceExts: [...config.resolver.sourceExts], // Use default sourceExts
};

module.exports = withNativeWind(config, { input: "./global.css" });
