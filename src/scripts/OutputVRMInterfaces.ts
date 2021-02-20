export interface OutputAccessor {
  bufferView: number;
  byteOffset: number;
  componentType: number;
  count: number;
  max: [number, number, number] | undefined;
  min: [number, number, number] | undefined;
  normalized: boolean;
  type: string;
}

export interface OutputBufferView {
  buffer: number;
  byteLength: number;
  byteOffset: number;
  target?: number | undefined;
}

export interface OutputImage {
  bufferView: number;
  mimeType: string;
  name: string;
}

export interface OutputMaterial {
  alphaCutoff?: number | undefined;
  alphaMode: string;
  doubleSided: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  extensions?: { KHR_materials_unlit: {} } | undefined;
  name: string;
  pbrMetallicRoughness: {
    baseColorFactor?: [number, number, number, number] | undefined;
    baseColorTexture?: OutputBaseTexture | undefined;
    metallicFactor: number;
    roughnessFactor: number;
  };
}

export interface OutputBaseTexture {
  extensions: {
    KHR_texture_transform: {
      offset: [number, number];
      scale: [number, number];
    };
  };
  index: number;
  texCoord: number;
}

export interface OutputMesh {
  extras: {
    targetNames: Array<string>;
  };
  name: string;
  primitives: Array<OutputPrimitive>;
}

export interface OutputPrimitive {
  attributes: {
    JOINTS_0: number;
    NORMAL: number;
    POSITION: number;
    TEXCOORD_0: number;
    WEIGHTS_0: number;
  };
  extras: {
    targetNames: Array<string>;
  };
  indices: number;
  material: number;
  mode: number;
  targets?:
    | Array<{
        NORMAL: number;
        POSITION: number;
      }>
    | undefined;
}

export interface OutputNode {
  children?: Array<number> | undefined;
  skin?: number | undefined;
  mesh?: number | undefined;
  name: string;
  rotation: [number, number, number, number];
  scale: [number, number, number];
  translation: [number, number, number];
}

export interface OutputSampler {
  magFilter: number;
  minFilter: number;
  wrapS: number;
  wrapT: number;
}

export interface OutputScene {
  nodes: Array<number>;
}

export interface OutputSkin {
  inverseBindMatrices: number;
  joints: Array<number>;
  skeleton: number;
}

export interface OutputTexture {
  sampler: number;
  source: number;
}

export interface OutputVRMMeta {
  allowedUserName?: string | undefined;
  author?: string | undefined;
  commercialUssageName?: string | undefined;
  contactInformation?: string | undefined;
  licenseName?: string | undefined;
  otherLicenseUrl?: string | undefined;
  otherPermissionUrl?: string | undefined;
  reference?: string | undefined;
  sexualUssageName?: string | undefined;
  texture?: number | undefined;
  title?: string | undefined;
  version?: string | undefined;
  violentUssageName?: string | undefined;
}
