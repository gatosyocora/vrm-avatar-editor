import { shallowMount } from "@vue/test-utils";
import ModelInfoView from "@/components/ModelInfoView.vue";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { VRM } from "@pixiv/three-vrm";
import {
  BufferAttribute,
  BufferGeometry,
  Group,
  Object3D,
  SkinnedMesh,
} from "three";

const vrmModels = [{ name: "Shapell", path: "./vrm/shapell3.vrm" }];

const number3 = [0, 0, 0];

let testModel: Object3D;
beforeAll(() => {
  testModel = new Object3D();
  const rootBone = new Object3D();
  const geometry = new BufferGeometry();
  const attribute = new BufferAttribute(
    new Float32Array([...number3, ...number3, ...number3]),
    3
  );
  geometry.setAttribute("position", attribute);
  geometry.setAttribute("normal", attribute);
  const groupMesh = new Group();
  groupMesh.children.push(new SkinnedMesh(geometry), new SkinnedMesh(geometry));
  const mesh = new SkinnedMesh(geometry);
  testModel.children.push(rootBone, groupMesh, mesh);
});

describe("getMeshCount", () => {
  test("can execute", () => {
    const wrapper = shallowMount(ModelInfoView);
    wrapper.vm.$emit("getMeshCount", testModel.children);
    expect(wrapper.emitted("getMeshCount")).toBeDefined();
  });
  test("return correct value", () => {
    const wrapper = shallowMount(ModelInfoView);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vm = wrapper.vm as any;
    expect(vm.getMeshCount(testModel.children)).toBe(2);
  });
});

describe("getPolygonCount", () => {
  test("can execute", () => {
    const wrapper = shallowMount(ModelInfoView);
    wrapper.vm.$emit("getPolygonCount", testModel.children);
    expect(wrapper.emitted("getPolygonCount")).toBeDefined();
  });
  test("return correct value", () => {
    const wrapper = shallowMount(ModelInfoView);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vm = wrapper.vm as any;
    expect(vm.getPolygonCount(testModel.children)).toBe(6);
  });
});

// TODO: ちゃんとテストができるように修正する
describe.skip.each(vrmModels)("getMeshCount", (vrmModel) => {
  test(vrmModel.name, (done) => {
    loadVrm(vrmModel.path, (vrm) => {
      const wrapper = shallowMount(ModelInfoView);
      wrapper.vm.$emit("getMeshCount", vrm);
      expect(wrapper.emitted()).toBe(1);
      done();
    });
  });
});

describe.skip.each(vrmModels)("getPolygonCount", (vrmModel) => {
  test(vrmModel.name, (done) => {
    loadVrm(vrmModel.path, (vrm) => {
      const wrapper = shallowMount(ModelInfoView);
      wrapper.vm.$emit("getPolygonCount", vrm);
      expect(wrapper.emitted()).toBe(27873);
      done();
    });
  });
});

describe.skip.each(vrmModels)("getBoneCount", (vrmModel) => {
  test(vrmModel.name, (done) => {
    loadVrm(vrmModel.path, (vrm) => {
      const wrapper = shallowMount(ModelInfoView);
      wrapper.vm.$emit("getBoneCount", vrm);
      expect(wrapper.emitted()).toBe(180);
      done();
    });
  });
});

describe.skip.each(vrmModels)("getBlendShapeCount", (vrmModel) => {
  test(vrmModel.name, (done) => {
    loadVrm(vrmModel.path, (vrm) => {
      const wrapper = shallowMount(ModelInfoView);
      wrapper.vm.$emit("getBlendShapeCount", vrm);
      expect(wrapper.emitted()).toBe(47);
      done();
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
