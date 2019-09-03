<template>
  <div :class="[$style.container, $style['container--' + seasonName]]">
    <header :class="$style.card">
      <h1>Stardew Crops</h1>
      <div :class="$style.controls">
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
            <option value="speedGro">Speed-Gro</option>
            <option value="deluxeSpeedGro">Deluxe Speed-Gro</option>
            <option value="basicFertilizer">Basic Fertilizer</option>
            <option value="qualityFertilizer">Quality Fertilizer</option>
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
          :enter-class="$style.flexEnter"
          :enter-active-class="$style.flexActive"
          :enter-to-class="$style.flexLeave"
          :leave-class="$style.flexLeave"
          :leave-active-class="$style.flexActive"
          :leave-to-class="$style.flexEnter"
        >
          <label v-if="processing !== 'none'">
            <div>Time</div>
            <select v-model="time">
              <option value="combined">Growth + Processing</option>
              <option value="growth">Growth</option>
              <option value="processing">Processing</option>
            </select>
          </label>
        </transition>
        <transition
          name="flex"
          :enter-class="$style.flexEnter"
          :enter-active-class="$style.flexActive"
          :enter-to-class="$style.flexLeave"
          :leave-class="$style.flexLeave"
          :leave-active-class="$style.flexActive"
          :leave-to-class="$style.flexEnter"
        >
          <label v-if="processing !== 'none'">
            <div>Skip Processing</div>
            <select v-model="processQualities">
              <option value="gold">None</option>
              <option value="silver">Gold</option>
              <option value="normal">Gold + Silver</option>
            </select>
          </label>
        </transition>
      </div>
    </header>
    <main :class="[$style.card, $style.crops]">
      <h2 :class="$style.cropsHeader">
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
    <footer :class="$style.card">
      <ul :class="$style.notes">
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
          between Pierre's, Joja, and Oasis.
        </li>
        <li>
          If seeds cannot be regularly bought, their price is calculated based
          on a normal crop in the seed maker.
        </li>
        <li>
          Greenhouse values ignore the initial growth period of crops with
          regrowth since they last forever.
        </li>
        <li>
          Keg processing time for Coffee Beans is set for 2 Coffee per day to be
          more realistic than the theoretical ~10.
        </li>
      </ul>
      <div :class="$style.footer">
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

<script>
/* globals VERSION */
import { sortBy } from 'lodash/fp';

import { createCrop, growsInSeason } from './crop';
import Crop from './Crop.vue';
import baseCrops from './crops.json';

const FERTILIZERS = {
  none: {
    cost: 0,
    speed: 1,
    quality: 0,
  },
  speedGro: {
    cost: 100,
    speed: 0.9,
    quality: 0,
  },
  deluxeSpeedGro: {
    cost: 80,
    speed: 0.75,
    quality: 0,
  },
  basicFertilizer: {
    cost: 100,
    speed: 1,
    quality: 1,
  },
  qualityFertilizer: {
    cost: 150,
    speed: 1,
    quality: 2,
  },
};

const seasonFromName = seasonName =>
  ['greenhouse', 'spring', 'summer', 'fall'].indexOf(seasonName);

export default {
  components: {
    Crop,
  },
  filters: {
    capitalize(value) {
      if (!value) {
        return '';
      }
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
  data: () => ({
    VERSION: VERSION,
    baseCrops,
    seasonName: 'spring',
    fertilizer: 'none',
    processing: 'none',
    time: 'growth',
    level: '10',
    processQualities: 'gold',
  }),
  computed: {
    season() {
      return seasonFromName(this.seasonName);
    },
    options() {
      return {
        season: this.season,
        fertilizer: FERTILIZERS[this.fertilizer],
        processing: this.processing,
        time: this.time,
        level: parseInt(this.level),
        processQualities: this.processQualities,
      };
    },
    crops() {
      return this.baseCrops.map(createCrop(this.options));
    },
    filteredCrops() {
      return this.crops
        .filter(growsInSeason(this.season))
        .filter(crop => crop.gPerDay > 0);
    },
    sortedCrops() {
      return sortBy('gPerDay', this.filteredCrops).reverse();
    },
  },
  watch: {
    processing() {
      if (this.processing === 'none') {
        this.time = 'growth';
      } else {
        this.time = 'combined';
      }
    },
  },
  methods: {},
};
</script>

<style lang="scss" module>
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

.cropsHeader {
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

.flexActive {
  overflow: hidden;
  white-space: nowrap;
  transition: all 0.4s;
}

.flexEnter {
  flex: 0.01;
  flex: 0.00001;
  min-width: 0%;
}

.flexLeave {
  flex: 1;
}
</style>
