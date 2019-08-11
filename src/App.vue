<template>
  <div :class="$style.container">
    <div :class="$style.controls" class="md-elevation-4">
      <MdField>
        <label for="season">Season</label>
        <MdSelect v-model="seasonName" name="season" id="season">
          <MdOption value="greenhouse">Greenhouse</MdOption>
          <MdOption value="spring">Spring</MdOption>
          <MdOption value="summer">Summer</MdOption>
          <MdOption value="fall">Fall</MdOption>
        </MdSelect>
      </MdField>
      <MdField>
        <label for="speed-gro">Speed-Gro</label>
        <MdSelect v-model="fertilizer" name="speed-gro" id="speed-gro">
          <MdOption value="none">None</MdOption>
          <MdOption value="speedGro">Speed-Gro</MdOption>
          <MdOption value="deluxeSpeedGro">Deluxe Speed-Gro</MdOption>
        </MdSelect>
      </MdField>
      <MdField>
        <label for="processing">Processing</label>
        <MdSelect v-model="processing" name="processing" id="processing">
          <MdOption value="none">None</MdOption>
          <MdOption value="jar">Jar</MdOption>
          <MdOption value="keg">Keg</MdOption>
          <MdOption value="either">Either</MdOption>
        </MdSelect>
      </MdField>
    </div>
    <div :class="$style.crops" class="md-elevation-4">
      <crop
        v-for="crop in sortedCrops"
        :crop="crop"
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
import { growsInSeason, processCrop } from './crop';

const seasonFromName = seasonName =>
  ['greenhouse', 'spring', 'summer', 'fall'].indexOf(seasonName);

export default {
  components: {
    Crop,
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
        processCrop(this.season, this.fertilizer, this.processing)
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

.controls {
  display: flex;
  justify-content: space-between;
  padding: 1em;

  > * {
    margin: 1em;
  }
}

.crops {
  overflow: auto;
}

.notes {
}
</style>
