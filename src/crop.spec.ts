import { createCrop } from '@/crop';
import crops from '@/crops.json';
import { BaseCrop, Options, SkipProcessing, TimeOption } from '@/types';
import { twoDecimals } from '@/utils';

const BASE_OPTIONS: Options = {
  season: 1,
  fertilizer: {
    cost: 0,
    speed: 1,
    quality: 0,
  },
  processing: 'none',
  time: TimeOption.Combined,
  level: 10,
  skipProcessing: SkipProcessing.None,
};

const getGPerDay = (options: Partial<Options>, crop: BaseCrop): string =>
  twoDecimals(
    createCrop(
      {
        ...BASE_OPTIONS,
        ...options,
      },
      crop
    ).gPerDay
  );

describe('createCrop for Ancient Fruit', () => {
  const crop = crops.find(x => x.name === 'Ancient Fruit') as BaseCrop;
  const cases: Array<{ options: Partial<Options>; gPerDay: string }> = [
    { options: {}, gPerDay: '65.88' },
    { options: { level: 1 }, gPerDay: '51.18' },
    { options: { level: 5 }, gPerDay: '60.98' },
    { options: { processing: 'keg' }, gPerDay: '130.92' },
    { options: { processing: 'jar' }, gPerDay: '117.74' },
    { options: { processing: 'best' }, gPerDay: '130.92' },
    { options: { season: 0 }, gPerDay: '102.67' },
    {
      options: { processing: 'best', time: TimeOption.Growth },
      gPerDay: '219.25',
    },
    {
      options: { processing: 'best', time: TimeOption.Processing },
      gPerDay: '524.92',
    },
    {
      options: { processing: 'best', skipProcessing: SkipProcessing.Gold },
      gPerDay: '124.50',
    },
    {
      options: { processing: 'best', skipProcessing: SkipProcessing.Starred },
      gPerDay: '107.84',
    },
  ];

  cases.forEach(({ options, gPerDay }) => {
    it(JSON.stringify(options), () => {
      expect(getGPerDay(options, crop)).toEqual(gPerDay);
    });
  });
});

describe('createCrop for Coffee Bean', () => {
  const crop = crops.find(x => x.name === 'Coffee Bean') as BaseCrop;
  const cases: Array<{ options: Partial<Options>; gPerDay: string }> = [
    { options: {}, gPerDay: '28.62' },
    { options: { level: 1 }, gPerDay: '25.00' },
    { options: { level: 5 }, gPerDay: '28.04' },
    { options: { processing: 'keg' }, gPerDay: '67.17' },
    { options: { processing: 'jar' }, gPerDay: '-0.05' },
    { options: { processing: 'best' }, gPerDay: '67.17' },
    { options: { season: 0 }, gPerDay: '34.55' },
    {
      options: { processing: 'best', time: TimeOption.Growth },
      gPerDay: '69.98',
    },
    {
      options: { processing: 'best', time: TimeOption.Processing },
      gPerDay: '1,673.48',
    },
    {
      options: { processing: 'best', skipProcessing: SkipProcessing.Gold },
      gPerDay: '65.86',
    },
    {
      options: { processing: 'best', skipProcessing: SkipProcessing.Starred },
      gPerDay: '63.22',
    },
  ];

  cases.forEach(({ options, gPerDay }) => {
    it(JSON.stringify(options), () => {
      expect(getGPerDay(options, crop)).toEqual(gPerDay);
    });
  });
});

describe('createCrop for Hops', () => {
  const crop = crops.find(x => x.name === 'Hops') as BaseCrop;
  const cases: Array<{ options: Partial<Options>; gPerDay: string }> = [
    { options: {}, gPerDay: '18.35' },
    { options: { level: 1 }, gPerDay: '13.98' },
    { options: { level: 5 }, gPerDay: '16.89' },
    { options: { processing: 'keg' }, gPerDay: '116.07' },
    { options: { processing: 'jar' }, gPerDay: '29.74' },
    { options: { processing: 'best' }, gPerDay: '116.07' },
    { options: { season: 0 }, gPerDay: '32.67' },
    {
      options: { processing: 'best', time: TimeOption.Growth },
      gPerDay: '262.22',
    },
    {
      options: { processing: 'best', time: TimeOption.Processing },
      gPerDay: '208.24',
    },
    {
      options: { processing: 'best', skipProcessing: SkipProcessing.Gold },
      gPerDay: '106.35',
    },
    {
      options: { processing: 'best', skipProcessing: SkipProcessing.Starred },
      gPerDay: '83.44',
    },
  ];

  cases.forEach(({ options, gPerDay }) => {
    it(JSON.stringify(options), () => {
      expect(getGPerDay(options, crop)).toEqual(gPerDay);
    });
  });
});

