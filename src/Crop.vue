<template>
  <div :class="$style.crop" :style="styles">
    <div :class="$style.text">{{ crop.name }} {{ roundedGPerDay }}</div>
  </div>
</template>

<script>
export default {
  props: {
    crop: { type: Object, required: true },
    maxGPerDay: { type: Number, required: true },
  },
  computed: {
    roundedGPerDay() {
      return this.crop.gPerDay.toFixed(2);
    },
    barPercentage() {
      return (100 * this.crop.gPerDay) / this.maxGPerDay;
    },
    styles() {
      return {
        '--bar-width': `${this.barPercentage.toFixed(2)}%`,
      };
    },
  },
};
</script>

<style lang="scss" module>
.crop {
  position: relative;
  height: 30px;
  margin: 4px 0;

  &::before {
    content: '';
    background-color: #aed581;
    height: 100%;
    width: var(--bar-width);
    position: absolute;
    left: 0;
  }
}

.text {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 4px;
}
</style>
