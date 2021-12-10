// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

 module.exports = (async () => {
  const {
  resolver: { sourceExts, assetExts }
  } = await getDefaultConfig(__dirname);
  return {
  transformer: {
  babelTransformerPath: require.resolve("react-native-svg-transformer")
  },
  resolver: {
  assetExts: assetExts.filter(ext => ext !== "svg"),
  sourceExts: [...sourceExts, "svg"]
  }
  };
  })();
