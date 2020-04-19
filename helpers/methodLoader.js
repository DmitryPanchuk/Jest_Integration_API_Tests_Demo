// make tea
const makeTea = require("../methods/makeTea/makeTea.js");

const API = {
  cook: {
    tea: makeTea
  }
};

module.exports.API = API;

global.API = API;
