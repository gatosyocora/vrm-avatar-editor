<template>
  <div v-if="materials">
    <div
      v-for="(materialInfo, index) in toUniqueMaterialInfos(materials)"
      :key="index"
    >
      <MaterialItem
        :materialInfo="materialInfo"
        @onChangeMaterial="changeMaterial"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as THREE from "three";

import MaterialItem from "@/components/MaterialItem.vue";

interface MaterialInfo {
  name: string;
  material: THREE.Material;
  indices: Array<number>;
  value: number;
}

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
