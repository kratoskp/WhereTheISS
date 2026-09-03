const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === '../tslib.js' &&
    context.originModulePath.endsWith(path.join('tslib', 'modules', 'index.js'))
  ) {
    return context.resolveRequest(
      context,
      path.resolve(context.originModulePath, '..', '..', 'tslib.js'),
      platform
    );
  }

  if (moduleName === 'tslib') {
    return context.resolveRequest(
      context,
      require.resolve('tslib/tslib.js'),
      platform
    );
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;