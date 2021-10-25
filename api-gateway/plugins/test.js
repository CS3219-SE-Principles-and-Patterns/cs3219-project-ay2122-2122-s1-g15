module.exports = {
  version: '1.0.0',
  init: function (pluginContext) {
    pluginContext.registerPolicy({
      name: 'test',
      policy: (params) => async (req, res, next) => {
        return next();
      },
      schema: {
        $id: 'http://express-gateway.io/policies/test.json',
      }
    })
  },
  schema: {
    $id: 'http://express-gateway.io/plugins/test.json',
  }
};
