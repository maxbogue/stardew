import curry from 'lodash/fp/curry';

import { Crop, Processing, Season, SkipProcessing } from '@/types';

const SEED_MAKER_AVERAGE_YIELD = 2 * 0.975;

const getJarSellPrice = ({ category, sellPrice }): number =>
  category === 'other' ? 0 : sellPrice * 2 + 50;

const getKegSellPrice = ({ category, sellPrice, kegSellPrice }): number => {
  if (kegSellPrice) {
    return kegSellPrice;
  } else if (category === 'fruit') {
    return sellPrice * 3;
  } else if (category === 'veg') {
    return sellPrice * 2.25;
  }
  return 0;
};

const pickProcessing = (options, crop): Processing => {
  if (options.processing !== 'best') {
    return options.processing;
  }

  const jarCrop = _createCrop({ ...options, processing: 'jar' }, crop);
  const kegCrop = _createCrop({ ...options, processing: 'keg' }, crop);
  const noneCrop = _createCrop({ ...options, processing: 'none' }, crop);
  if (
    jarCrop.gPerDay > noneCrop.gPerDay ||
    kegCrop.gPerDay > noneCrop.gPerDay
  ) {
    if (jarCrop.gPerDay >= kegCrop.gPerDay) {
      return Processing.Jar;
    }
    return Processing.Keg;
  }
  return Processing.None;
};

const getArtisanSellPrice = (crop): number => {
  if (crop.processing === Processing.Jar) {
    return getJarSellPrice(crop);
  } else if (crop.processing === Processing.Keg) {
    return getKegSellPrice(crop);
  }
  throw new Error(`Invalid processing: ${crop.processing}`);
};

const getHarvests = ({ season }, { seasons, growth, regrowth }): number => {
  if (!season) {
    return 1; // Greenhouse
  }
  const daysForGrowth = seasons * 28 - 1;
  const daysAfterGrowth = daysForGrowth - growth;
  return 1 + Math.floor(daysAfterGrowth / (regrowth || growth));
};

const getProcessingTime = ({ category, processing, kegTime }): number => {
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

// Formula taken from https://stardewvalleywiki.com/Farming:
// P(gold) = 0.01 + 0.2 * (lvl/10 + q * (lvl+2)/12)
// P(silver) = MIN(2*P(gold),0.75) * (1-P(gold))
// P(normal) = 1 - P(silver) - P(gold,
const getCropQualityProbabilities = ({ level, fertilizer }): number[] => {
  const pGold =
    0.01 + 0.2 * (level / 10 + (fertilizer.quality * (level + 2)) / 12);
  const pSilver = Math.min(2 * pGold, 0.75) * (1 - pGold);
  const pNormal = 1 - pSilver - pGold;
  return [pNormal, pSilver, pGold];
};

const getRevenue = (options, crop): number => {
  const [pNormal, pSilver, pGold] = getCropQualityProbabilities(options);
  const normalYield =
    crop.harvests * pNormal + crop.harvests * (crop.yield - 1);
  const silverYield = crop.harvests * pSilver;
  const goldYield = crop.harvests * pGold;

  const normalValue = normalYield * crop.sellPrice;
  const silverValue = silverYield * crop.sellPrice * 1.25;
  const goldValue = goldYield * crop.sellPrice * 1.5;

  if (crop.processing === Processing.None) {
    crop.artisanYield = 0;
    return normalValue + silverValue + goldValue;
  } else if (options.skipProcessing === SkipProcessing.Starred) {
    crop.artisanYield = normalYield;
    return silverValue + goldValue + crop.artisanYield * crop.artisanSellPrice;
  } else if (options.skipProcessing === SkipProcessing.Gold) {
    crop.artisanYield = normalYield + silverYield;
    return goldValue + crop.artisanYield * crop.artisanSellPrice;
  } else if (options.skipProcessing === SkipProcessing.None) {
    crop.artisanYield = normalYield + silverYield + goldYield;
    return crop.artisanYield * crop.artisanSellPrice;
  }
  throw new Error('Unreachable.');
};

function _createCrop(options, baseCrop): Crop {
  const crop = { ...baseCrop };

  if (!crop.seedPrice) {
    crop.seedPrice = Math.floor(crop.sellPrice / SEED_MAKER_AVERAGE_YIELD);
  }

  crop.processing = pickProcessing(options, crop);
  if (crop.processing !== 'none') {
    const artisanMultiplier = options.level >= 10 ? 1.4 : 1;
    crop.artisanSellPrice = getArtisanSellPrice(crop) * artisanMultiplier;
  }
  crop.sellPrice *= options.level >= 5 ? 1.1 : 1;
  crop.growth = Math.floor(crop.growth * options.fertilizer.speed);

  crop.harvests = getHarvests(options, crop);
  crop.revenue = getRevenue(options, crop);
  crop.processingTime = crop.artisanYield * getProcessingTime(crop);

  if (options.season) {
    // Seasonal
    const plantings = crop.regrowth ? 1 : crop.harvests;
    const fertilizers = crop.regrowth ? 1 : crop.seasons;
    crop.costs =
      crop.seedPrice * plantings + options.fertilizer.cost * fertilizers;
    crop.growthTime = crop.seasons * 28 - 1;
  } else {
    // Greenhouse
    // Amortized cost of infinte regrowth is 0.
    crop.costs = crop.regrowth
      ? 0
      : crop.seedPrice + (options.fertilizer.cost * crop.growth) / 28;
    crop.growthTime = crop.regrowth || crop.growth;
  }

  if (options.time === 'growth') {
    crop.time = crop.growthTime;
  } else if (options.time === 'processing') {
    crop.time = crop.processingTime;
  } else {
    crop.time = crop.growthTime + crop.processingTime;
  }

  crop.profit = crop.revenue - crop.costs;
  crop.gPerDay = crop.time ? crop.profit / crop.time : 0;

  return crop;
}

export const createCrop = curry(_createCrop);

export const growsInSeason = (season: Season) => (crop: Crop): boolean => {
  if (!season) {
    return true;
  }
  return season >= crop.season && season < crop.season + crop.seasons;
};
