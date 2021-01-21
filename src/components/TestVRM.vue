<template>
  <canvas id="canvas" width="600" height="400" />
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from "vue-property-decorator";
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
  import { VRM, VRMMeta } from '@pixiv/three-vrm';

  interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
  }

  @Component
  export default class TestVRM extends Vue {
    private scene = new THREE.Scene();
    private renderer: THREE.WebGLRenderer | null = null;
    private camera = new THREE.PerspectiveCamera(75, 600/400, 0.1, 1000);
    private light = new THREE.DirectionalLight(0xffffff);

    @Prop()
    public meta: VRMMeta | undefined | null = null;

    @Prop()
    public materials: THREE.Material[] | undefined | null = null;

    @Prop()
    public vrmObject: THREE.Scene | THREE.Group | null = null;

    mounted() {
      const $canvas = <HTMLCanvasElement> document.getElementById("canvas");
      if ($canvas === null) return;

      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: $canvas
      });

      this.camera.position.set(0, 1, -1.5);
      this.camera.rotation.set(0, Math.PI, 0);
      this.light.position.set(0, 0, 10);
      this.scene.add(this.light);

      this.animate();
    }
    animate() {
        requestAnimationFrame(this.animate);
        this.renderer!.render(this.scene, this.camera);
    }

    @Watch("vrmObject", {immediate: true})
    public updateVrm(newObject: THREE.Scene | THREE.Group) {
      if (this.vrmObject) {
        this.scene = new THREE.Scene();
        this.scene.add(this.light);
        this.animate();
      }
      this.vrmObject = newObject;

      // add the loaded vrm to the scene
      this.scene.add( this.vrmObject );
    }
  };
</script>
<style>
</style>