const nuke = require("./../../build/system/fs/nuke");
const perf = require("./index").perf;

module.exports = function (dir) {
  return perf(function () {
    nuke.nukeSync(dir);
  });
};
