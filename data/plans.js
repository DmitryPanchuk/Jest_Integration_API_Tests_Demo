const pointFullData = (planId, deviceId, deviceType) => {
  return {
    id: `${planId}`,
    filter: {
      deviceIds: {
        checked: [
          {
            id: `${deviceId}`,
            type: `${deviceType}`
          }
        ]
      }
    }
  };
};

const emptyFilterForAllPoints = planId => {
  return { id: `${planId}`, filter: {} };
};

const pointsFilterData = (
  planId,
  deviceState,
  deviceId,
  deviceType,
  deviceName,
  deviceLocationId
) => {
  return {
    id: `${planId}`,
    filter: {
      deviceStatusIds: {
        name: "deviceStatusIds",
        active: true,
        checked: [`${deviceState}`]
      },
      deviceIds: {
        name: "deviceIds",
        active: true,
        checked: [
          {
            open: false,
            selected: true,
            id: `${deviceId}`,
            parentId: `${deviceLocationId}`,
            indeterminate: false,
            hasChildren: false,
            load: true,
            type: `${deviceType}`,
            disabled: false,
            active: true,
            name: `${deviceName}`
          }
        ],
        update: false
      },
      severity: {
        active: true,
        name: "severity",
        checked: []
      },
      deviceTypeIds: {
        name: "deviceTypeIds",
        active: true,
        checked: []
      }
    }
  };
};

module.exports = {
  pointFullData,
  emptyFilterForAllPoints,
  pointsFilterData
};
