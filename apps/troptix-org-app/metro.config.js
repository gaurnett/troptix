// const { withNativeWind: withNativeWind } = require('nativewind/metro');

// // Learn more https://docs.expo.io/guides/customizing-metro
// const { getDefaultConfig } = require('expo/metro-config');

// /** @type {import('expo/metro-config').MetroConfig} */
// const config = getDefaultConfig(__dirname);
// config.resolver.sourceExts.push('cjs');
// config.resolver.unstable_enablePackageExports = false;

// module.exports = withNativeWind(config, {
//   input: './global.css',
// });

const { getDefaultConfig } = require('@expo/metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);
  return {
    ...defaultConfig,
    // Add your custom Metro configuration here
    // Example:
    // resolver: {
    //   assetExts: [...defaultConfig.resolver.assetExts, 'db'],
    // },
  };
})();
