import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { VRM } from "@pixiv/three-vrm";
import VRMExporter from "@/scripts/VRMExporter";

const vrmModels = [{ name: "Shapell", path: "./tests/vrm/shapell3.vrm" }];

jest.setTimeout(30000);

describe.skip.each(vrmModels)("Has no error when parse", (vrmModel) => {
  test(vrmModel.name, (done) => {
    loadVrm(vrmModel.path, (vrm) => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      expect(new VRMExporter().parse(vrm, () => {})).not.toThrow();
      done();
    });
  });
});
// TODO: 一致しているか確認するテストを作成中
describe.skip.each(vrmModels)("Match * with exported", (vrmModel) => {
  describe(vrmModel.name, () => {
    test("Materials", (done) => {
      loadVrm(vrmModel.path, (vrm) => {
        checkMatch(vrm, (newVrm) => {
          expect(newVrm.materials?.length).toBe(vrm.materials?.length);
          if (!vrm.materials || !newVrm.materials) return;
          for (let i = 0; i < vrm.materials?.length; i++) {
            const material = vrm.materials[i];
            const newMaterial = newVrm.materials[i];
            expect(newMaterial.name).toMatch(material.name);
          }
          done();
        });
      });
    });
    test("Meta", (done) => {
      loadVrm(vrmModel.path, (vrm) => {
        checkMatch(vrm, (newVrm) => {
          if (!vrm.meta || !newVrm.meta) return;
          const vrmValues = Object.values(vrm.meta);
          const newVrmValues = Object.values(newVrm.meta);
          for (let i = 0; i < vrmValues.length; i++) {
            expect(newVrmValues[i]).toMatch(vrmValues[i]);
          }
          done();
        });
      });
    });
    test("Scene", (done) => {
      loadVrm(vrmModel.path, (vrm) => {
        checkMatch(vrm, (newVrm) => {
          expect(newVrm.scene.children.length).not.toBe(0);
          expect(newVrm.scene.children.length).toBe(vrm.scene.children.length);
          checkMatchChildrens(vrm.scene, newVrm.scene);
          done();
        });
      });
    });
  });
});

const checkMatchChildrens = (
  parent1: THREE.Scene | THREE.Group | THREE.Object3D,
  parent2: THREE.Scene | THREE.Group | THREE.Object3D
): void => {
  for (let i = 0; i < parent1.children.length; i++) {
    const child1 = parent1.children[i];
    const child2 = parent2.children[i];
    expect(child1.type).toBe(child2.type);
    expect(child1.name).toBe(child2.name);
    expect(child1.children.length).toBe(child2.children.length);
    if (child1.children.length > 0 && child2.children.length > 0) {
      checkMatchChildrens(child1, child2);
    }
  }
};

const checkMatch = (vrm: VRM, onDone: (newVrm: VRM) => void) => {
  new VRMExporter().parse(vrm, (outputVrm) => {
    const blob = new Blob([outputVrm], { type: "octet/stream" });
    const url = URL.createObjectURL(blob);
    loadVrm(url, (newVrm) => {
      onDone(newVrm);
    });
  });
};

const loadVrm = (url: string, onDone: (vrm: VRM) => void) => {
  const loader = new GLTFLoader();
  loader.load(
    // URL of the VRM you want to load
    url,

    // called when the resource is loaded
    (gltf) => {
      // generate a VRM instance from gltf
      VRM.from(gltf).then((vrm) => {
        onDone(vrm);
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
