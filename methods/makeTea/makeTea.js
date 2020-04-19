const config = require("../../config/config");
const { sendRequest } = require("../../lib/requestMaker");

module.exports = {
  lookUpTeaCups: async (params = {}, authToken, ...args) => {
    return sendRequest(
      {
        url: `${config.makeTeaEndPoint}/teaCup/lookUpTeaCups`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken ||
            process.env.npm_package_config_authTokenId}`
        }
      },
      args,
      params
    );
  },

  washTeaCupById: async (teaCupId, authToken, ...args) => {
    return sendRequest(
      {
        url: `${config.makeTeaEndPoint}/teaCup/${teaCupId}/wash`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken ||
            process.env.npm_package_config_authTokenId}`
        }
      },
      args
    );
  },

  lookUpTeaPot: async (params = {}, authToken, ...args) => {
    return sendRequest(
      {
        url: `${config.makeTeaEndPoint}/teaPot`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken ||
            process.env.npm_package_config_authTokenId}`
        }
      },
      args,
      params
    );
  },

  dropWaterFromTeaPot: async (authToken, ...args) => {
    return sendRequest(
      {
        url: `${config.makeTeaEndPoint}/teaPot/drop`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken ||
            process.env.npm_package_config_authTokenId}`
        }
      },
      args
    );
  },

  fillTeaPot: async (authToken, ...args) => {
    return sendRequest(
      {
        url: `${config.makeTeaEndPoint}/teaPot/fill`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken ||
            process.env.npm_package_config_authTokenId}`
        }
      },
      args
    );
  },

  boilWaterWithTeaPot: async (authToken, ...args) => {
    return sendRequest(
      {
        url: `${config.makeTeaEndPoint}/teaPot/boil`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken ||
            process.env.npm_package_config_authTokenId}`
        }
      },
      args
    );
  },

  uploadTeaBag: async (data, authToken, ...args) => {
    return sendRequest(
      {
        url: `${config.makeTeaEndPoint}/teaItem`,
        method: "POST",
        data,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken ||
            process.env.npm_package_config_authTokenId}`
        }
      },
      args
    );
  },

  modifyTea: async (teaItemId, data, authToken, ...args) => {
    return sendRequest(
      {
        url: `${config.makeTeaEndPoint}/teaItem/${teaItemId}`,
        method: "PUT",
        data,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken ||
            process.env.npm_package_config_authTokenId}`
        }
      },
      args
    );
  },

  drinkTea: async (teaItemId, authToken, ...args) => {
    return sendRequest(
      {
        url: `${config.makeTeaEndPoint}/teaItem/${teaItemId}/drink`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken ||
            process.env.npm_package_config_authTokenId}`
        }
      },
      args
    );
  },

  deleteTeaItem: async (teaItemId, authToken, ...args) => {
    return sendRequest(
      {
        url: `${config.eventsEndPoint}/teaItem/${teaItemId}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken ||
            process.env.npm_package_config_authTokenId}`
        }
      },
      args
    );
  }
};
