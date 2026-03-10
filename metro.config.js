const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// WebContainer environment: disable watchman (not available in WebContainers)
config.resolver.sourceExts = [...config.resolver.sourceExts];

// Aliases to match tsconfig paths
config.resolver.alias = {
  '@': './src',
  '@convex': './convex/_generated',
};

module.exports = withNativeWind(config, { input: './global.css' });
