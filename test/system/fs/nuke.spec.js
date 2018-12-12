const chai = require("chai");
const fs = require("fs-extra");
const tmp = require("tmp");

const enola = require("./../../..");

describe("nukeSync", function () {
  it("should delete the specified directory", function () {
    const dir = tmp.dirSync();
    enola.nukeSync(dir.name);

    const exists = fs.existsSync(dir.name);
    chai.expect(exists).to.be.false;
  });
});

describe("nuke", function () {
  it("should delete the specified directory", function (done) {
    tmp.dir(function (err, dir) {
      if (err) throw err;

      enola.nuke(dir).then(function () {
        const exists = fs.existsSync(dir.name);
        chai.expect(exists).to.be.false;
        done();
      });
    });
  });
});
