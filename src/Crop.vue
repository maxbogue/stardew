<template>
  <div :class="[$style.crop, $style['crop--' + seasonName]]">
    <div
      v-ripple.400="'rgba(255, 255, 255, 0.25)'"
      role="button"
      :class="$style.bar"
      :style="barStyles"
      @click="showInfo = !showInfo"
    >
      <div>
        <span :class="$style.name">{{ name }}</span>
        <span v-if="parenthetical" :class="$style.parenthetical">{{
          parenthetical
        }}</span>
      </div>
      <span>{{ roundedGPerDay }}</span>
    </div>
    <drawer :show="showInfo">
      <ul :class="$style.infos">
        <li :class="$style.info">
          <div>Seed Price</div>
          <div>{{ crop.seedPrice }}g</div>
        </li>
        <li :class="$style.info">
          <div>Sell Price</div>
          <div>{{ crop.sellPrice }}g</div>
        </li>
        <li :class="$style.info">
          <div>Growth</div>
          <div>{{ crop.growth }} days</div>
        </li>
        <li v-if="crop.regrowth" :class="$style.info">
          <div>Regrowth</div>
          <div>{{ crop.regrowth }} days</div>
        </li>
        <li v-if="crop.harvests" :class="$style.info">
          <div>Harvests</div>
          <div>
            {{ crop.harvests
            }}<template v-if="crop.yield > 1"
              >x{{ crop.yield }}</template
            >
          </div>
        </li>
        <li :class="$style.info">
          <div>Revenue</div>
          <div>{{ crop.revenue }}g</div>
        </li>
        <li :class="$style.info">
          <div>Costs</div>
          <div>{{ crop.costs }}g</div>
        </li>
        <li v-if="crop.profit" :class="$style.info">
          <div>Profit</div>
          <div>{{ crop.profit }}g</div>
        </li>
      </ul>
    </drawer>
  </div>
</template>

<script>
import Drawer from './Drawer.vue';

const PAREN_RE = /^(.*) \((.*)\)$/;

export default {
  components: {
    Drawer,
  },
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
  }

  > * {
    z-index: 1;
  }
}

.name {
  white-space: nowrap;
}

.parenthetical {
  font-size: 0.6em;
  text-transform: uppercase;
}

.infos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
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
