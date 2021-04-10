<template>
  <div
    class="fit-inline"
    :class="{ outline: isDragOver }"
    @dragover.prevent="onDrag('over')"
    @dragleave.prevent="onDrag('leave')"
    @drop.prevent="onDrop"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class DragAndDroppableArea extends Vue {
  @Prop({ default: false })
  public isDragOver!: boolean;

  public onDrag(type: string) {
    this.isDragOver = type === "over";
  }
  public onDrop(e: DragEvent) {
    if (e.dataTransfer === null || e.dataTransfer.files === null) return;

    this.isDragOver = false;
    const file = e.dataTransfer.files[0];
    const url: string = window.URL.createObjectURL(file);
    this.$emit("onDropFile", url);
  }
}
</script>
<style>
.fit-inline {
  display: inline-block;
}
.outline {
  outline: 5px dashed red;
}
</style>
