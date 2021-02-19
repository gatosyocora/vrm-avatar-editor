export interface OutputNode {
  children?: Array<number> | undefined;
  skin?: number | undefined;
  name: string;
  rotation: { x: number; y: number; z: number; w: number };
  scale: { x: number; y: number; z: number };
  translation: { x: number; y: number; z: number };
}
