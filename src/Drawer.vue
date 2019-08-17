<template>
  <transition
    name="drawer"
    :enter-active-class="$style.drawerActive"
    :leave-active-class="$style.drawerActive"
    @after-enter="afterEnter"
  >
    <div
      v-show="innerShow"
      ref="drawer"
      :class="$style.drawer"
      :style="{ maxHeight }"
    >
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    show: { type: Boolean, required: true },
  },
  data() {
    return {
      innerShow: this.show,
      height: this.show ? this.$refs.drawer.scrollHeight : 0,
    };
  },
  computed: {
    maxHeight() {
      return this.height + 'px';
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
    open() {
      const { drawer } = this.$refs;
      // Briefly override the v-show style to grab the height.
      drawer.style.display = 'block';
      const height = drawer.scrollHeight;
      drawer.style.display = '';
      this.height = height;
      this.innerShow = true;
    },
    close() {
      this.height = this.$refs.drawer.scrollHeight;
      // For some reason nextTick does not work correctly here. The new start
      // height doesn't take effect in time and the animation is broken for
      // drawers shorter than the max height.
      setTimeout(() => {
        this.height = 0;
        this.innerShow = false;
      }, 0);
    },
    afterEnter: {},
  },
};
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
