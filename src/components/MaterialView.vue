<template>
    <div v-if="materials">
        <div v-for="(material, index) in materials">
            <v-card
              dark
              class="card"
            >
              <v-list-item three-line>
                <v-list-item-content>
                  <v-list-item-title class="headline">
                    {{material.name}}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{material.userData.vrmMaterialProperties.shader}}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-avatar
                  size="80"
                  :color="convertRGB2Hex(material.color)"
                />
                <div
                  style="margin:0 10px 0 10px;"
                >
                  <v-hover v-slot="{ hover }">
                    <v-list-item-avatar
                      rounded
                      size="80"
                      color="white"
                    >
                      <v-img
                        v-if="material.map&&material.map.image"
                        :src="convertImageBitmap2Base64(material.map.image)"
                      >
                        <div
                          v-if="hover"
                          class="tex-info"
                        >
                          {{material.map.image.width}}x{{material.map.image.height}}
                        </div>
                      </v-img>
                      <span
                        style="color:black;"
                        v-else
                      >
                          none
                      </span>
                    </v-list-item-avatar>
                  </v-hover>
                </div>
              </v-list-item>
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

    public convertRGB2Hex(color: Vector3|Vector4): String {
      const r = Math.round(Number(color.x) * 255);
      const g = Math.round(Number(color.y) * 255);
      const b = Math.round(Number(color.z) * 255);
      return "#" + r.toString(16) + g.toString(16) + b.toString(16);
    }

    public convertImageBitmap2Base64(image: ImageBitmap): string {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      canvas.getContext('2d')!.drawImage(image, 0, 0);
      return canvas.toDataURL();
    }
  };
</script>
<style>
  .card {
    margin: 10px;
    width: 50%;
  }
  .tex-info {
    font-size: 10px;
    background: grey;
    opacity: 0.75;
    width: 100%;
    height: 100%;
  }
</style>