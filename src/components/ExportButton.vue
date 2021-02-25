<template>
  <v-btn block color="primary" :disabled="vrm === null" @click="exportVRM">
    Export VRM (beta)
  </v-btn>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { VRM, VRMMeta } from "@pixiv/three-vrm";

import VRMExporter from "@/scripts/VRMExporter";

@Component
export default class ExportButton extends Vue {
  @Prop()
  public vrm!: VRM | null;

  public exportVRM() {
    if (!this.vrm) return;

    const exporter = new VRMExporter();
    exporter.parse(this.vrm, (vrm: ArrayBuffer) => {
      const fileName = "test.vrm";
      const blob = new Blob([vrm], { type: "octet/stream" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    });
  }
}
</script>
<style></style>
