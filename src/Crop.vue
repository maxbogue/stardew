<template>
  <div :class="[$style.crop, $style['crop--' + seasonName]]">
    <div
      role="buttom"
      :class="$style.bar"
      :style="barStyles"
      @click="showInfo = !showInfo"
    >
      <span>{{ crop.name }}</span>
      <div>
        <span>{{ roundedGPerDay }}</span>
        <span>g/day</span>
      </div>
    </div>
    <div v-if="showInfo" :class="$style.info">
      <span>Seed Price</span>
      <span>{{ crop.seedPrice }}g</span>
      <span>Sell Price</span>
      <span>{{ crop.sellPrice }}g</span>
      <span>Growth</span>
      <span>{{ crop.growth }} days</span>
      <template v-if="crop.regrowth">
        <span>Regrowth</span>
        <span>{{ crop.regrowth }} days</span>
      </template>
      <template v-if="crop.harvests">
        <span>Harvests</span>
        <span>{{ crop.harvests }}</span>
      </template>
      <span>Revenue</span>
      <span>{{ crop.revenue }}g</span>
      <span>Costs</span>
      <span>{{ crop.costs }}g</span>
      <template v-if="crop.profit">
        <span>Profit</span>
        <span>{{ crop.profit }}g</span>
      </template>
      <span>g/day</span>
      <span>{{ roundedGPerDay }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    crop: { type: Object, required: true },
    seasonName: { type: String, required: true },
    maxGPerDay: { type: Number, required: true },
  },
  data: () => ({
    showInfo: false,
  }),
  computed: {
    roundedGPerDay() {
      return this.crop.gPerDay.toFixed(2);
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

  &--greenhouse {
    --bar-color: rgba(174, 213, 129, 0.5);
  }

  &--spring {
    --bar-color: rgba(240, 98, 145, 0.5);
  }

  &--summer {
    --bar-color: rgba(79, 194, 247, 0.5);
  }

  &--fall {
    --bar-color: rgba(255, 183, 77, 0.5);
  }
}

.bar {
  position: relative;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px;
  background-color: var(--bar-color);
  font-size: 1.2em;

  &::before {
    content: '';
    background-color: var(--bar-color);
    height: 100%;
    width: var(--bar-width);
    position: absolute;
    left: 0;
    z-index: -1;
  }
}

.info {
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: auto auto;
  padding: 8px 4px 4px;

  > :nth-child(odd) {
    font-size: 0.75em;
  }

  > :nth-child(even) {
    font-size: 1.5em;
  }
}
</style>
