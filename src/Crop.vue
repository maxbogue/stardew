<template>
  <div class="crop">
    <div
      role="button"
      :aria-expanded="showInfo"
      class="bar"
      :style="barStyles"
      @click="showInfo = !showInfo"
    >
      <div>
        <span class="name">{{ crop.name }}</span>
        <span v-if="notes" class="notes">{{ notes }}</span>
      </div>
      <span>{{ twoDecimals(crop.gPerDay) }}</span>
    </div>
    <Drawer :show="showInfo">
      <ul class="infos">
        <li class="info">
          <div>Seed Cost</div>
          <div>{{ wholeNumber(crop.seedPrice) }}g</div>
        </li>
        <li class="info">
          <div>Sell Value</div>
          <div>{{ wholeNumber(crop.sellPrice) }}g</div>
        </li>
        <li v-if="crop.artisanSellPrice" class="info">
          <div>Artisan Value</div>
          <div>{{ wholeNumber(crop.artisanSellPrice) }}g</div>
        </li>
        <li v-if="!isGreenhouse || !crop.regrowth" class="info">
          <div>Growth</div>
          <div>{{ wholeNumber(crop.growth) }} days</div>
        </li>
        <li v-if="crop.regrowth" class="info">
          <div>Regrowth</div>
          <div>{{ wholeNumber(crop.regrowth) }} days</div>
        </li>
        <li v-if="!isGreenhouse" class="info">
          <div>Harvests</div>
          <div>{{ crop.harvests }}</div>
        </li>
        <li class="info">
          <div>Yield</div>
          <div>{{ crop.harvests * crop.yield }}</div>
        </li>
        <li class="info">
          <div>Revenue</div>
          <div>{{ wholeNumber(crop.revenue) }}g</div>
        </li>
        <li class="info">
          <div>Costs</div>
          <div>{{ wholeNumber(crop.costs) }}g</div>
        </li>
        <li class="info">
          <div>Profit</div>
          <div>{{ wholeNumber(crop.profit) }}g</div>
        </li>
        <li v-if="time !== 'processing'" class="info">
          <div>Growth Time</div>
          <div>{{ wholeNumber(crop.growthTime) }} days</div>
        </li>
        <li v-if="time !== 'growth'" class="info">
          <div>Processing Time</div>
          <div>{{ maxOneDecimal(crop.processingTime) }} days</div>
        </li>
      </ul>
    </Drawer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Drawer from './Drawer.vue';
import { twoDecimals } from './utils';

export default defineComponent({
  components: {
    Drawer,
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
    isGreenhouse(): boolean {
      return this.seasonName === 'greenhouse';
    },
    notes(): string {
      const notes = [];
      if (this.processing === 'best') {
        notes.push(this.crop.processing);
      }
      if (!this.isGreenhouse && this.crop.seasons > 1) {
        notes.push(`${this.crop.seasons} seasons`);
      }
      return notes.join(', ');
    },
    barPercentage(): number {
      return (100 * this.crop.gPerDay) / this.maxGPerDay;
    },
    barStyles(): { [key: string]: string } {
      return {
        '--bar-width': `${this.barPercentage.toFixed(2)}%`,
      };
    },
  },
  methods: {
    wholeNumber(n: number): string {
      return Math.round(n).toLocaleString();
    },
    twoDecimals,
    maxOneDecimal(n: number): string {
      return n.toLocaleString(undefined, {
        maximumFractionDigits: 1,
      });
    },
  },
});
</script>

<style lang="scss">
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
