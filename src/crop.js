const SEED_MAKER_AVERAGE_YIELD = 2 * 0.975;

const FERTILIZERS = {
  none: {
    cost: 0,
    speed: 1,
  },
  speedGro: {
    cost: 100,
    speed: 0.9,
  },
  deluxeSpeedGro: {
    cost: 80,
    speed: 0.75,
  },
};

const getJarSellPrice = ({ category, sellPrice }) =>
  category === 'other' ? sellPrice : sellPrice * 2 + 50;

const getKegSellPrice = ({ category, sellPrice, kegSellPrice }) => {
  if (kegSellPrice) {
    return kegSellPrice;
  } else if (category === 'fruit') {
    return sellPrice * 3;
  } else if (category === 'veg') {
    return sellPrice * 2.25;
  }
  return sellPrice;
};

const pickProcessing = (crop, processing) => {
  if (processing !== 'either') {
    return processing;
  }
  const jarSellPrice = getJarSellPrice(crop);
  const kegSellPrice = getKegSellPrice(crop);
  if (jarSellPrice > crop.sellPrice || kegSellPrice > crop.sellPrice) {
    if (jarSellPrice >= kegSellPrice) {
      return 'jar';
    }
    return 'keg';
  }
  return 'none';
};

const getProcessingAdjustedSellPrice = crop => {
  if (crop.processing === 'jar') {
    return getJarSellPrice(crop);
  } else if (crop.processing === 'keg') {
    return getKegSellPrice(crop);
  }
  return crop.sellPrice;
};

const getHarvests = ({ seasons, growth, regrowth }) => {
  const daysForGrowth = seasons * 28 - 1;
  const daysAfterGrowth = daysForGrowth - growth;
  return 1 + Math.floor(daysAfterGrowth / (regrowth || growth));
};

const getProcessingTime = ({ category, processing, kegTime }) => {
  if (processing === 'none') {
    return 0;
  } else if (processing === 'jar') {
    return 3;
  } else if (kegTime) {
    return kegTime;
  } else if (category === 'fruit') {
    return 7;
  } else if (category === 'veg') {
    return 4;
  }
  return 0;
};

export const createCrop = (
  season,
  fertilizerName,
  processing,
  time
) => baseCrop => {
  const fertilizer = FERTILIZERS[fertilizerName];
  const crop = { ...baseCrop };

  if (!crop.seedPrice) {
    crop.seedPrice = Math.floor(crop.sellPrice / SEED_MAKER_AVERAGE_YIELD);
  }

  crop.processing = pickProcessing(crop, processing);
  crop.sellPrice = getProcessingAdjustedSellPrice(crop);
  crop.growth = Math.floor(crop.growth * fertilizer.speed);

  if (season) {
    // Seasonal
    crop.harvests = getHarvests(crop);
    crop.revenue = crop.sellPrice * crop.yield * crop.harvests;
    const plantings = crop.regrowth ? 1 : crop.harvests;
    const fertilizers = crop.regrowth ? 1 : crop.seasons;
    crop.costs = crop.seedPrice * plantings + fertilizer.cost * fertilizers;
    crop.growthTime = crop.seasons * 28;
    crop.processingTime = crop.harvests * crop.yield * getProcessingTime(crop);
  } else {
    // Greenhouse
    crop.revenue = crop.sellPrice * crop.yield;
    // Amortized cost of infinte regrowth is 0.
    crop.costs = crop.regrowth
      ? 0
      : crop.seedPrice + (fertilizer.cost * crop.growth) / 28;
    crop.growthTime = crop.regrowth || crop.growth;
    crop.processingTime = crop.yield * getProcessingTime(crop);
  }

  if (time === 'growth') {
    crop.time = crop.growthTime;
  } else if (time === 'processing') {
    crop.time = crop.processingTime;
  } else {
    crop.time = crop.growthTime + crop.processingTime;
  }

  crop.profit = crop.revenue - crop.costs;
  crop.gPerDay = crop.profit / crop.time;

  return crop;
};

export const growsInSeason = season => crop => {
  if (!season) {
    return true;
  }
  return season >= crop.season && season < crop.season + crop.seasons;
};
