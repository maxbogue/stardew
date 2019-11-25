<template>
  <transition
    name="drawer"
    :enter-active-class="$style.drawerActive"
    :leave-active-class="$style.drawerActive"
    @before-enter="active = true"
    @before-leave="active = true"
    @after-enter="active = false"
    @after-leave="active = false"
  >
    <div v-show="innerShow" ref="drawer" :class="$style.drawer" :style="styles">
      <slot></slot>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';

function doubleRaf() {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}

export default Vue.extend({
  props: {
    show: { type: Boolean, required: true },
  },
  data() {
    return {
      active: false,
      innerShow: this.show,
      height: 0,
    };
  },
  computed: {
    maxHeight() {
      return this.height + 'px';
    },
    styles() {
      if (!this.active) {
        return null;
      }
      return {
        maxHeight: this.maxHeight,
      };
    },
  },
  watch: {
    show(show) {
      if (show) {
        this.open();
      } else {
        this.close();
      }
    },
  },
  methods: {
    async open() {
      // Briefly override the v-show style to grab the target height.
      const { drawer } = this.$refs;
      drawer.style.display = 'block';
      const height = drawer.scrollHeight;
      drawer.style.display = '';

      this.height = 0;
      this.active = true;

      await doubleRaf();
      this.height = height;
      this.innerShow = true;
    },
    async close() {
      this.active = true;
      this.height = this.$refs.drawer.scrollHeight;

      await doubleRaf();
      this.height = 0;
      this.innerShow = false;
    },
  },
});
</script>

<style lang="scss" module>
.drawer {
  overflow: auto;
}
.drawerActive {
  overflow: hidden;
  transition: all 0.4s;
}
</style>
