<template>
    <div v-if="vrmObject">
        <p v-if="vrmObject.children !== null">Mesh Count: {{getMeshCount(vrmObject.children)}}</p>
        <p v-if="materials !== null">SubMesh Count: {{materials.length}}</p>
        <p v-if="vrmObject.children !== null">Polygon Count: {{getPolygonCount(vrmObject.children)}}</p>
        <p v-if="vrmObject.children !== null">Bone Count: {{getBoneCount(vrmObject.children)}}</p>
        <p v-if="vrmObject.children !== null">BlendShape Count: {{getBlendShapeCount(vrmObject.children)}}</p>
    </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from "vue-property-decorator";
  import * as THREE from 'three';

  interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
  }

  @Component
  export default class ModelInfoView extends Vue {

    @Prop()
    public materials: THREE.Material[] | undefined | null = null;

    @Prop()
    public vrmObject: THREE.Scene | THREE.Group | null = null;

    public getMeshCount(objects: object[]): Number {
      return objects.filter((object) => ["Group", "SkinnedMesh"].includes(object.type)).length;
    }

    public getPolygonCount(objects: object[]): Number {
      return objects
              .filter((object) => ["Group", "SkinnedMesh"].includes(object.type))
              .map((object) => 
              {
                if (object.type === "Group") {
                  return object.children
                          .map((mesh) => mesh.geometry.groups[0].count)
                          .reduce((sum, value) => sum + value, 0);
                }
                else {
                  return object.geometry.groups[0].count;
                }
              })
              .reduce((sum, value) => sum + value, 0) / 3;
    }

    public getBoneCount(objects: object[]): Number {
        return this.getChildrenCount(objects.filter((object) => object.name === "Armature")[0]);
    }

    public getChildrenCount(parent: object): Number {
        if (parent.children.length === 0) return 0;
        else {
            return parent.children
                    .map((child) => this.getChildrenCount(child))
                    .reduce((sum, value) => sum + value, 0)
                    + parent.children.length;
        }
    }

    public getBlendShapeCount(objects: object[]): Number {
      let count = 0;
      objects.forEach((object) => {
        if (object.type === "Group") {
          count += object.children[0].geometry.userData.targetNames.length;
        }
      });
      return count;
    }
  };
</script>
<style>
</style>