<template>
    <v-btn
        block
        @click="exportVRM"
    >
        Export
    </v-btn>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from "vue-property-decorator";
  import * as THREE from 'three';
  import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
  import { VRM, VRMMeta } from '@pixiv/three-vrm';

  @Component
  export default class ExportButton extends Vue {
    @Prop()
    public vrm: THREE.Scene | null  = null;

    public exportVRM() {
        const exporter = new GLTFExporter();

        const options = {
            includeCustomExtensions: true,
        };

        const objects = [
            this.vrm.blendShapeProxy,
            this.vrm.firstPerson,
            this.vrm.humanoid,
            this.vrm.lookAt,
            this.vrm.materials,
            this.vrm.meta,
            this.vrm.scene,
            this.vrm.springBoneManager
        ];

        exporter.parse(objects, (gltf) => {
            console.log(gltf);

            const fileName = "test.vrm";
            const dataText = JSON.stringify(gltf);
            const blob = new Blob([dataText], {type:'text/plain'}, fileName);
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();

        }, options);
    }
  };
</script>
<style>
</style>