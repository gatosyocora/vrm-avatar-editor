<template>
  <canvas id="canvas" />
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { VRM, VRMMeta } from "@pixiv/three-vrm";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Bone, Object3D, Vector3 } from "three";

@Component
export default class VRMCanvasView extends Vue {
  private scene: THREE.Scene | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  private light = new THREE.DirectionalLight(0xffffff, 2);
  private gridHelper = new THREE.GridHelper(10, 10);
  private axesHelper = new THREE.AxesHelper(5);
  private controls: OrbitControls | null = null;

  @Prop()
  public meta: VRMMeta | undefined | null = null;

  @Prop()
  public materials: THREE.Material[] | undefined | null = null;

  @Prop()
  public vrmObject: THREE.Scene | THREE.Group | null = null;

  mounted() {
    const $canvas = <HTMLCanvasElement>document.getElementById("canvas");
    if ($canvas === null) return;

    $canvas.width = window.innerWidth;
    $canvas.height = window.innerHeight;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: $canvas,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.camera.position.set(0, 1, -1.5);
    this.camera.rotation.set(0, Math.PI, 0);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.screenSpacePanning = true;
    this.controls.target.set(0.0, 1.0, 0.0);
    this.controls.update();
    this.light.position.set(0, 0, -10);
    this.initScene();
  }
  animate() {
    if (!this.scene) return;
    requestAnimationFrame(this.animate);
    this.renderer!.render(this.scene, this.camera);
  }

  @Watch("vrmObject", { immediate: true })
  public updateVrm(newObject: THREE.Scene | THREE.Group) {
    if (!this.scene) return;

    if (this.vrmObject) {
      this.initScene();
      const rootBone = this.vrmObject.children.filter(
        (child) =>
          child.children.length > 0 && child.children[0].type === "Bone"
      )[0];
      const boneLine = this.generateBoneSupporter(rootBone);
      this.scene.add(boneLine);
    }
    this.vrmObject = newObject;

    if (newObject === null) return;

    // add the loaded vrm to the scene
    this.scene.add(this.vrmObject);
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.add(this.light);
    this.scene.add(this.gridHelper);
    this.scene.add(this.axesHelper);
    this.animate();
  }

  generateBoneSupporter(
    node: Object3D | Bone,
    parentNode?: Object3D | Bone,
    material?: THREE.LineBasicMaterial
  ): THREE.Line {
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
