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

  import VRMExporter from '@/scripts/VRMExporter';

  @Component
  export default class ExportButton extends Vue {
    @Prop()
    public vrm: THREE.Scene | null  = null;

    public exportVRM() {
        /*
        const exporter = new GLTFExporter();

        const options = {
            trs: true,
            //onlyVisible: true,
            //truncateDrawRange: true,
            //binary: true,
            //embedImages: true,
            //maxTextureSize: Infinity,
            //animations: ,
            //forceIndices: true,
            //includeCustomExtensions: true,
        };

        const objects = [
            //this.vrm.blendShapeProxy,
            //this.vrm.firstPerson,
            //this.vrm.humanoid,
            //this.vrm.lookAt,
            //this.vrm.materials,
            //this.vrm.meta,
            //this.vrm.scene,
            //this.vrm.springBoneManager
        ];

        // JSONデータの下に画像ファイルデータをおいている
        // gltfでJSON内のimages(画像を置くところ)にはメタデータだけおいている
        // extensionsというものを追加して、VRMで必要なもの（meta, firstPersonなど）を追加している

        exporter.parse(this.vrm.scene, (gltf) => {
            console.log(gltf);

            const fileName = "test.vrm";
            const dataText = JSON.stringify(gltf, undefined, 2);
            const blob = new Blob([dataText], {type:'text/plain'}, fileName);
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();

        }, options);
        */

       const exporter = new VRMExporter();
       exporter.parse(
           this.vrm.scene, 
           this.vrm.meta,
           this.vrm.materials,
           this.vrm.blendShapeProxy,
           this.vrm.lookAt,
           this.vrm.springBoneManager,
           (vrm, textures) => {

                const fileName = "test.vrm";
                const blob = new Blob([vrm], {type:'text/plain'}, fileName);
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = fileName;
                link.click();
       });
    }
  };
</script>
<style>
</style>