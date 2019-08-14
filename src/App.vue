<template>
  <div :class="$style.container">
    <div :class="[$style.controls, $style.card]">
      <label>
        <div>Season</div>
        <select v-model="seasonName">
          <option value="greenhouse">Greenhouse</option>
          <option value="spring">Spring</option>
          <option value="summer">Summer</option>
          <option value="fall">Fall</option>
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
    <div :class="$style.header">
      <span>Crop</span>
      <span>g/day</span>
    </div>
    <div :class="[$style.crops, $style.card]" class="md-elevation-4">
      <crop
        v-for="crop in sortedCrops"
        :crop="crop"
        :season-name="seasonName"
        :max-g-per-day="sortedCrops[0].gPerDay"
        :key="crop.name"
      />
    </div>
    <ul :class="$style.notes" class="md-elevation-4">
      <li>
        If seeds cannot be regularly bought, their price is calculated from a
        normal crop put in the seed maker.
      </li>
      <li>
        The existence of higher quality crops and farming skills are ignored.
      </li>
      <li>
        Time involved in jar/keg processing is ignored.
      </li>
    </ul>
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
    seasonName: 'greenhouse',
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
  width: 820px;
}

.card {
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12);
  margin-bottom: 1em;
}

.controls {
  display: flex;
  justify-content: space-between;
  padding: 0.5em;

  > * {
    flex: 1;
    margin: 0.5em;
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

.header {
  font-size: 1.5em;
  font-weight: 400;
  display: flex;
  margin: 1em 8px 4px;
  justify-content: space-between;
}

.crops {
  overflow: auto;
  padding: 0 4px;
}

.notes {
  margin: 1em;
  padding-left: 1em;
  line-height: 1.4;
}
</style>
