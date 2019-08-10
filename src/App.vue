<template>
  <form :class="$style.container" @submit.prevent="render">
    <div :class="$style.controls">
      <crop />
      <md-field>
        <label>Row Height</label>
        <md-input type="number" v-model.number="rowHeight" />
      </md-field>
      <md-field>
        <label>Number of Rows</label>
        <md-input type="number" v-model.number="numRows" />
      </md-field>
      <md-field>
        <label>Bars Per Row</label>
        <md-input type="number" v-model.number="barsPerRow" />
      </md-field>
      <md-field>
        <label>Samples Per Bar</label>
        <md-input type="number" v-model.number="samplesPerBar" />
      </md-field>
      <md-field>
        <label>Row Spacing</label>
        <md-input type="number" v-model.number="rowSpacing" />
      </md-field>
    </div>
    <div :class="$style.display">
      <div :class="$style.row">
        <load-audio
          :num-bars="numBars"
          :samples-per-bar="samplesPerBar"
          @update="updatePeaks"
          @progress="updatePeaksProgress"
        />
        <md-button type="submit" class="md-raised md-primary" :disabled="!peaks"
          >Render</md-button
        >
      </div>
      <md-progress-bar
        v-if="peaksProgress >= 0"
        md-mode="buffer"
        :md-value="renderProgress"
        :md-buffer="peaksProgress"
      />
      <waveform
        :can-download-svg="true"
        :peaks="peaks"
        :num-rows="numRows"
        :row-height="rowHeight"
        :bars-per-row="barsPerRow"
        :row-spacing="rowSpacing"
        :render-signal="renderSignal"
        @progress="updateRenderProgress"
      />
    </div>
  </form>
</template>

<script>
import Crop from './Crop.vue';
import baseCrops from './crops.json';

export default {
  components: {
    Crop,
  },
  data: () => ({
    crops: baseCrops,
  }),
  computed: {},
  methods: {},
};
</script>

<style lang="scss" module>
.container {
  margin: 20px auto;
  width: 820px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.controls {
  width: 200px;
}

.display {
  width: 600px;
}

.row {
  display: flex;
  align-items: center;

  > :first-child {
    margin: 0 20px 20px 0;
  }

  > :last-child {
    margin: 0 0 20px 20px;
  }
}
</style>
