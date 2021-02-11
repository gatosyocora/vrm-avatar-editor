<template>
  <canvas id="canvas" width="600" height="400" />
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from "vue-property-decorator";
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
  import { VRM, VRMMeta } from '@pixiv/three-vrm';
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

  @Component
  export default class VRMCanvasView extends Vue {
    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer | null = null;
    private camera = new THREE.PerspectiveCamera(75, 600/400, 0.1, 1000);
    private light = new THREE.DirectionalLight(0xffffff);
    private gridHelper = new THREE.GridHelper(10, 10);
    private axesHelper = new THREE.AxesHelper(5);
    private controls: OrbitControls;

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
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.screenSpacePanning = true;
      this.controls.target.set(0.0, 1.0, 0.0);
      this.controls.update();
      this.light.position.set(0, 0, 10);
      this.initScene();
    }
    animate() {
        requestAnimationFrame(this.animate);
        this.renderer!.render(this.scene, this.camera);
    }

    @Watch("vrmObject", {immediate: true})
    public updateVrm(newObject: THREE.Scene | THREE.Group) {
      
      if (this.vrmObject) {
        this.initScene();
      }
      this.vrmObject = newObject;

      if (newObject === null) return;

      // add the loaded vrm to the scene
      this.scene.add( this.vrmObject );
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.add(this.light);
        this.scene.add(this.gridHelper);
        this.scene.add(this.axesHelper);
        this.animate();
    }
  };
</script>
<style>
</style>