<template>
  <div>
    <div class="top layer-size">
      <div
        class="layer2 layer-size layer white"
        :class="{outline:isDragOver}"
        @dragover.prevent="onDrag('over')"
        @dragleave.prevent="onDrag('leave')"
        @drop.prevent="onDrop">
        <div>VRMをドラッグ&ドロップ</div>
        <p><input type="file" v-on:change="onFileChange" accept=".vrm"></p>
      </div>
      <canvas id="canvas" width="600" height="400" class="layer1 layer-size layer"></canvas>
    </div>
    <div v-if="meta !== null">
      <img v-if="meta.commercialUssageName === 'Allow'" class="license-img" src="@/assets/license/com-ok.png" />
      <img v-else class="license-img" src="@/assets/license/com-ng.png" />

      <img v-if="meta.sexualUssageName === 'Allow'" class="license-img" src="@/assets/license/sex-ok.png" />
      <img v-else class="license-img" src="@/assets/license/sex-ng.png" />

      <img v-if="meta.violentUssageName === 'Allow'" class="license-img" src="@/assets/license/vio-ok.png" />
      <img v-else class="license-img" src="@/assets/license/vio-ng.png" />
    </div>
    <div v-if="meta !== null" class="undot-list centering-list my-list">
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
          <a v-bind:href="meta.otherLicenseUrl" target="_blank">
            {{meta.otherLicenseUrl}}
          </a>
        </li>
        <li>OtherPermission : 
          <a v-bind:href="meta.otherPermissionUrl" target="_blank">
            {{meta.otherPermissionUrl}}
          </a>
        </li>
        <li>ContactInformation : 
          <a v-bind:href="meta.contactInformation" target="_blank">
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

  interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
  }

  @Component
  export default class TestVRM extends Vue {
    private scene = new THREE.Scene();
    private renderer: THREE.WebGLRenderer | null = null;
    private camera = new THREE.PerspectiveCamera(75, 600/400, 0.1, 1000);
    private light = new THREE.DirectionalLight(0xffffff);
    
    public isDragOver: boolean = false;

    public onDrag(type: string) {
      this.isDragOver = type === "over";
    }
    public onDrop(e: DragEvent) {

      if (e.dataTransfer === null || 
          e.dataTransfer.files === null) return;

      this.isDragOver = false;
      const file = e.dataTransfer.files[0];
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
                    this.scene.remove(this.vrmObject!);
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

    @Prop()
    public meta: VRMMeta | undefined | null = null;

    private vrmObject: THREE.Scene | THREE.Group | null = null;

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
    
    public onFileChange (e: HTMLInputEvent) {

      if (e.target.files === null) return;

      const file = e.target.files[0];
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
<style>
  .top {
    position: relative;
  }
  .layer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }
  .layer-size {
    width: 600px;
    height: 400px;
    margin: auto;
  }
  .layer1 {
    z-index: 1;
  }
  .layer2 {
    z-index: 2;
  }
  .white {
    color: #ffffff;
  }
  .outline {
    outline: 5px dashed red;
  }
  .license-img {
    width: 100px;
    height: auto;
  }
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
</style>