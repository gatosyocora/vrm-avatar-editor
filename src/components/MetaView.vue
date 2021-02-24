<template>
  <div v-if="meta">
    <v-simple-table>
      <tbody>
        <tr>
          <td>Title</td>
          <td>{{ meta.title }}</td>
        </tr>
        <tr>
          <td>Version</td>
          <td>{{ meta.version }}</td>
        </tr>
        <tr>
          <td>Author</td>
          <td>{{ meta.author }}</td>
        </tr>
        <tr>
          <td>AllowUser</td>
          <td>{{ meta.allowedUserName }}</td>
        </tr>
        <tr>
          <td>CommercialUssage</td>
          <td>{{ meta.commercialUssageName }}</td>
        </tr>
        <tr>
          <td>SexualUssage</td>
          <td>{{ meta.sexualUssageName }}</td>
        </tr>
        <tr>
          <td>ViolentUssage</td>
          <td>{{ meta.violentUssageName }}</td>
        </tr>
        <tr>
          <td>LicenseName</td>
          <td>{{ meta.licenseName }}</td>
        </tr>
        <tr>
          <td>OtherLicense</td>
          <td>
            <a :href="meta.otherLicenseUrl" target="_blank">
              {{ meta.otherLicenseUrl }}
            </a>
          </td>
        </tr>
        <tr>
          <td>OtherPermission</td>
          <td>
            <a :href="meta.otherPermissionUrl" target="_blank">
              {{ meta.otherPermissionUrl }}
            </a>
          </td>
        </tr>
        <tr>
          <td>ContactInformation</td>
          <td>
            <a :href="meta.contactInformation" target="_blank">
              {{ meta.contactInformation }}
            </a>
          </td>
        </tr>
        <tr>
          <td>Reference</td>
          <td>{{ meta.reference }}</td>
        </tr>
        <tr>
          <td>Icon</td>
          <td>
            <div v-if="meta.texture && meta.texture.image">
              <ImageBitmapImg
                :imageBitmap="meta.texture.image"
                :showInfo="false"
              />
            </div>
            <div v-else>None</div>
          </td>
        </tr>
        <tr>
          <td>ExporterVersion</td>
          <td>{{ exporterVersion }}</td>
        </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { VRM, VRMMeta } from "@pixiv/three-vrm";

import { Arrays, VRMSkinnedMesh, VRMGroup } from "@/scripts/VRMInterface";

import ImageBitmapImg from "@/components/ImageBitmapImg.vue";

@Component({
  components: { ImageBitmapImg },
})
export default class MetaView extends Vue {
  @Prop()
  public meta: VRMMeta | undefined | null = null;

  @Prop()
  public vrmObject: THREE.Scene | THREE.Group | null = null;

  @Prop()
  public exporterVersion: string = "";

  public getMeshCount(objects: Arrays): Number {
    return objects.filter((object) =>
      ["Group", "SkinnedMesh"].includes(object.type)
    ).length;
  }

  public getPolygonCount(objects: Arrays): Number {
    return (
      objects
        .filter((object) =>
          ["Group", "SkinnedMesh", "Object3D"].includes(object.type)
        )
        .map((object) => {
          if (["Group", "Object3D"].includes(object.type)) {
            if (object.children.length <= 0) return 0;
            return object.children
              .map((mesh) => (mesh as VRMSkinnedMesh).geometry.groups[0].count)
              .reduce((sum, value) => sum + value, 0);
          } else if (object.type === "SkinnedMesh") {
            return (object as VRMSkinnedMesh).geometry.groups[0].count;
          } else {
            return object.children
              .map((mesh) => (mesh as VRMSkinnedMesh).geometry.groups[0].count)
              .reduce((sum, value) => sum + value, 0);
          }
        })
        .reduce((sum, value) => sum + value, 0) / 3
    );
  }

  public getBlendShapeCount(objects: Arrays): Number {
    let count = 0;
    objects.forEach((object) => {
      if (object.type === "Group") {
        count += (object as VRMGroup).children[0].geometry.userData.targetNames
          .length;
      }
    });
    return count;
  }
}
</script>
<style>
.centering-list {
  text-align: center;
}
.centering-list ul {
  text-align: left;
  display: inline-block;
}
.undot-list ul {
  list-style: none;
}
.my-list li {
  padding-top: 5px;
  padding-bottom: 5px;
}
.license-img {
  width: 100px;
  height: auto;
}
</style>
