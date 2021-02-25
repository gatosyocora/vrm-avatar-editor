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
            <v-list-item-subtitle>
              <div v-if="materialInfo.material.side === 0">FrontSide</div>
              <div v-else-if="materialInfo.material.side === 1">BackSide</div>
              <div v-else>BothSide</div>
            </v-list-item-subtitle>
            <v-slider
              min="0"
              step="0.01"
              max="1"
              v-model="materialInfo.value"
              @change="changeHsv(materialInfo)"
            ></v-slider>
          </v-list-item-content>

          <v-list-item-avatar
            size="80"
            v-if="materialInfo.material.color"
            :color="convertRGB2Hex(materialInfo.material.color)"
          />
          <ImageBitmapImg
            v-if="materialInfo.material.map && materialInfo.material.map.image"
            :imageBitmap="materialInfo.material.map.image"
          />
        </v-list-item>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import * as THREE from "three";

import MaterialItem from "@/components/MaterialItem.vue";
import { MeshBasicMaterial, MeshStandardMaterial } from "three";

interface MaterialInfo {
  name: string;
  material: THREE.Material;
  indices: Array<number>;
  value: number;
}

type HasMapMaterial = MeshBasicMaterial | MeshStandardMaterial;

@Component({
  components: { MaterialItem },
})
export default class MaterialView extends Vue {
  @Prop()
  public materials!: Array<THREE.Material> | undefined | null;

  @Prop()
  public uniqueMaterialInfos!: Array<MaterialInfo> | null;

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
          value: 0,
        });
      } else {
        materialInfos[index].indices.push(i);
      }
    }
    return materialInfos;
  }

  public changeMaterial(material: THREE.Material) {
    this.$emit("onChangeMaterial", material);
  }
}
</script>
<style></style>
