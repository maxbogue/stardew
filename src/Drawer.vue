<template>
  <transition
    name="drawer"
    enter-active-class="drawer-active"
    leave-active-class="drawer-active"
    @before-enter="active = true"
    @before-leave="active = true"
    @after-enter="active = false"
    @after-leave="active = false"
  >
    <div v-show="innerShow" ref="drawer" class="drawer" :style="styles">
      <slot></slot>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

function doubleRaf(): Promise<void> {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}

export default defineComponent({
  props: {
    show: { type: Boolean, required: true },
  },
  data: () => ({
    active: false,
    innerShow: false,
    height: 0,
  }),
  computed: {
    maxHeight(): string {
      return this.height + 'px';
    },
    styles(): Record<string, string> | null {
      return {
        maxHeight: this.maxHeight,
      };
    },
  },
  watch: {
    show(): void {
      if (this.show) {
        this.open();
      } else {
        this.close();
      }
    },
  },
  methods: {
    getDrawer(): HTMLElement {
      return this.$refs.drawer as HTMLElement;
    },
    async open(): Promise<void> {
      // Briefly override the v-show style to grab the target height.
      const drawer = this.getDrawer();
      drawer.style.display = 'block';
      const height = drawer.scrollHeight;
      drawer.style.display = '';

      this.height = 0;
      this.active = true;

      await doubleRaf();
      this.height = height;
      this.innerShow = true;
    },
    async close(): Promise<void> {
      this.active = true;
      this.height = this.getDrawer().scrollHeight;

      await doubleRaf();
      this.height = 0;
      this.innerShow = false;
    },
  },
});
</script>

<style lang="scss">
.drawer {
  overflow: auto;
}
.drawer-active {
  overflow: hidden;
  transition: all 0.4s;
}
</style>
