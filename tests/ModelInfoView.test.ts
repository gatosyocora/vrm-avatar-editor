import { shallowMount } from "@vue/test-utils";
import ModelInfoView from "@/components/ModelInfoView.vue";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { VRM } from "@pixiv/three-vrm";

describe("ModelInfoView.vue", () => {
  test("getMeshCount shapell", () => {
    loadVrm("./vrm/shapell3.vrm", (vrm) => {
      const wrapper = shallowMount(ModelInfoView);
      wrapper.vm.$emit("getMeshCount", vrm);
      expect(wrapper.emitted()).toBe(1);
    });
  });
});

describe("ModelInfoView.vue", () => {
  test("getPolygonCount shapell", () => {
    loadVrm("./vrm/shapell3.vrm", (vrm) => {
      const wrapper = shallowMount(ModelInfoView);
      wrapper.vm.$emit("getPolygonCount", vrm);
      expect(wrapper.emitted()).toBe(27873);
    });
  });
});

describe("ModelInfoView.vue", () => {
  test("getBoneCount shapell", () => {
    loadVrm("./vrm/shapell3.vrm", (vrm) => {
      const wrapper = shallowMount(ModelInfoView);
      wrapper.vm.$emit("getBoneCount", vrm);
      expect(wrapper.emitted()).toBe(180);
    });
  });
});

describe("ModelInfoView.vue", () => {
  test("getBlendShapeCount shapell", () => {
    loadVrm("./vrm/shapell3.vrm", (vrm) => {
      const wrapper = shallowMount(ModelInfoView);
      wrapper.vm.$emit("getBlendShapeCount", vrm);
      expect(wrapper.emitted()).toBe(47);
    });
  });
});

const loadVrm = (
  url: string,
  onDone: (vrm: THREE.Group | THREE.Scene) => void
) => {
  const loader = new GLTFLoader();
  loader.load(
    // URL of the VRM you want to load
    url,

    // called when the resource is loaded
    (gltf) => {
      // generate a VRM instance from gltf
      VRM.from(gltf).then((vrm) => {
        onDone(vrm.scene);
      });
    },

    // called while loading is progressing
    (progress) =>
      console.log(
        "Loading model...",
        100.0 * (progress.loaded / progress.total),
        "%"
      ),

    // called when loading has errors
    (error) => console.error(error)
  );
};
