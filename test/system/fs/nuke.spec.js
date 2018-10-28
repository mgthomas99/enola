const chai = require("chai");
const fs = require("fs-extra");
const tmp = require("tmp");

const nuke = require("./../../../build/system/fs/nuke");

describe("nuke", function () {
  it("should delete the specified directory", function () {
    const dir = tmp.dirSync();
    nuke.nukeSync(dir.name);

    const exists = fs.existsSync(dir.name);
    chai.expect(exists).to.be.false;
  });
});
