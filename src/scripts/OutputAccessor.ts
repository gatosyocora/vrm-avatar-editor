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
