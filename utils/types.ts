export interface ParsedData {
  [key: string]: string;
}

export interface GraphicProps {
  data: ParsedData[];
  month: number;
  year: number;
}

export type SpeciesBreakdown = {
  [key: string]: number;
  other: number;
} | null;

export interface Coordinate {
  x: number;
  y: number;
}
