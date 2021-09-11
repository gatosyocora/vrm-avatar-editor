<template>
  <div v-if="vrmObject">
    <div
      v-for="(blendShapeInfo, meshIndex) in blendShapeInfos"
      :key="meshIndex"
    >
      <v-simple-table v-if="blendShapeInfo.morphNames.length > 0">
        <thead>
          <tr>
            <th>{{ blendShapeInfo.meshName }}</th>
            <th style="width: 70%"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(morphName, morphIndex) in blendShapeInfo.morphNames"
            :key="morphIndex"
          >
            <td>{{ morphName }}</td>
            <td>
              <v-slider
                v-model="blendShapeInfo.morphValues[morphIndex]"
                min="0"
                max="100"
                @input="updateBlendShape(meshIndex, morphIndex)"
              />
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import * as THREE from "three";
import { Group, Scene, SkinnedMesh } from "three";

interface BlendShapeInfo {
  meshName: string;
  morphNames: Array<string>;
  morphValues: Array<number>;
}

@Component
export default class BlendShapeView extends Vue {
  @Prop()
  public vrmObject: THREE.Scene | THREE.Group | null = null;

  public blendShapeInfos: Array<BlendShapeInfo> | undefined = undefined;

  @Watch("vrmObject")
  public LoadBlendShapeInfos(vrmObject: Scene | Group) {
    this.blendShapeInfos = vrmObject.children
      .filter((child) => child.type === "Group" || child.type === "SkinnedMesh")
      .map((child) => {
        const mesh = (child.type === "Group"
          ? child.children[0]
          : child) as SkinnedMesh;
        return {
          meshName: child.name,
          morphNames: mesh.morphTargetDictionary
            ? Object.keys(mesh.morphTargetDictionary)
            : Array<string>(),
          morphValues: mesh.morphTargetDictionary
            ? Object.keys(mesh.morphTargetDictionary).map((_) => 0)
            : Array<number>(),
        };
      });
  }

  public updateBlendShape(meshIndex: number, morphIndex: number) {
    var value = 0;
    if (this.blendShapeInfos) {
      value = this.blendShapeInfos[meshIndex].morphValues[morphIndex];
    }
    this.$emit("updateBlendShape", { index: morphIndex, value: value });
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
