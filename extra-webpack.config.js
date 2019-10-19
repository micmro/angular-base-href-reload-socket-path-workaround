/**
 * @param {import("webpack").Configuration} config
 * @param {import("@angular-builders/custom-webpack").CustomWebpackBrowserSchema} options
 */
module.exports = (config, options) => {
  if(!config.devServer) {
    // do nothing for `ng build`
    return config;
  }
  return {
    ...config,
    // devServer: {
    //   ...config.devServer,
    //   sockPath: `${config.devServer.publicPath}/sockjs-node`
    // }
  };
};