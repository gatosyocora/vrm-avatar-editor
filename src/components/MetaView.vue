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
          <td>Allow User</td>
          <td>{{ meta.allowedUserName }}</td>
        </tr>
        <tr>
          <td>Commercial Ussage</td>
          <td>{{ meta.commercialUssageName }}</td>
        </tr>
        <tr>
          <td>Sexual Ussage</td>
          <td>{{ meta.sexualUssageName }}</td>
        </tr>
        <tr>
          <td>Violent Ussage</td>
          <td>{{ meta.violentUssageName }}</td>
        </tr>
        <tr>
          <td>License Name</td>
          <td>{{ meta.licenseName }}</td>
        </tr>
        <tr>
          <td>Other License</td>
          <td>
            <a :href="meta.otherLicenseUrl" target="_blank">
              {{ meta.otherLicenseUrl }}
            </a>
          </td>
        </tr>
        <tr>
          <td>Other Permission</td>
          <td>
            <a :href="meta.otherPermissionUrl" target="_blank">
              {{ meta.otherPermissionUrl }}
            </a>
          </td>
        </tr>
        <tr>
          <td>Contact Information</td>
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
            <DragAndDroppableArea @onDropFile="changeIconFile">
              <ImageBitmapImg
                :imageBitmap="meta.texture ? meta.texture.image : undefined"
                :showInfo="false"
              />
            </DragAndDroppableArea>
          </td>
        </tr>
        <tr>
          <td>Exporter Version</td>
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
import DragAndDroppableArea from "@/components/DragAndDroppableArea.vue";

import { loadImage } from "@/scripts/ImageUtils.ts";

@Component({
  components: {
    ImageBitmapImg,
    DragAndDroppableArea,
  },
})
export default class MetaView extends Vue {
  @Prop()
  public meta!: VRMMeta | undefined | null;

  @Prop()
  public vrmObject!: THREE.Scene | THREE.Group | null;

  @Prop()
  public exporterVersion!: string;

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

  public async changeIconFile(url: string) {
    if (this.meta) {
      const data = await loadImage(url);
      if (!data) return;
      if (!this.meta.texture) {
        this.meta.texture = new THREE.Texture();
      }
      this.meta.texture.image = data;
    }
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
