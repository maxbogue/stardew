<template>
  <div :class="['container', `container--${seasonName}`]">
    <header class="card">
      <h1>Stardew Crops</h1>
      <div class="controls">
        <label>
          <div>Season</div>
          <select v-model="seasonName">
            <option value="spring">Spring</option>
            <option value="summer">Summer</option>
            <option value="fall">Fall</option>
            <option value="greenhouse">Greenhouse</option>
          </select>
        </label>
        <label>
          <div>Farming Level</div>
          <select v-model="level">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5 (Tiller)</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10 (Artisan)</option>
          </select>
        </label>
        <label>
          <div>Fertilizer</div>
          <select v-model="fertilizer">
            <option value="none">None</option>
            <option value="speed">Speed-Gro</option>
            <option value="deluxe">Deluxe Speed-Gro</option>
            <option value="basic">Basic Fertilizer</option>
            <option value="quality">Quality Fertilizer</option>
          </select>
        </label>
        <label>
          <div>Processing</div>
          <select v-model="processing">
            <option value="none">None</option>
            <option value="best">Most Profitable</option>
            <option value="jar">Jar</option>
            <option value="keg">Keg</option>
          </select>
        </label>
        <transition
          name="flex"
          enter-class="flex-enter"
          enter-active-class="flex-active"
          enter-to-class="flex-leave"
          leave-class="flex-leave"
          leave-active-class="flex-active"
          leave-to-class="flex-enter"
        >
          <label v-if="processing !== 'none'">
            <div>Time</div>
            <select v-model="timeOption">
              <option value="combined">Growth + Processing</option>
              <option value="growth">Growth</option>
              <option value="processing">Processing</option>
            </select>
          </label>
        </transition>
        <transition
          name="flex"
          enter-class="flex-enter"
          enter-active-class="flex-active"
          enter-to-class="flex-leave"
          leave-class="flex-leave"
          leave-active-class="flex-active"
          leave-to-class="flex-enter"
        >
          <label v-if="processing !== 'none'">
            <div>Skip Processing</div>
            <select v-model="skipProcessing">
              <option value="none">None</option>
              <option value="gold">Gold</option>
              <option value="starred">Gold + Silver</option>
            </select>
          </label>
        </transition>
      </div>
    </header>
    <main class="card crops">
      <h2 class="crops-header">
        <span>Crop</span>
        <span>g/day</span>
      </h2>
      <Crop
        v-for="crop in sortedCrops"
        :crop="crop"
        :season-name="seasonName"
        :processing="processing"
        :time="time"
        :max-g-per-day="sortedCrops[0].gPerDay"
        :key="crop.name"
      />
    </main>
    <footer class="card">
      <ul class="notes">
        <li>
          Multi-season crops are calculated assuming they are planted for all
          their seasons.
        </li>
        <li>
          The entirety of the season's growth time is counted even if some days
          are unused by the crop.
        </li>
        <li>
          Prices for seeds and fertilizers are based on the cheapest option
          between Pierre's and Oasis.
        </li>
        <li>
          If seeds cannot be regularly bought, their price is calculated based
          on a normal crop in the seed maker.
        </li>
        <li>
          Greenhouse values ignore the initial growth period of crops with
          regrowth since they last forever.
        </li>
      </ul>
      <div class="footer">
        <a href="https://www.stardewvalley.net/" target="_blank" rel="noopener"
          >Stardew Valley v1.3.36</a
        >
        &copy;
        <a
          href="https://twitter.com/concernedape"
          target="_blank"
          rel="noopener"
          >ConcernedApe</a
        >
        | Code v{{ VERSION }} on
        <a
          href="https://github.com/maxbogue/stardew"
          target="_blank"
          rel="noopener"
          >Github</a
        >
        | Made using
        <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue</a>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import sortBy from 'lodash/fp/sortBy';
