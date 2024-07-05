const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    lessOptions: {
      modifyVars: {
        '@primary-color': '#10af14',
        '@link-color': '#1c2f70',
        '@btn-primary-bg': '#ffd43c',
      },
      javascriptEnabled: true,
    },
  }),
);
