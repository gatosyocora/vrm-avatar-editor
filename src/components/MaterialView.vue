<template>
    <div v-if="materials">
        <div id="material-list" v-for="(material, index) in materials">
            <v-card
              dark
            >
                <p>{{material.name}}</p>
                <p>{{convertRGB2Hex(material.color)}}</p>
                <p>{{material.map.image.width}}x{{material.map.image.height}}</p>
                <p>{{material.userData.vrmMaterialProperties.shader}}</p>
            </v-card>
        </div>
    </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from "vue-property-decorator";
  import * as THREE from 'three';
  import { VRM, VRMMeta } from '@pixiv/three-vrm';

  @Component
  export default class MaterialView extends Vue {

    @Prop()
    public materials: THREE.Material[] | undefined | null = null;

    public convertRGB2Hex(color: THREE.Color): String {
      const r = Math.round(Number(color.r) * 255);
      const g = Math.round(Number(color.g) * 255);
      const b = Math.round(Number(color.b) * 255);
      return "#" + r.toString(16) + g.toString(16) + b.toString(16);
    }
  };
</script>
<style>
  #material-list div {
    width:30%;
    text-align:left;
    margin: 10px;
    padding: 10px;
    border: 1px solid black;
  }
</style>