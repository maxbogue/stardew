<template>
  <div :class="$style.container">
    <div :class="$style.card">
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
          <div>Speed-Gro</div>
          <select v-model="fertilizer">
            <option value="none">None</option>
            <option value="speedGro">Speed-Gro</option>
            <option value="deluxeSpeedGro">Deluxe Speed-Gro</option>
          </select>
        </label>
        <label>
          <div>Processing</div>
          <select v-model="processing">
            <option value="none">None</option>
            <option value="jar">Jar</option>
            <option value="keg">Keg</option>
            <option value="either">Either</option>
          </select>
        </label>
      </div>
    </div>
    <div :class="[$style.card, $style.crops]">
      <h2 :class="$style.cropsHeader">
        <span>Crop</span>
        <span>g/day</span>
      </h2>
      <crop
        v-for="crop in sortedCrops"
        :crop="crop"
        :season-name="seasonName"
        :max-g-per-day="sortedCrops[0].gPerDay"
        :key="crop.key"
      />
    </div>
    <div :class="$style.card">
      <ul :class="$style.notes">
        <li>
          Multi-season crops are calculated assuming they are planted for all
          their seasons.
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
          The "Either" processing setting only displays the most valuable
          option.
        </li>
        <li>
          Time involved in jar/keg processing is ignored.
        </li>
        <li>
          The existence of higher quality crops and farming skills are ignored
          since they affect crops almost the same.
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { sortBy } from 'lodash/fp';

import Crop from './Crop.vue';
import baseCrops from './crops.json';
import { createCrop, growsInSeason } from './crop';

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
    baseCrops,
    seasonName: 'spring',
    fertilizer: 'none',
    processing: 'none',
  }),
  computed: {
    season() {
      return seasonFromName(this.seasonName);
    },
    crops() {
      return this.baseCrops.map(
        createCrop(this.season, this.fertilizer, this.processing)
      );
    },
    filteredCrops() {
      return this.crops.filter(growsInSeason(this.season));
    },
    sortedCrops() {
      return sortBy('gPerDay', this.filteredCrops).reverse();
    },
  },
  methods: {},
};
</script>

<style lang="scss" module>
.container {
  margin: 1em auto 0;
  max-width: 820px;
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

    @media (max-width: 450px) {
      min-width: 100%;
    }
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
</style>
