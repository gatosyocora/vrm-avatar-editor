<template>
  <div>
    <canvas id="canvas" width="600" height="400"></canvas>
    <p><input type="file" v-on:change="onFileChange" accept=".vrm"></p>
    <p v-if="meta !== null">Title : {{meta.title}}, Version : {{meta.version}}</p>
    <p v-if="meta !== null">Author : {{meta.author}}</p>
    <p v-if="meta !== null">AllowUser : {{meta.allowedUserName}}</p>
    <p v-if="meta !== null">CommercialUssage : {{meta.commercialUssageName}}</p>
    <p v-if="meta !== null">SexualUssage : {{meta.sexualUssageName}}</p>
    <p v-if="meta !== null">ViolentUssage : {{meta.violentUssageName}}</p>
    <p v-if="meta !== null">LicenseName : {{meta.licenseName}}</p>
    <p v-if="meta !== null">OtherLicenseUrl : 
      <a v-bind:href="meta.otherLicenseUrl" target="_blank">
        {{meta.otherLicenseUrl}}
      </a>
    </p>
    <p v-if="meta !== null">OtherPermissionUrl : 
      <a v-bind:href="meta.otherPermissionUrl" target="_blank">
        {{meta.otherPermissionUrl}}
      </a>
    </p>
    <p v-if="meta !== null">ContactInformation : 
      <a v-bind:href="meta.contactInformation" target="_blank">
        {{meta.contactInformation}}
      </a>
    </p>
    <p v-if="meta !== null">Reference : {{meta.reference}}</p>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from "vue-property-decorator";
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
  import { VRM } from '@pixiv/three-vrm';

  @Component
  export default class TestVRM extends Vue {
    private const scene = new THREE.Scene();
    private renderer = null;
    private const camera = new THREE.PerspectiveCamera(75, 600/400, 0.1, 1000);
    private const light = new THREE.DirectionalLight(0xffffff);
    private geometry = new THREE.BoxGeometry(1, 1, 1);
    private material = new THREE.MeshNormalMaterial();
    
    @Prop()
    public meta?: VRM.VRMMeta = null;

    private vrmObject? = null;

    mounted() {
      const $canvas = document.getElementById("canvas");
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
        this.renderer.render(this.scene, this.camera);
    }
    
    public onFileChange (e) {
      const file = e.target.files[0]
      const url:string = window.URL.createObjectURL(file);

      const loader = new GLTFLoader();
      loader.load(

	      // URL of the VRM you want to load
	      url,

	      // called when the resource is loaded
	      ( gltf ) => {

		      // generate a VRM instance from gltf
		      VRM.from( gltf ).then( ( vrm ) => {

                  if (this.vrmObject !== null) {
                    this.scene.remove(this.vrmObject);
                  }

			      // add the loaded vrm to the scene
			      this.scene.add( vrm.scene );

			      // deal with vrm features
                  this.meta = vrm.meta;
                  this.vrmObject = vrm.scene;
			      console.log( vrm );
	      	} );

	      },

      	// called while loading is progressing
      	( progress ) => console.log( 'Loading model...', 100.0 * ( progress.loaded / progress.total ), '%' ),

      	// called when loading has errors
      	( error ) => console.error( error )

      );
    }
  };
</script>