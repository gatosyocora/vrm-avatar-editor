<!-- https://qiita.com/kokorau/items/1c8ba182699b3646b363 -->
<template>
  <canvas id="canvas" width="600" height="400"></canvas>
</template>

<script type="ts">
import { Component, Vue } from "vue-property-decorator";
import * as THREE from "three";

@Component
export default class RotateBox extends Vue {
  data() {
    const scene = new THREE.Scene();
    const renderer = null;
    const camera = new THREE.PerspectiveCamera(75, 600/400, 0.1, 1000);
    const light = new THREE.DirectionalLight(0xffffff);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshNormalMaterial();
    const cube = new THREE.Mesh(geometry, material);
    return { scene, renderer, camera, light, geometry, material, cube };
  }
  mounted() {
    const $canvas = document.getElementById("canvas");
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: $canvas
    });

    this.camera.position.set(0, 0, 2);
    this.light.position.set(0, 0, 10);
    this.scene.add(this.cube);
    this.scene.add(this.light);

    this.animate();
  }
  animate() {
      requestAnimationFrame(this.animate);

      this.cube.rotation.x += 0.02;
      this.cube.rotation.y += 0.02;

      this.renderer.render(this.scene, this.camera);
    }
};
</script>
