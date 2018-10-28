const tmp = require("tmp");

module.exports.perf = function (fn) {
  const start = process.hrtime();
  fn();
  const elapsed = process.hrtime(start);
  return elapsed[0] + elapsed[1] * 1e-12;
};

function run(fn) {
  const dir = tmp.dirSync();
  return fn(dir.name);
}

const nuke = require("./nuke");
const rimraf = require("./rimraf");

console.log(`
  Nuke:   ${run(nuke).toFixed(12)}
  Rimraf: ${run(rimraf).toFixed(12)}
`);
