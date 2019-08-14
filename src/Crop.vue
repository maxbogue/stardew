<template>
  <div :class="[$style.crop, $style['crop--' + seasonName]]">
    <div
      role="buttom"
      :class="$style.bar"
      :style="barStyles"
      @click="showInfo = !showInfo"
    >
      <div>
        <span>{{ name }}</span>
        <span v-if="parenthetical" :class="$style.parenthetical">{{
          parenthetical
        }}</span>
      </div>
      <span>{{ roundedGPerDay }}</span>
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
        <span
          >{{ crop.harvests
          }}<template v-if="crop.yield > 1"
            >x{{ crop.yield }}</template
          ></span
        >
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
const PAREN_RE = /^(.*) \((.*)\)$/;

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
    name() {
      return PAREN_RE.test(this.crop.name)
        ? this.crop.name.match(PAREN_RE)[1]
        : this.crop.name;
    },
    parenthetical() {
      return PAREN_RE.test(this.crop.name)
        ? this.crop.name.match(PAREN_RE)[2]
        : '';
    },
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
    --bar-color: hsla(88, 50%, 67%, 0.5);
    --bar-color-dark: hsla(88, 50%, 67%, 0.7);
  }

  &--spring {
    --bar-color: hsla(340, 82%, 76%, 0.5);
    --bar-color-dark: hsla(340, 82%, 76%, 0.7);
  }

  &--summer {
    --bar-color: hsla(202, 92%, 74%, 0.5);
    --bar-color-dark: hsla(202, 92%, 74%, 0.7);
  }

  &--fall {
    --bar-color: hsla(42, 100%, 65%, 0.5);
    --bar-color-dark: hsla(42, 100%, 65%, 0.7);
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

  &:hover {
    cursor: pointer;
    background-color: var(--bar-color-dark);
  }

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

.parenthetical {
  font-size: 0.6em;
  text-transform: uppercase;
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
