const axios = require("axios");

const { logger } = require("./helpers/helpers");

const host = process.env.npm_package_config_envHost;
const settingsPort = process.env.npm_package_config_settingsPort;
const serviceToolsPort = process.env.npm_package_config_serviceToolsPort;
const apiKey = process.env.npm_package_config_apiKey;

const userCreds = {
  login: process.env.npm_package_config_inOneUser,
  domain: process.env.npm_package_config_inOneDomain,
  password: process.env.npm_package_config_inOneUserPassword,
  accountType: process.env.npm_package_config_inOneUserAccountType
};

module.exports = async () => {
  try {
    logger.log("Starting InOne API Integration Tests global initialization");

    const settingsBook = await getSettingsBook();

    logger.log(
      `Assigning npm config settingsBook with ${JSON.stringify(settingsBook)}`
    );
    process.env.npm_package_config_settingsBook = JSON.stringify(settingsBook);

    const webApiHost = settingsBook.environment.HOST_OF_WEB_API;

    const customerSettings = await getCustomerSettings(webApiHost);

    logger.log(
      `Assigning npm config serviceToolsCustomers with ${JSON.stringify(
        customerSettings.data
      )}`
    );
    process.env.npm_package_config_serviceToolsCustomers = JSON.stringify(
      customerSettings.data
    );

    logger.log(`Assigning npm config envWindowsHost with ${webApiHost}`);
    process.env.npm_package_config_envWindowsHost = webApiHost;

    const customerDomain = customerSettings.data.customers.find(
      customer => customer.domain === process.env.npm_package_config_inOneDomain
    );

    process.env.npm_package_config_authTokenId = await getAuthTokenId();

    logger.log(
      "Successfully accomplished API Integration Tests global initialization"
    );
  } catch (e) {
    throw new Error(
      `API Integration Tests global initialization failed:\n\n ${e}`
    );
  }
};

async function getSettingsBook() {
  let settingsResponse;
  const settingsUrl = `http://${host}:${settingsPort}/settings`;
  logger.log(`Starting settings book retrieval process ${settingsUrl}`);
  try {
    settingsResponse = await axios.get(settingsUrl);
  } catch (e) {
    throw new Error(`Settings book request ${settingsUrl} failed:\n\n ${e}`);
  }

  if (
    settingsResponse.status !== 200 ||
    !(
      typeof settingsResponse.data === "object" &&
      settingsResponse.data !== null
    )
  ) {
    throw new Error(
      `Settings book request did not respond with 200 status or with correct object format ${settingsUrl}\n\n ${JSON.stringify(
        settingsResponse
      )}`
    );
  }

  logger.log("Finished settings book retrieval process");

  return settingsResponse.data;
}

async function getAuthTokenId() {
  const authUrl = `http://${host}/api/authentication/login`;

  logger.log(
    `Starting auth process ${authUrl} with ${JSON.stringify(userCreds)}`
  );

  let authResponse;
  try {
    authResponse = await axios.post(authUrl, userCreds);
  } catch (e) {
    throw new Error(
      `Authorization ${authUrl} with ${userCreds} failed:\n\n ${e}`
    );
  }

  if (
    authResponse.status !== 200 ||
    !(typeof authResponse.data === "object" && authResponse.data !== null)
  ) {
    throw new Error(
      `Authorization failed ${authUrl}\n\n ${JSON.stringify(authResponse)}`
    );
  }

  const authTokenId = authResponse.data.tokenId;

  const tokenValidityUrl = `http://${host}/api/authentication/token-validity/${authTokenId}/`;
  logger.log(
    `Starting token validation process ${tokenValidityUrl} for ${authTokenId}`
  );

  let tokenValidityResponse;
  try {
    tokenValidityResponse = await axios.get(tokenValidityUrl);
  } catch (e) {
    throw new Error(`Token validation ${tokenValidityUrl} failed:\n\n ${e}`);
  }

  if (
    tokenValidityResponse.status !== 200 ||
    !(
      typeof tokenValidityResponse.data === "object" &&
      tokenValidityResponse.data !== null
    ) ||
    !tokenValidityResponse.data.validity.isTokenValid
  ) {
    throw new Error(
      `Token validation for ${authTokenId} failed ${tokenValidityUrl}\n\n ${JSON.stringify(
        tokenValidityResponse
      )}`
    );
  }
  logger.log(
    `Finished token validation process ${tokenValidityUrl} for ${authTokenId}`
  );

  logger.log(`Finished auth process ${authUrl}`);

  return authTokenId;
}
