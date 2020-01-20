import curry from 'lodash/fp/curry';

import {
  BaseCrop,
  Category,
  Crop,
  Options,
  Processing,
  Season,
  SkipProcessing,
  TimeOption,
} from '@/types';

const SEED_MAKER_AVERAGE_YIELD = 2 * 0.975;

const getJarSellPrice = ({ category, sellPrice }: BaseCrop): number =>
  category === Category.Other ? 0 : sellPrice * 2 + 50;

function getKegSellPrice({
  category,
  sellPrice,
  kegSellPrice,
}: BaseCrop): number {
  if (kegSellPrice) {
    return kegSellPrice;
  } else if (category === Category.Fruit) {
    return sellPrice * 3;
  } else if (category === Category.Veg) {
    return sellPrice * 2.25;
  }
  return 0;
}

function pickProcessing(options: Options, crop: BaseCrop): Processing {
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
      return 'jar';
    }
    return 'keg';
  }
  return 'none';
}

function getHarvests(
  { season }: Options,
  { seasons, growth, regrowth }: BaseCrop
): number {
  if (!season) {
    return 1; // Greenhouse
  }
  const daysForGrowth = seasons * 28 - 1;
  const daysAfterGrowth = daysForGrowth - growth;
  return 1 + Math.floor(daysAfterGrowth / (regrowth || growth));
}

function getProcessingTime(
  { category, kegTime }: BaseCrop,
  processing: Processing
): number {
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
}

// Formula taken from https://stardewvalleywiki.com/Farming:
// P(gold) = 0.01 + 0.2 * (lvl/10 + q * (lvl+2)/12)
// P(silver) = MIN(2*P(gold),0.75) * (1-P(gold))
// P(normal) = 1 - P(silver) - P(gold,
function getCropQualityProbabilities({ level, fertilizer }: Options): number[] {
  const pGold =
    0.01 + 0.2 * (level / 10 + (fertilizer.quality * (level + 2)) / 12);
  const pSilver = Math.min(2 * pGold, 0.75) * (1 - pGold);
  const pNormal = 1 - pSilver - pGold;
  return [pNormal, pSilver, pGold];
}

function getRevenue(
  options: Options,
  crop: BaseCrop,
  processing: Processing,
  harvests: number
): [number, number] {
  const [pNormal, pSilver, pGold] = getCropQualityProbabilities(options);

  const normalYield = harvests * pNormal + harvests * (crop.yield - 1);
  const silverYield = harvests * pSilver;
  const goldYield = harvests * pGold;

  const normalValue = normalYield * crop.sellPrice;
  const silverValue = silverYield * crop.sellPrice * 1.25;
  const goldValue = goldYield * crop.sellPrice * 1.5;

  if (processing === 'none') {
    return [normalValue + silverValue + goldValue, 0];
  } else if (options.skipProcessing === SkipProcessing.Starred) {
    return [silverValue + goldValue, normalYield];
  } else if (options.skipProcessing === SkipProcessing.Gold) {
    return [goldValue, normalYield + silverYield];
  } else if (options.skipProcessing === SkipProcessing.None) {
    return [0, normalYield + silverYield + goldYield];
  }
  throw new Error('Unreachable.');
}

function getArtisanSellPrice(
  options: Options,
  crop: BaseCrop,
  processing: Processing
): number {
  const artisanMultiplier = options.level >= 10 ? 1.4 : 1;
  if (processing === 'jar') {
    return getJarSellPrice(crop) * artisanMultiplier;
  } else if (processing === 'keg') {
    return getKegSellPrice(crop) * artisanMultiplier;
  }
  return 0;
}

function getCosts(options: Options, crop: BaseCrop, harvests: number): number {
  if (options.season) {
    // Seasonal
    const plantings = crop.regrowth ? 1 : harvests;
    const fertilizers = crop.regrowth ? 1 : crop.seasons;
    return crop.seedPrice * plantings + options.fertilizer.cost * fertilizers;
  }
  // Greenhouse
  // Amortized cost of infinte regrowth is 0.
  return crop.regrowth
    ? 0
    : crop.seedPrice + (options.fertilizer.cost * crop.growth) / 28;
}

function getTime(
  time: TimeOption,
  growthTime: number,
  processingTime: number
): number {
  if (time === TimeOption.Growth) {
    return growthTime;
  } else if (time === TimeOption.Processing) {
    return processingTime;
  }
  return growthTime + processingTime;
}

function _createCrop(options: Options, baseCrop: BaseCrop): Crop {
  const crop = { ...baseCrop };

  if (!crop.seedPrice) {
    crop.seedPrice = Math.floor(crop.sellPrice / SEED_MAKER_AVERAGE_YIELD);
  }

  const processing = pickProcessing(options, crop);
  const artisanSellPrice = getArtisanSellPrice(options, crop, processing);
  crop.sellPrice *= options.level >= 5 ? 1.1 : 1;
  crop.growth = Math.floor(crop.growth * options.fertilizer.speed);

  const harvests = getHarvests(options, crop);
  const [nonArtisanValue, artisanYield] = getRevenue(
    options,
    crop,
    processing,
    harvests
  );
  const revenue = nonArtisanValue + artisanYield * artisanSellPrice;
  const costs = getCosts(options, crop, harvests);

  const growthTime = options.season
    ? crop.seasons * 28 - 1
    : crop.regrowth || crop.growth;
  const processingTime = artisanYield * getProcessingTime(crop, processing);
  const time = getTime(options.time, growthTime, processingTime);

  const profit = revenue - costs;
  const gPerDay = time ? profit / time : 0;

  return {
    ...crop,
    processing,
    harvests,
    artisanYield,
    artisanSellPrice,
    revenue,
    processingTime,
    costs,
    growthTime,
    time,
    profit,
    gPerDay,
  };
}

export const createCrop = curry(_createCrop);

export const growsInSeason = (season: Season) => (crop: Crop): boolean => {
  if (!season) {
    return true;
  }
  return season >= crop.season && season < crop.season + crop.seasons;
};
