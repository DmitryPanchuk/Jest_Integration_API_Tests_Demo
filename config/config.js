const os = require("os");
const path = require("path");
const { http } = require("../helpers/helpers");

const host = process.env.npm_package_config_envHost;
const windowsHost = process.env.npm_package_config_envWindowsHost;

const apiPath = process.env.npm_package_config_apiPath;

const settingsBook = JSON.parse(process.env.npm_package_config_settingsBook);

// *** authorization ***
const authServiceEndPoint = `${http}${host}${apiPath}authentication`;

const superUserCreds = {
  login: process.env.npm_package_config_inOneUser,
  domain: process.env.npm_package_config_inOneDomain,
  password: process.env.npm_package_config_inOneUserPassword,
  accountType: process.env.npm_package_config_inOneUserAccountType
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
