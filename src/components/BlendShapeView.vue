<template>
  <div v-if="vrmObject">
    <div
      v-for="(blendShapeInfo, index) in toBlendShapeInfo(vrmObject)"
      :key="index"
    >
      <p>{{ blendShapeInfo.meshName }}</p>
      <div v-for="(morphName, index) in blendShapeInfo.morphNames" :key="index">
        <div>
          <v-slider
            :label="morphName"
            min="0"
            max="100"
            @change="updateBlendShape(index)"
          ></v-slider>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as THREE from "three";
import { Group, Scene, SkinnedMesh } from "three";

interface BlendShapeInfo {
  meshName: string;
  morphNames: Array<string>;
}

@Component
export default class BlendShapeView extends Vue {
  @Prop()
  public vrmObject: THREE.Scene | THREE.Group | null = null;

  public toBlendShapeInfo(vrmObject: Scene | Group): Array<BlendShapeInfo> {
    return vrmObject.children
      .filter((child) => child.type === "Group" || child.type === "SkinnedMesh")
      .map((child) => {
        const mesh = (child.type === "Group"
          ? child.children[0]
          : child) as SkinnedMesh;
        return {
          meshName: child.name,
          morphNames: Object.keys(mesh.morphTargetDictionary!),
        };
      });
  }

  public updateBlendShape(index: number) {
    this.$emit("updateBlendShape", index);
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
