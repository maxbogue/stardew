<template>
  <div :class="$style.crop">
    <div>{{ crop.name }} {{ roundedGPerDay }}</div>
  </div>
</template>

<script>
export default {
  props: {
    crop: { type: Object, required: true },
  },
  computed: {
    roundedGPerDay() {
      return this.crop.gPerDay.toFixed(2);
    },
  },
};
</script>

<style lang="scss" module>
.crop {
}
</style>
