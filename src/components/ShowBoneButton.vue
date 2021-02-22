<template>
  <v-btn @click="!isShowing ? showBone() : hideBone()">
    <div v-if="!isShowing">Show</div>
    <div v-else>Hide</div>
  </v-btn>
</template>

<script lang="ts">
import { Component, InjectReactive, Prop, Vue } from "vue-property-decorator";
import * as THREE from "three";
import { VRM } from "@pixiv/three-vrm";

import { Bone, Line, LineBasicMaterial, Object3D, Scene, Vector3 } from "three";

@Component
export default class ShowBoneButton extends Vue {
  @InjectReactive("vrmObject")
  private vrmObject!: THREE.Scene | THREE.Group | null;

  @InjectReactive("scene")
  private scene!: Scene | null;

  public boneObject: Line | null = null;

  @Prop()
  isShowing: boolean = false;

  public showBone() {
    if (!this.vrmObject || !this.scene || this.isShowing) return;

    const rootBone = this.vrmObject!.children.filter(
      (child) => child.children.length > 0 && child.children[0].type === "Bone"
    )[0];
    this.boneObject = this.generateBoneSupporter(rootBone);
    this.scene.add(this.boneObject);

    this.isShowing = true;
  }

  public hideBone() {
    if (!this.boneObject || !this.scene || !this.isShowing) return;

    this.scene.remove(this.boneObject);
    this.isShowing = false;
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
