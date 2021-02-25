<template>
  <v-card dark class="card">
    <v-list-item three-line>
      <v-list-item-content>
        <v-list-item-title class="headline">
          {{ materialInfo.material.name }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ materialInfo.material.userData.vrmMaterialProperties.shader }}
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          <div v-if="materialInfo.material.side === 0">FrontSide</div>
          <div v-else-if="materialInfo.material.side === 1">BackSide</div>
          <div v-else>BothSide</div>
        </v-list-item-subtitle>
        <v-slider
          min="0"
          step="0.01"
          max="1"
          v-model="materialInfo.value"
          @change="changeHsv(materialInfo)"
        ></v-slider>
      </v-list-item-content>

      <v-list-item-avatar
        size="80"
        v-if="materialInfo.material.color"
        :color="convertRGB2Hex(materialInfo.material.color)"
      />
      <DragAndDroppableArea @onDropFile="updateTexture">
        <ImageBitmapImg
          v-if="materialInfo.material.map && materialInfo.material.map.image"
          :imageBitmap="materialInfo.material.map.image"
        />
      </DragAndDroppableArea>
    </v-list-item>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as THREE from "three";

import ImageBitmapImg from "@/components/ImageBitmapImg.vue";
import DragAndDroppableArea from "@/components/DragAndDroppableArea.vue";
import { MeshBasicMaterial, MeshStandardMaterial } from "three";
import { loadImage } from "@/scripts/ImageUtils";

interface MaterialInfo {
  name: string;
  material: THREE.Material;
  indices: Array<number>;
  value: number;
}

interface RGBColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface HSVColor {
  h: number;
  s: number;
  v: number;
  a: number;
}

type HasMapMaterial = MeshBasicMaterial | MeshStandardMaterial;

@Component({
  components: { ImageBitmapImg, DragAndDroppableArea },
})
export default class MaterialView extends Vue {
  @Prop()
  public materialInfo!: MaterialInfo;

  public convertRGB2Hex(color: THREE.Vector3 | THREE.Vector4): String {
    const r = Math.round(Number(color.x) * 255);
    const g = Math.round(Number(color.y) * 255);
    const b = Math.round(Number(color.z) * 255);
    return "#" + r.toString(16) + g.toString(16) + b.toString(16);
  }

  public changeHsv() {
    const material = this.materialInfo.material as HasMapMaterial;
    if (!material.map) return;

    const imageBitmap = material.map.image;
    const canvas = document.createElement("canvas");
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    const ctx = canvas.getContext("2d");
    ctx!.drawImage(imageBitmap, 0, 0);

    this.changeColorForDot(ctx!, imageBitmap, (color: RGBColor) => {
      const hsv = this.rgb2hsv(color);
      hsv.h = this.materialInfo.value * 255;
      return this.hsv2rgb(hsv);
    });

    const dataUrl = canvas.toDataURL();
    this.updateTexture(dataUrl);
  }

  changeColorForDot(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    processForDot: (color: RGBColor) => RGBColor
  ) {
    const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      let color = {
        r: data[i + 0] * 255,
        g: data[i + 1] * 255,
        b: data[i + 2] * 255,
        a: data[i + 3] * 255,
      };

      color = processForDot(color);

      data[i + 0] = color.r / 255;
      data[i + 1] = color.g / 255;
      data[i + 2] = color.b / 255;
      data[i + 3] = color.a / 255;
    }
    ctx!.putImageData(imageData, 0, 0);
  }

  // https://lab.syncer.jp/Web/JavaScript/Snippet/66/
  rgb2hsv(color: RGBColor): HSVColor {
    const r = color.r / 255;
    const g = color.g / 255;
    const b = color.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    const diff = max - min;
    let h;
    if (min === max) h = 0;
    else if (min === r) h = 60 * ((b - g) / diff) + 180;
    else if (min === g) h = 60 * ((r - b) / diff) + 300;
    else if (min === b) h = 60 * ((g - r) / diff) + 60;
    else h = 0;

    const s = max == 0 ? 0 : diff / max;
    const v = max;

    return {
      h: h,
      s: s,
      v: v,
      a: color.a,
    };
  }

  // https://lab.syncer.jp/Web/JavaScript/Snippet/67/
  hsv2rgb(color: HSVColor): RGBColor {
    const h = color.h / 60;
    const s = color.s;
    const v = color.v;
    if (s == 0)
      return {
        r: v * 255,
        g: v * 255,
        b: v * 255,
        a: color.a,
      };

    var rgb;
    var i = parseInt(`${h}`);
    var f = h - i;
    var v1 = v * (1 - s);
    var v2 = v * (1 - s * f);
    var v3 = v * (1 - s * (1 - f));

    if (i === 0 || i === 6) rgb = [v, v3, v1];
    else if (i === 1) rgb = [v2, v, v1];
    else if (i === 2) rgb = [v1, v, v3];
    else if (i === 3) rgb = [v1, v2, v];
    else if (i === 4) rgb = [v3, v1, v];
    else if (i === 5) rgb = [v, v1, v2];
    else rgb = [0, 0, 0];

    return {
      r: rgb[0] * 255,
      g: rgb[1] * 255,
      b: rgb[2] * 255,
      a: color.a,
    };
  }

  public async updateTexture(url: string) {
    const material = this.materialInfo.material as HasMapMaterial;
    if (!material) return;
    if (material.map) {
      const data = await loadImage(url);
      material.map.image = data;
      this.$emit("onChangeMaterial", material);
    }
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
