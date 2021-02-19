export interface OutputBufferView {
  buffer: number;
  byteLength: number;
  byteOffset: number;
  target?: number | undefined;
}
