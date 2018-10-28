const rimraf = require("rimraf");
const perf = require("./index").perf;

module.exports = function (dir) {
  return perf(function () {
    rimraf.sync(dir);
  });
};
