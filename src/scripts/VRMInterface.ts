import * as THREE from 'three';

export interface Arrays extends Array<THREE.Object3D|THREE.Group|THREE.SkinnedMesh|THREE.Bone> {}

export interface VRMSkinnedMesh extends THREE.SkinnedMesh {
    geometry: THREE.BufferGeometry;
}

export interface VRMGroup extends THREE.Group {
    children: Array<VRMSkinnedMesh>;
}