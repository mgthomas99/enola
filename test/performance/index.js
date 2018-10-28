const fs = require("fs-extra");

module.exports.perf = function (fn) {
  const start = process.hrtime();
  fn();
  const elapsed = process.hrtime(start);
  return elapsed[0] + elapsed[1] * 1e-12;
};

const nuke = require("./nuke");
const rimraf = require("./rimraf");

function run(fn, dir) {
  fs.mkdirSync(dir);
  return fn(dir);
}

const perf_rimraf = run(rimraf, "./abc");
const perf_nuke = run(nuke, "./abc");

console.log(`
  Nuke:   ${perf_nuke.toFixed(12)}
  Rimraf: ${perf_rimraf.toFixed(12)}
`);
