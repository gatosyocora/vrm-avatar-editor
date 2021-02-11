<template>
  <div class="home">
    <v-app-bar
      danse
      dark
    >
      <v-toolbar-title>VRM Avatar Editor</v-toolbar-title>
    </v-app-bar>    
    <p id="message">ローカル環境で処理しているため、VRMファイルをサーバーにアップロードしていません。</p>
    <div id="main">
      <center>
        <div class="top">
          <div
            v-if="vrmObject === null"
            class="layer2 layer-size layer"
            :class="{outline:isDragOver}"
            @dragover.prevent="onDrag('over')"
            @dragleave.prevent="onDrag('leave')"
            @drop.prevent="onDrop">
            <div class="white-color">VRMをドラッグ&ドロップ</div>
            <p><input type="file" class="white-color" @change="onFileChange" accept=".vrm"></p>
          </div>
          <VRMCanvas :vrmObject="vrmObject" class="layer1 layer-size layer" />
        </div>
      </center>
    </div>
    <div id="menu">
      <v-card>
        <v-tabs
          fixed-tabs
          dark
        >
          <v-tab @click="changeTab(0)" :class="{'active': currentTab === 0}">Meta</v-tab>
          <v-tab @click="changeTab(1)" :class="{'active': currentTab === 1}">Materials</v-tab>
          <v-tab @click="changeTab(2)" :class="{'active': currentTab === 2}">Model</v-tab>
        </v-tabs>
        <div class="margin-area contents">
          <div v-show="currentTab === 0">
            <MetaView :meta="meta"/>
          </div>
          <div v-show="currentTab === 1">
            <MaterialView :materials="materials"/>
          </div>
          <div v-show="currentTab === 2">
            <ModelInfoView :vrmObject="vrmObject" :materials="materials"/>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VRM, VRMMeta } from '@pixiv/three-vrm';

import VRMCanvas from '@/components/VRMCanvasView.vue'; // @ is an alias to /src
import MetaView from '@/components/MetaView.vue';
import MaterialView from '@/components/MaterialView.vue';
import ModelInfoView from '@/components/ModelInfoView.vue';

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  components: {
    VRMCanvas,
    MetaView,
    MaterialView,
    ModelInfoView,
  },
})

export default class Home extends Vue 
{
    @Prop()
    public meta: VRMMeta | undefined | null = null;

    @Prop()
    public materials: THREE.Material[] | undefined | null = null;

    @Prop()
    public vrmObject: THREE.Scene | THREE.Group | null = null;

    @Prop()
    public currentTab: Number = 0;

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

      this.loadVrm(url);
    }

    public onFileChange (e: HTMLInputEvent) {

      if (e.target.files === null) return;

      const file = e.target.files[0];
      const url:string = window.URL.createObjectURL(file);

      this.loadVrm(url);
    }

    public loadVrm(url: string) {
      const loader = new GLTFLoader();
      loader.load(

	      // URL of the VRM you want to load
	      url,

	      // called when the resource is loaded
	      ( gltf ) => {

		      // generate a VRM instance from gltf
		      VRM.from( gltf ).then( ( vrm ) => {
              // deal with vrm features
              this.meta = vrm.meta;
              this.materials = vrm.materials;
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

    public changeTab(tabNumber: Number) {
      this.currentTab = tabNumber;
    }
}
</script>
<style>
  .tabs {
    overflow: hidden;
  }
  .tabs li {
    width: 100px;
    font-size: 20px;
    text-align: center;
    margin: 15px;
    padding: 5px;
    color: black;
    background: white;
    border: 1px solid black;
    list-style: none;
    display: inline;
  }
  .tabs li.active{
    color: white;
    background: black;
  }

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
    width: 100%;
    height: 100%;
    margin: auto;
  }
  .layer1 {
    z-index: 1;
  }
  .layer2 {
    z-index: 2;
  }
  .white-color {
    color: #ffffff;
  }
  .outline {
    outline: 5px dashed red;
  }
  .margin-area {
    margin: 20px;
  }
  .contents {
    padding: 10px;
  }
  
  .v-data-table__wrapper tr:hover {
    background: white !important;
  }

  #main {
    float: none;
    z-index: 0;
    position: relative;
  }

  #menu {
    float: right;
    width: 30%;
    z-index: 9;
    position: relative;
  }

  #message {
    float: left;
    z-index: 8;
    position: relative;
    color: white;
    font-size: 20px;
    margin: 10px;
  }
</style>