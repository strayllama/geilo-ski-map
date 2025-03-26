export interface MapItem {
  id: string;
  name: string;
  isOpen: boolean;
  type: 'slope' | 'lift';
  difficulty?: 'very easy' | 'easy' | 'medium' | 'demanding';
}

export interface MapSide {
  name: string;
  image: string;
}