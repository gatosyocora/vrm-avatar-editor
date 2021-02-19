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
