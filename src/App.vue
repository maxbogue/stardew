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
    <h2>{{ seasonName | capitalize }} g/day</h2>
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
        The existence of higher quality crops and farming skills are ignored
        because they always affect crops proportionally.
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
  margin: 0 auto 20px;
  width: 820px;

  > * {
    margin-top: 1em;
  }
}

.card {
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12);
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
    border-radius: 0;
    font-size: 1em;
    width: 100%;
  }
}

.crops {
  overflow: auto;
  padding: 0 4px;
}

.notes {
}
</style>
