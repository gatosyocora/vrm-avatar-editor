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
