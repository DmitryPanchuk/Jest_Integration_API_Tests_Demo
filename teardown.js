const axios = require("axios");

const host = process.env.npm_package_config_envHost;

const { logger } = require("./helpers/helpers");

module.exports = async () => {
  try {
    logger.log("Starting InOne API Integration Tests global tear down process");

    await performLogOut();

    logger.log(
      "Successfully accomplished InOne API Integration Tests global tear down process"
    );
  } catch (e) {
    throw new Error(
      `InOne API Integration Tests global tear down process failed:\n\n ${e}`
    );
  }
};

async function performLogOut() {
  const autLogOuthUrl = `http://${host}/api/authentication/logout`;
  try {
    logger.log(
      `Starting logout process ${autLogOuthUrl} with token: ${process.env.npm_package_config_authTokenId}`
    );

    await axios.post(
      autLogOuthUrl,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${process.env.npm_package_config_authTokenId}`
        }
      }
    );
  } catch (e) {
    throw new Error(
      `Logging out ${autLogOuthUrl} with ${process.env.npm_package_config_authTokenId} failed:\n\n ${e}`
    );
  }

  let tokenValidityResponse;
  const tokenValidityhUrl = `http://${host}/api/authentication/token-validity/${process.env.npm_package_config_authTokenId}/`;

  logger.log(
    `Starting token validation process ${tokenValidityhUrl} with token: ${process.env.npm_package_config_authTokenId}`
  );

  try {
    tokenValidityResponse = await axios.get(tokenValidityhUrl);
  } catch (e) {
    throw new Error(
      `Token validation ${tokenValidityhUrl} for token ${process.env.npm_package_config_authTokenId} failed:\n\n ${e}`
    );
  }

  if (
    tokenValidityResponse.status !== 200 ||
    !(
      typeof tokenValidityResponse.data === "object" &&
      tokenValidityResponse.data !== null
    ) ||
    tokenValidityResponse.data.validity.isTokenValid
  ) {
    throw new Error(
      `Token validation for ${
        process.env.npm_package_config_authTokenId
      } after logging out failed ${JSON.stringify(tokenValidityResponse)}`
    );
  }

  logger.log("Finished token validation process");

  logger.log("Finished logout process");
}
