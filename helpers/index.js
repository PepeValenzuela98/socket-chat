const dbValidators = require("./dbValidators");
const googleVerify = require("./googleVerify");
const jwt = require("./jwt");
const populate = require("./populate");
const archivoUploads = require("./archivoUploads");

module.exports = {
  ...dbValidators,
  ...googleVerify,
  ...jwt,
  ...populate,
  ...archivoUploads,
};
