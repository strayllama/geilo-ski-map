export interface MapItem {
  prefix: string;
  name: string;
  fullName: string;
  isOpen: boolean;
  type: 'slope' | 'lift';
  difficulty?: 'green' | 'blue' | 'red' | 'black';
}

export interface MapItemLive {
  fullName: string;
  isOpen: boolean;
}

export interface MapSide {
  name: string;
  image: string;
  mapItems: MapItem[]
  coordinates: Coordinate[]
}

export interface Coordinate {
  x: number;
  y: number;
  id?: string;
}
