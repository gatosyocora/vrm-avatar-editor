export interface OutputNode {
  children?: Array<number> | undefined;
  skin?: number | undefined;
  mesh?: number | undefined;
  name: string;
  rotation: [number, number, number, number];
  scale: [number, number, number];
  translation: [number, number, number];
}
