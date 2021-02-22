<template>
  <div v-if="materials">
    <div
      v-for="(materialInfo, index) in toUniqueMaterialInfos(materials)"
      :key="index"
    >
      <v-card dark class="card">
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="headline">
              {{ materialInfo.material.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ materialInfo.material.userData.vrmMaterialProperties.shader }}
            </v-list-item-subtitle>
            <v-list-item-subtitle> </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-avatar
            size="80"
            v-if="materialInfo.material.color"
            :color="convertRGB2Hex(materialInfo.material.color)"
          />
          <div style="margin: 0 10px 0 10px">
            <v-hover v-slot="{ hover }">
              <v-list-item-avatar rounded size="80" color="white">
                <v-img
                  v-if="
                    materialInfo.material.map && materialInfo.material.map.image
                  "
                  :src="
                    convertImageBitmap2Base64(materialInfo.material.map.image)
                  "
                >
                  <div v-if="hover" class="tex-info">
                    {{ materialInfo.material.map.image.width }}x{{
                      materialInfo.material.map.image.height
                    }}
                  </div>
                </v-img>
                <span style="color: black" v-else> none </span>
              </v-list-item-avatar>
            </v-hover>
          </div>
        </v-list-item>
      </v-card>
    </div>
  </div>
  <div v-else>aaa</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import * as THREE from "three";

interface MaterialInfo {
  name: string;
  material: THREE.Material;
  indices: Array<number>;
}

@Component
export default class MaterialView extends Vue {
  @Prop()
  public materials: Array<THREE.Material> | undefined | null = null;

  @Prop()
  public uniqueMaterialInfos: Array<MaterialInfo> | null = null;

  public convertRGB2Hex(color: THREE.Vector3 | THREE.Vector4): String {
    const r = Math.round(Number(color.x) * 255);
    const g = Math.round(Number(color.y) * 255);
    const b = Math.round(Number(color.z) * 255);
    return "#" + r.toString(16) + g.toString(16) + b.toString(16);
  }

  public convertImageBitmap2Base64(image: ImageBitmap): string {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext("2d")!.drawImage(image, 0, 0);
    return canvas.toDataURL();
  }

  public toUniqueMaterialInfos(
    materials: Array<THREE.Material>
  ): Array<MaterialInfo> {
    const materialInfos = Array<MaterialInfo>();
    for (let i = 0; i < materials.length; i++) {
      const index = materialInfos
        .map((info) => info.name)
        .indexOf(materials[i].name);
      if (index === -1) {
        materialInfos.push({
          name: materials[i].name,
          material: materials[i],
          indices: [i],
        });
      } else {
        materialInfos[index].indices.push(i);
      }
    }
    return materialInfos;
  }
}
</script>
<style>
.card {
  margin: 10px;
  width: 100%;
}
.tex-info {
  font-size: 10px;
  background: grey;
  opacity: 0.75;
  width: 100%;
  height: 100%;
}
</style>
