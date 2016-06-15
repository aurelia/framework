var tsconfig = require('../tsconfig.json');
var assign = Object.assign || require('object.assign');

module.exports = function(override) {
  return assign(tsconfig.compilerOptions, {
    "target": override && override.target || "es5",
    "typescript": require('typescript')
  }, override || {});
}
