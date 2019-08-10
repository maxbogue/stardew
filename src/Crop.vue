<template>
  <div :class="$style.crop">
    <div>Test Crop</div>
  </div>
</template>

<script>
export default {
  props: {
    numBars: { type: Number, required: true },
    samplesPerBar: { type: Number, required: true },
  },
  data: () => ({}),
  watch: {
    numBars: 'computePeaks',
    samplesPerBar: 'computePeaks',
    audioBuffer: 'computePeaks',
  },
  methods: {},
};
</script>
