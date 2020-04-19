const os = require("os");
const path = require("path");
const { http } = require("../helpers/helpers");

const host = process.env.npm_package_config_envHost;
const windowsHost = process.env.npm_package_config_envWindowsHost;

const apiPath = process.env.npm_package_config_apiPath;

const settingsBook = JSON.parse(process.env.npm_package_config_settingsBook);

const superUserCreds = {
  login: process.env.npm_package_config_User,
  domain: process.env.npm_package_config_Domain,
  password: process.env.npm_package_config_UserPassword,
  accountType: process.env.npm_package_config_UserAccountType
};

const authTokenId = process.env.npm_package_config_authTokenId;

// *** make tea ***
const makeTeaEndPoint = `${http}${host}${apiPath}tea`;
// ****************

const Config = {
  host,
  apiPath,
  windowsHost,
  settingsBook,
  authTokenId,
  authServiceEndPoint,
  superUserCreds,

  // make tea
  makeTeaEndPoint,

  tmpDir: path.join(os.tmpdir(), "/inOne_api_integration_tests_storage"),
};

module.exports = Config;

global.Config = Config;
