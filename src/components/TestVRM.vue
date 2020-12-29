<template>
  <canvas id="canvas" width="600" height="400"></canvas>
</template>

  import { Component, Vue } from "vue-property-decorator";
<script lang="ts">
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
  import { VRM } from '@pixiv/three-vrm';

  @Component
  export default class TestVRM extends Vue {
    data() {
      const scene = new THREE.Scene();
      const renderer = null;
      const camera = new THREE.PerspectiveCamera(75, 600/400, 0.1, 1000);
      const light = new THREE.DirectionalLight(0xffffff);
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshNormalMaterial();
      return { scene, renderer, camera, light, geometry, material };
    }
    mounted() {

const loader = new GLTFLoader();
loader.load(

	// URL of the VRM you want to load
	'/models/AliciaSolid.vrm',

	// called when the resource is loaded
	( gltf ) => {

		// generate a VRM instance from gltf
		VRM.from( gltf ).then( ( vrm ) => {

			// add the loaded vrm to the scene
			this.scene.add( vrm.scene );

			// deal with vrm features
			console.log( vrm );

		} );

	},

	// called while loading is progressing
	( progress ) => console.log( 'Loading model...', 100.0 * ( progress.loaded / progress.total ), '%' ),

	// called when loading has errors
	( error ) => console.error( error )

);

      const $canvas = document.getElementById("canvas");
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: $canvas
      });

      this.camera.position.set(0, 1, 2);
      this.light.position.set(0, 0, 10);
      this.scene.add(this.light);

      this.animate();
    }
    animate() {
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
      }
  };
</script>