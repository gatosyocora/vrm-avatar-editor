<template>
    <div v-if="meta">
        <div>
            <img v-if="meta.commercialUssageName === 'Allow'" class="license-img" src="@/assets/license/com-ok.png" />
            <img v-else class="license-img" src="@/assets/license/com-ng.png" />

            <img v-if="meta.sexualUssageName === 'Allow'" class="license-img" src="@/assets/license/sex-ok.png" />
            <img v-else class="license-img" src="@/assets/license/sex-ng.png" />

            <img v-if="meta.violentUssageName === 'Allow'" class="license-img" src="@/assets/license/vio-ok.png" />
            <img v-else class="license-img" src="@/assets/license/vio-ng.png" />
        </div>
        <div v-if="meta" class="undot-list centering-list my-list">
            <ul>
                <li>Title : {{meta.title}}</li>
                <li>Version : {{meta.version}}</li>
                <li>Author : {{meta.author}}</li>
                <li>AllowUser : {{meta.allowedUserName}}</li>
                <li>CommercialUssage : {{meta.commercialUssageName}}</li>
                <li>SexualUssage : {{meta.sexualUssageName}}</li>
                <li>ViolentUssage : {{meta.violentUssageName}}</li>
                <li>LicenseName : {{meta.licenseName}}</li>
                <li>OtherLicense : 
                    <a :href="meta.otherLicenseUrl" target="_blank">
                        {{meta.otherLicenseUrl}}
                    </a>
                </li>
                <li>OtherPermission : 
                    <a :href="meta.otherPermissionUrl" target="_blank">
                        {{meta.otherPermissionUrl}}
                    </a>
                </li>
                <li>ContactInformation : 
                    <a :href="meta.contactInformation" target="_blank">
                        {{meta.contactInformation}}
                    </a>
                </li>
                <li>Reference : {{meta.reference}}</li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from "vue-property-decorator";
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
  import { VRM, VRMMeta } from '@pixiv/three-vrm';

  interface Arrays extends Array<THREE.Object3D|THREE.Group|THREE.SkinnedMesh> {}

  interface VRMSkinnedMesh extends THREE.SkinnedMesh {
    geometry: THREE.BufferGeometry;
  }

  interface VRMGroup extends THREE.Group {
    children: Array<VRMSkinnedMesh>;
  }

  @Component
  export default class MetaView extends Vue {
    @Prop()
    public meta: VRMMeta | undefined | null = null;

    @Prop()
    public vrmObject: THREE.Scene | THREE.Group | null = null;

    public getMeshCount(objects: Arrays): Number {
      return objects.filter((object) => ["Group", "SkinnedMesh"].includes(object.type)).length;
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

    public getBlendShapeCount(objects: Arrays): Number {
      let count = 0;
      objects.forEach((object) => {
        if (object.type === "Group") {
          count += (object as VRMGroup).children[0].geometry.userData.targetNames.length;
        }
      });
      return count;
    }
  };
</script>
<style>
  .centering-list{
    text-align: center;
  }
  .centering-list ul{
    text-align: left;
    display: inline-block;
  }
  .undot-list ul {
    list-style: none;
  }
  .my-list li{
    padding-top: 5px;
    padding-bottom: 5px;
  }
  .license-img {
    width: 100px;
    height: auto;
  }
</style>