describe('createCrop for Pumpkin', () => {
  const crop = crops.find(x => x.name === 'Pumpkin') as BaseCrop;
  const cases: Array<{ options: Partial<Options>; gPerDay: string }> = [
    { options: {}, gPerDay: '23.57' },
    { options: { level: 1 }, gPerDay: '17.00' },
    { options: { level: 5 }, gPerDay: '21.38' },
    { options: { processing: 'keg' }, gPerDay: '51.89' },
    { options: { processing: 'jar' }, gPerDay: '52.48' },
    { options: { processing: 'best' }, gPerDay: '52.48' },
    { options: { season: 0 }, gPerDay: '24.47' },
    {
      options: { processing: 'best', time: TimeOption.Growth },
      gPerDay: '67.26',
    },
    {
      options: { processing: 'best', time: TimeOption.Processing },
      gPerDay: '288.67',
    },
    {
      options: { processing: 'best', skipProcessing: SkipProcessing.Gold },
      gPerDay: '48.77',
    },
    {
      options: { processing: 'best', skipProcessing: SkipProcessing.Starred },
      gPerDay: '40.35',
    },
  ];

  cases.forEach(({ options, gPerDay }) => {
    it(JSON.stringify(options), () => {
      expect(getGPerDay(options, crop)).toEqual(gPerDay);
    });
  });
});

describe('createCrop for Starfruit', () => {
  const crop = crops.find(x => x.name === 'Starfruit') as BaseCrop;
  const cases: Array<{ options: Partial<Options>; gPerDay: string }> = [
    { options: {}, gPerDay: '42.97' },
    { options: { level: 1 }, gPerDay: '27.57' },
    { options: { level: 5 }, gPerDay: '37.83' },
    { options: { processing: 'keg' }, gPerDay: '134.15' },
    { options: { processing: 'jar' }, gPerDay: '107.27' },
    { options: { processing: 'best' }, gPerDay: '134.15' },
    { options: { season: 0 }, gPerDay: '44.62' },
    {
      options: { processing: 'best', time: TimeOption.Growth },
      gPerDay: '203.70',
    },
    {
      options: { processing: 'best', time: TimeOption.Processing },
      gPerDay: '590.00',
    },
    {
      options: { processing: 'best', skipProcessing: SkipProcessing.Gold },
      gPerDay: '123.40',
    },
    {
      options: { processing: 'best', skipProcessing: SkipProcessing.Starred },
      gPerDay: '98.48',
    },
  ];

  cases.forEach(({ options, gPerDay }) => {
    it(JSON.stringify(options), () => {
      expect(getGPerDay(options, crop)).toEqual(gPerDay);
    });
  });
});

describe('createCrop for Sweet Gem Berry', () => {
  const crop = crops.find(x => x.name === 'Sweet Gem Berry') as BaseCrop;
  const cases: Array<{ options: Partial<Options>; gPerDay: string }> = [
    { options: {}, gPerDay: '88.23' },
    { options: { level: 1 }, gPerDay: '57.43' },
    { options: { level: 5 }, gPerDay: '77.96' },
    { options: { processing: 'keg' }, gPerDay: '-56.96' },
    { options: { processing: 'jar' }, gPerDay: '-51.27' },
    { options: { processing: 'best' }, gPerDay: '88.23' },
    { options: { season: 0 }, gPerDay: '99.26' },
    {
      options: { processing: 'best', time: TimeOption.Growth },
      gPerDay: '88.23',
    },
    {
      options: { processing: 'best', time: TimeOption.Processing },
      gPerDay: '0.00',
    },
    {
      options: { processing: 'best', skipProcessing: SkipProcessing.Gold },
      gPerDay: '88.23',
    },
    {
      options: { processing: 'best', skipProcessing: SkipProcessing.Starred },
      gPerDay: '88.23',
    },
  ];

  cases.forEach(({ options, gPerDay }) => {
    it(JSON.stringify(options), () => {
      expect(getGPerDay(options, crop)).toEqual(gPerDay);
    });
  });
});
