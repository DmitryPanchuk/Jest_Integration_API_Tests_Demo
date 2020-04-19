const dateNow = new Date();
const dateNowISO = dateNow.toISOString();
const message = `autoTestEventMessage`;
const sourceId = `autoTestLocation`;
const userAddedEventName = `Событие созданное пользователем`;

const teaBagData = (teaBagId, teaBagFlavour) => {
  return {
    teaBagId,
    teaBagFlavour
  };
};

const addSugarData = amountOfSugar => {
  return {
    amountOfSugar
  };
};

const addHotWaterData = {
  amountLeftInPercent: 100,
  isHot: true
};

const removeTeaBagData = {
  teaBagRemoved: true
};

const stirData = {
  stired: true
};

const drinkData = {
  amountLeftInPercent: 0
};

module.exports = {
  teaBagData,
  addSugarData,
  addHotWaterData,
  removeTeaBagData,
  stirData,
  drinkData
};
