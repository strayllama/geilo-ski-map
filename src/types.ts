export interface MapItem {
  prefix: string;
  name: string;
  fullName: string;
  isOpen: boolean;
  type: 'slope' | 'lift';
  difficulty?: 'very easy' | 'easy' | 'medium' | 'demanding';
}

export interface MapSide {
  name: string;
  image: string;
  mapItems: MapItem[]
}

export interface Coordinate {
  x: number;
  y: number;
  id?: string;
}
