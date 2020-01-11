<template>
  <div :class="$style.crop">
    <div
      v-ripple.400="'rgba(255, 255, 255, 0.25)'"
      role="button"
      :aria-expanded="showInfo.toString()"
      :class="$style.bar"
      :style="barStyles"
      @click="showInfo = !showInfo"
    >
      <div>
        <span :class="$style.name">{{ crop.name }}</span>
        <span v-if="notes" :class="$style.notes">{{ notes }}</span>
      </div>
      <span>{{ crop.gPerDay | twoDecimals }}</span>
    </div>
    <Drawer :show="showInfo">
      <ul :class="$style.infos">
        <li :class="$style.info">
          <div>Seed Cost</div>
          <div>{{ crop.seedPrice | wholeNumber }}g</div>
        </li>
        <li :class="$style.info">
          <div>Sell Value</div>
          <div>{{ crop.sellPrice | wholeNumber }}g</div>
        </li>
        <li v-if="crop.artisanSellPrice" :class="$style.info">
          <div>Artisan Value</div>
          <div>{{ crop.artisanSellPrice | wholeNumber }}g</div>
        </li>
        <li v-if="!isGreenhouse || !crop.regrowth" :class="$style.info">
          <div>Growth</div>
          <div>{{ crop.growth | wholeNumber }} days</div>
        </li>
        <li v-if="crop.regrowth" :class="$style.info">
          <div>Regrowth</div>
          <div>{{ crop.regrowth | wholeNumber }} days</div>
        </li>
        <li v-if="!isGreenhouse" :class="$style.info">
          <div>Harvests</div>
          <div>{{ crop.harvests }}</div>
        </li>
        <li :class="$style.info">
          <div>Yield</div>
          <div>{{ crop.harvests * crop.yield }}</div>
        </li>
        <li :class="$style.info">
          <div>Revenue</div>
          <div>{{ crop.revenue | wholeNumber }}g</div>
        </li>
        <li :class="$style.info">
          <div>Costs</div>
          <div>{{ crop.costs | wholeNumber }}g</div>
        </li>
        <li :class="$style.info">
          <div>Profit</div>
          <div>{{ crop.profit | wholeNumber }}g</div>
        </li>
        <li v-if="time !== 'processing'" :class="$style.info">
          <div>Growth Time</div>
          <div>{{ crop.growthTime | wholeNumber }} days</div>
        </li>
        <li v-if="time !== 'growth'" :class="$style.info">
          <div>Processing Time</div>
          <div>{{ crop.processingTime | maxOneDecimal }} days</div>
        </li>
      </ul>
    </Drawer>
  </div>
</template>

<script>
import Drawer from './Drawer.vue';

export default {
  components: {
    Drawer,
  },
  filters: {
    wholeNumber(n) {
      return Math.round(n).toLocaleString();
    },
    twoDecimals(n) {
      return n.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
    maxOneDecimal(n) {
      return n.toLocaleString(undefined, {
        maximumFractionDigits: 1,
      });
    },
  },
  props: {
    crop: { type: Object, required: true },
    seasonName: { type: String, required: true },
    processing: { type: String, required: true },
    time: { type: String, required: true },
    maxGPerDay: { type: Number, required: true },
  },
  data: () => ({
    showInfo: false,
  }),
  computed: {
    isGreenhouse() {
      return this.seasonName === 'greenhouse';
    },
    notes() {
      const notes = [];
      if (this.processing === 'best') {
        notes.push(this.crop.processing);
      }
      if (!this.isGreenhouse && this.crop.seasons > 1) {
        notes.push(`${this.crop.seasons} seasons`);
      }
      return notes.join(', ');
    },
    barPercentage() {
      return (100 * this.crop.gPerDay) / this.maxGPerDay;
    },
    barStyles() {
      return {
        '--bar-width': `${this.barPercentage.toFixed(2)}%`,
      };
    },
  },
};
</script>

<style lang="scss" module>
.crop {
  margin: 4px 0;
}

.bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px;
  background-color: var(--season-color);
  font-size: 1.2em;

  &:hover {
    cursor: pointer;
    background-color: var(--season-color-dark);
  }

  &::before {
    content: '';
    background-color: var(--season-color);
    height: 100%;
    width: var(--bar-width);
    position: absolute;
    left: 0;
  }

  > * {
    z-index: 1;
  }
}

.name {
  white-space: nowrap;
}

.notes {
  font-size: 0.6em;
  text-transform: uppercase;
}

.infos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  margin: 0;
  padding: 4px 0 0;
  list-style: none;
}

.info {
  padding: 4px;

  > * {
    white-space: nowrap;
  }

  :first-child {
    font-size: 0.75em;
  }

  :last-child {
    font-size: 1.5em;
  }
}
</style>
