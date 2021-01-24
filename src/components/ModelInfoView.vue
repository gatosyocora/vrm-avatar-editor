<template>
    <div v-if="vrmObject">
      <v-simple-table>
        <tbody>
          <tr v-if="vrmObject.children !== null">
            <td>Mesh Count</td>
            <td>{{getMeshCount(vrmObject.children)}}</td>
          </tr>
          <tr v-if="materials !== null">
            <td>SubMesh Count</td>
            <td>{{materials.length}}</td>
          </tr>
          <tr v-if="vrmObject.children !== null">
            <td>Polygon Count</td>
            <td>{{getPolygonCount(vrmObject.children)}}</td>
          </tr>
          <tr v-if="vrmObject.children !== null">
            <td>Bone Count</td>
            <td>{{getBoneCount(vrmObject.children)}}</td>
          </tr>
          <tr v-if="vrmObject.children !== null">
            <td>BlendShape Count</td>
            <td>{{getBlendShapeCount(vrmObject.children)}}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from "vue-property-decorator";
  import * as THREE from 'three';
  
  import { Arrays, VRMSkinnedMesh, VRMGroup } from '@/scripts/VRMInterface';

  @Component
  export default class ModelInfoView extends Vue {

    @Prop()
    public materials: THREE.Material[] | undefined | null = null;

    @Prop()
    public vrmObject: THREE.Scene | THREE.Group | null = null;

    public getMeshCount(objects: Arrays): Number {
      return objects.filter((object) => ["Group", "SkinnedMesh"].includes(object.type)).length + 
              objects
                .filter((object) => object.type === "Object3D" && object.children.length > 0)
                .map((object) => object.children[0].children.length)
                .reduce((sum, value) => sum + value, 0);
    }

    public getPolygonCount(objects: Arrays): Number {
      return objects
              .filter((object) => ["Group", "SkinnedMesh"].includes(object.type))
              .map((object) => 
              {
                if (object.type === "Group") {
                  return object.children
                          .map((mesh) => (mesh as VRMSkinnedMesh).geometry.groups[0].count)
                          .reduce((sum, value) => sum + value, 0);
                }
                else {
                  return (object as VRMSkinnedMesh).geometry.groups[0].count;
                }
              })
              .reduce((sum, value) => sum + value, 0) / 3;
    }

    public getBoneCount(objects: Arrays): Number {
        return this.getChildrenCount(objects.filter((object) => object.children.length > 0 && object.children[0].type === "Bone")[0]);
    }

    public getChildrenCount(parent: THREE.Object3D|THREE.Bone): number {
        if (parent.children.length === 0) return 0;
        else {
            return parent.children
                    .map((child) => this.getChildrenCount(child))
                    .reduce((sum: number, value: number) => sum + value, 0)
                    + parent.children.length;
        }
    }

    public getBlendShapeCount(objects: Arrays): Number {
      let count = 0;
      objects.forEach((object) => {
        if (object.type === "Group") {
          const userData = (object as VRMGroup).children[0].geometry.userData;
          count += userData.targetNames ? userData.targetNames.length : 0;
        }
        else if (object.type === "SkinnedMesh") {
          const userData = (object as VRMSkinnedMesh).geometry.userData;
          count += userData.targetNames ? userData.targetNames.length : 0;
        }
      });
      return count;
    }
  };
</script>
<style>
</style>