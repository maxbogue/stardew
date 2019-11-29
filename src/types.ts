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

export enum FertilizerOption {
  None = 'none',
  Speed = 'speed',
  Deluxe = 'deluxe',
  Basic = 'basic',
  Quality = 'quality',
}

export type Processing = 'none' | 'keg' | 'jar';

export enum SkipProcessing {
  None = 'none',
  Gold = 'gold',
  Starred = 'starred',
}

export type ProcessingOption = Processing | 'best';

export enum Season {
  Greenhouse = 0,
  Spring = 1,
  Summer = 2,
  Fall = 3,
}

export enum TimeOption {
  Growth = 'growth',
  // eslint-disable-next-line no-shadow
  Processing = 'processing',
  Combined = 'combined',
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
  artisanYield: number;
  artisanSellPrice: number;
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
  processing: ProcessingOption;
  time: TimeOption;
  level: number;
  skipProcessing: SkipProcessing;
}
