export interface ParsedData {
  [key: string]: string;
}

export interface GraphicProps {
  data: ParsedData[];
}

export type SpeciesBreakdown = {
  [key: string]: number;
  other: number;
} | null;
