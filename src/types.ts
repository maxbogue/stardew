export enum Category {
  Veg = 'veg',
  Fruit = 'fruit',
  Other = 'other',
}

export interface Fertilizer {
  quality: number;
  speed: number;
  cost: number;
}

export enum Processing {
  None = 'none',
  Keg = 'keg',
  Jar = 'jar',
}

export enum SkipProcessing {
  None = 'none',
  Silver = 'silver',
  Gold = 'gold',
}

export enum ProcessingOptions {
  None = 'none',
  Keg = 'keg',
  Jar = 'jar',
  Best = 'best',
}

export enum Season {
  Greenhouse = 0,
  Spring = 1,
  Summer = 2,
  Fall = 3,
}

export interface BaseCrop {
  name: string;
  season: Season;
  category: Category;
  seedPrice: number;
  sellPrice: number;
  yield: number;
  growth: number;
  regrowth?: number;
  seasons: number;
  kegSellPrice?: number;
  kegTime?: number;
}

export interface Crop extends BaseCrop {
  processing: Processing;
  artisanYield?: number;
  artisanSellPrice?: number;
  harvests: number;
  revenue: number;
  processingTime: number;
  costs: number;
  growthTime: number;
  time: number;
  profit: number;
  gPerDay: number;
}

export interface Options {
  season: Season;
  fertilizer: Fertilizer;
  processing: Processing;
  time: number;
  level: number;
  skipProcessing: SkipProcessing;
}
