export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  origin: { name: string };
  location: { name: string };
  image: string;
}

export interface ApiResponse {
  info: {
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
}