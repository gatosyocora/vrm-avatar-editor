<template>
  <v-btn @click="showBone"> Show </v-btn>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as THREE from "three";
import { VRM } from "@pixiv/three-vrm";

import { Bone, Line, LineBasicMaterial, Object3D, Scene, Vector3 } from "three";

@Component
export default class ShowBoneButton extends Vue {
  @Prop()
  public vrm: VRM | null = null;

  @Prop()
  public scene: Scene | null = null;

  public boneObject: Line | null = null;

  public showBone() {
    if (!this.vrm || !this.scene || this.boneObject) return;

    const rootBone = this.vrm.scene.children.filter(
      (child) => child.children.length > 0 && child.children[0].type === "Bone"
    )[0];
    this.boneObject = this.generateBoneSupporter(rootBone);
    this.scene.add(this.boneObject);
  }

  generateBoneSupporter(
    node: Object3D | Bone,
    parentNode?: Object3D | Bone,
    material?: LineBasicMaterial
  ): Line {
    if (!material) {
      material = new THREE.LineBasicMaterial({
        color: 0xff0000,
        transparent: true,
        depthWrite: false,
        depthTest: false,
      });
    }

    const lineGeometry = new THREE.Geometry();
    if (parentNode) {
      lineGeometry.vertices.push(
        parentNode.getWorldPosition(new Vector3(0, 0, 0)),
        node.getWorldPosition(new Vector3(0, 0, 0))
      );
    }
    const newLine = new THREE.Line(lineGeometry, material);
    node.children.forEach((child) => {
      newLine.children.push(this.generateBoneSupporter(child, node, material));
    });
    return newLine;
  }
}
</script>
<style></style>
