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

const adjustForProcessing = (crop, processing) => {
  if (processing === 'jar') {
    crop.sellPrice = getJarSellPrice(crop);
    crop.name += ' (jar)';
  } else if (processing === 'keg') {
    crop.sellPrice = getKegSellPrice(crop);
    crop.name += ' (keg)';
  } else if (processing === 'either') {
    const jarSellPrice = getJarSellPrice(crop);
    const kegSellPrice = getKegSellPrice(crop);
    if (jarSellPrice > crop.sellPrice || kegSellPrice > crop.sellPrice) {
      if (jarSellPrice >= kegSellPrice) {
        crop.sellPrice = jarSellPrice;
        crop.name += ' (jar)';
      } else {
        crop.sellPrice = kegSellPrice;
        crop.name += ' (keg)';
      }
    }
  }
};

const getHarvests = ({ seasons, growth, regrowth }) => {
  const daysForGrowth = seasons * 28 - 1;
  const daysAfterGrowth = daysForGrowth - growth;
  return 1 + Math.floor(daysAfterGrowth / (regrowth || growth));
};

const addSeasonalGPerDay = (crop, fertilizer) => {
  crop.harvests = getHarvests(crop);
  crop.revenue = crop.sellPrice * crop.yield * crop.harvests;
  const plantings = crop.regrowth ? 1 : crop.harvests;
  crop.costs = crop.seedPrice * plantings + fertilizer.cost;
  crop.profit = crop.revenue - crop.costs;
  crop.gPerDay = crop.profit / (crop.seasons * 28);
};

const addGreenhouseGPerDay = (crop, fertilizer) => {
  crop.revenue = crop.sellPrice * crop.yield;
  // Amortized cost of infinte regrowth is 0.
  crop.costs = crop.regrowth ? 0 : crop.seedPrice + fertilizer.cost;
  crop.gPerDay = (crop.revenue - crop.costs) / (crop.regrowth || crop.growth);
};

export const createCrop = (season, fertilizerName, processing) => baseCrop => {
  const fertilizer = FERTILIZERS[fertilizerName];
  const crop = { ...baseCrop };

  adjustForProcessing(crop, processing);

  if (!crop.seedPrice) {
    crop.seedPrice = Math.floor(crop.sellPrice / SEED_MAKER_AVERAGE_YIELD);
  }

  if (season && crop.seasons > 1) {
    crop.name += ` (${crop.seasons} seasons)`;
  }

  crop.growth = Math.floor(crop.growth * fertilizer.speed);

  if (season) {
    addSeasonalGPerDay(crop, fertilizer);
  } else {
    addGreenhouseGPerDay(crop, fertilizer);
  }

  return crop;
};

export const growsInSeason = season => crop => {
  if (!season) {
    return true;
  }
  return season >= crop.season && season < crop.season + crop.seasons;
};
