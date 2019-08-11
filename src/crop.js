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

const getHarvests = ({ seasons, growth, regrowth }) => {
  const daysForGrowth = seasons * 28 - 1;
  const daysAfterGrowth = daysForGrowth - growth;
  return 1 + Math.floor(daysAfterGrowth / (regrowth || growth));
};

const getSeasonalGPerDay = (crop, fertilizer) => {
  const revenue = crop.sellPrice * crop.yield * crop.harvests;
  const plantings = crop.regrowth ? 1 : crop.harvests;
  const cost = crop.seedPrice * plantings + fertilizer.cost;
  return (revenue - cost) / (crop.seasons * 28);
};

const getGreenhouseGPerDay = (crop, fertilizer) => {
  const revenue = crop.sellPrice * crop.yield;
  // Amortized cost of infinte regrowth is 0.
  const cost = crop.regrowth ? 0 : crop.seedPrice + fertilizer.cost;
  return (revenue - cost) / (crop.regrowth || crop.growth);
};

export const processCrop = (season, fertilizerName, processing) => baseCrop => {
  const fertilizer = FERTILIZERS[fertilizerName];
  const crop = { ...baseCrop };

  if (processing === 'jar') {
    crop.sellPrice = getJarSellPrice(crop);
  } else if (processing === 'keg') {
    crop.sellPrice = getKegSellPrice(crop);
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

  if (!crop.seedPrice) {
    crop.seedPrice = crop.sellPrice / SEED_MAKER_AVERAGE_YIELD;
  }
  if (season && crop.seasons > 1) {
    crop.name += ` (${crop.seasons} seasons)`;
  }
  crop.growth = Math.floor(crop.growth * fertilizer.speed);
  if (season) {
    crop.harvests = getHarvests(crop);
    crop.gPerDay = getSeasonalGPerDay(crop, fertilizer);
  } else {
    crop.gPerDay = getGreenhouseGPerDay(crop, fertilizer);
  }
  return crop;
};

export const growsInSeason = season => crop => {
  if (!season) {
    return true;
  }
  return season >= crop.season && season < crop.season + crop.seasons;
};
