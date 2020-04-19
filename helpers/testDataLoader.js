// make tea
const makeTea = require("../data/makeTea/makeTea.js");

const testData = {
  cook: {
    tea: makeTea
  }
};

module.exports.schema = testData;

global.testData = testData;
