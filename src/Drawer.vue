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
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

function doubleRaf(): Promise<void> {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}

@Component
export default class Drawer extends Vue {
  $refs!: { drawer: HTMLElement };

  @Prop({ type: Boolean, required: true })
  readonly show!: boolean;

  active = false;
  innerShow = false;
  height = 0;

  get maxHeight(): string {
    return this.height + 'px';
  }

  get styles(): Record<string, string> | null {
    if (!this.active) {
      return null;
    }
    return {
      maxHeight: this.maxHeight,
    };
  }

  @Watch('show')
  onShowChanged(val: boolean): void {
    if (val) {
      this.open();
    } else {
      this.close();
    }
  }

  async open(): Promise<void> {
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
  }

  async close(): Promise<void> {
    this.active = true;
    this.height = this.$refs.drawer.scrollHeight;

    await doubleRaf();
    this.height = 0;
    this.innerShow = false;
  }
}
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
