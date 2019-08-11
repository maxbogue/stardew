<template>
  <div :class="$style.container">
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
    <crop v-for="crop in sortedCrops" :crop="crop" :key="crop.name" />
    <ul>
      <li>
        If seeds cannot be regularly bought, their price is calculated from a
        normal crop put in the seed maker.
      </li>
      <li>
        The existence of higher quality crops and farming skills are ignored
        because they always affect crops proportionally.
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
  }),
  computed: {
    season() {
      return seasonFromName(this.seasonName);
    },
    crops() {
      return this.baseCrops.map(processCrop(this.season, this.fertilizer));
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
  margin: 20px auto;
  width: 820px;
}
</style>