import type { Ref } from 'vue';
import { computed, defineComponent, getCurrentInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { createCrop, growsInSeason } from './crop';
import CropComponent from './Crop.vue';
import baseCrops from './crops.json';
import type {
  BaseCrop,
  Crop,
  Fertilizer,
  Options,
  ProcessingOption,
} from './types';
import {
  SkipProcessing,
  TimeOption,
} from './types';

declare global {
  const VERSION: string;
}

const FERTILIZERS: { [key: string]: Fertilizer } = {
  none: {
    cost: 0,
    speed: 1,
    quality: 0,
  },
  speed: {
    cost: 100,
    speed: 0.9,
    quality: 0,
  },
  deluxe: {
    cost: 80,
    speed: 0.75,
    quality: 0,
  },
  basic: {
    cost: 100,
    speed: 1,
    quality: 1,
  },
  quality: {
    cost: 150,
    speed: 1,
    quality: 2,
  },
};

function useQueryParam(queryParam: string, defaultValue = ''): Ref<string> {
  const vm = getCurrentInstance();
  if (!vm) {
    throw Error('Must be called from inside setup()!');
  }
  const router = useRouter();
  const route = useRoute();
  return computed<string>({
    get(): string {
      const value = route.query[queryParam] as string | undefined;
      return value !== undefined ? value : defaultValue;
    },
    set(newValue: string): void {
      router.replace({
        path: route.path,
        query: {
          ...route.query,
          [queryParam]: newValue === defaultValue ? undefined : newValue,
        },
      });
    },
  });
}

const seasonFromName = (seasonName: string): number =>
  ['greenhouse', 'spring', 'summer', 'fall'].indexOf(seasonName);

export default defineComponent({
  components: {
    Crop: CropComponent,
  },
  setup() {
    return {
      VERSION: VERSION,
      baseCrops: baseCrops as BaseCrop[],
      seasonName: useQueryParam('season', 'spring'),
      fertilizer: useQueryParam('fertilizer', 'none'),
      processing: useQueryParam('processing', 'none'),
      timeOption: useQueryParam('time', 'combined'),
      level: useQueryParam('level', '10'),
      skipProcessing: useQueryParam('skip', 'none'),
    };
  },
  computed: {
    time(): string {
      return this.processing === 'none' ? 'growth' : this.timeOption;
    },
    season(): number {
      return seasonFromName(this.seasonName);
    },
    options(): Options {
      return {
        season: this.season,
        fertilizer: FERTILIZERS[this.fertilizer] as Fertilizer,
        processing: this.processing as ProcessingOption,
        time: this.time as TimeOption,
        level: parseInt(this.level),
        skipProcessing: this.skipProcessing as SkipProcessing,
      };
    },
    crops(): Crop[] {
      return this.baseCrops.map(createCrop(this.options));
    },
    filteredCrops(): Crop[] {
      return this.crops
        .filter(growsInSeason(this.season))
        .filter((crop: Crop) => crop.gPerDay > 0);
    },
    sortedCrops(): Crop[] {
      return sortBy('gPerDay', this.filteredCrops).reverse();
    },
  },
});
</script>

<style lang="scss">
.container {
  margin: 1em auto 0;
  max-width: 820px;

  &--greenhouse {
    --season-color: hsla(88, 50%, 67%, 0.5);
    --season-color-dark: hsla(88, 50%, 67%, 0.7);
  }

  &--spring {
    --season-color: hsla(340, 82%, 76%, 0.5);
    --season-color-dark: hsla(340, 82%, 76%, 0.7);
  }

  &--summer {
    --season-color: hsla(202, 92%, 74%, 0.5);
    --season-color-dark: hsla(202, 92%, 74%, 0.7);
  }

  &--fall {
    --season-color: hsla(36, 100%, 65%, 0.5);
    --season-color-dark: hsla(36, 100%, 65%, 0.7);
  }
}

.card {
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12);
  margin-bottom: 1em;
  background-color: #fff;

  h1 {
    font-size: 2em;
    font-weight: 400;
    padding: 1rem 1rem 0.5rem;
    margin: 0;
    text-align: center;
  }

  h2 {
    font-size: 1.5em;
    font-weight: 400;
    display: flex;
    margin: 4px;
  }
}

.controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0.5em;

  > * {
    flex: 1;
    padding: 0.5em;
    max-width: 33.3%;
    min-width: 33.3%;
  }

  label > div {
    font-size: 0.8em;
    margin: 0 4px 4px;
  }

  select {
    font-size: 1em;
    font-weight: 500;
    width: 100%;
  }

  @media (max-width: 450px) {
    flex-direction: column;

    > * {
      max-width: 100%;
    }
  }
}

.crops-header {
  display: flex;
  justify-content: space-between;
}

.crops {
  overflow: auto;
  padding: 0 4px;
}

.notes {
  margin: 0;
  padding: 0.5em 0.5em 0.5em 2em;
  line-height: 1.4;
}

.footer {
  padding: 0.5em;
  font-size: 12px;
  text-align: center;

  a {
    color: #1565c0;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.flex-active {
  overflow: hidden;
  white-space: nowrap;
  transition: all 0.4s;
}

.flex-enter {
  flex: 0.01;
  flex: 0.00001;
  min-width: 0%;
}

.flex-leave {
  flex: 1;
}
</style>
