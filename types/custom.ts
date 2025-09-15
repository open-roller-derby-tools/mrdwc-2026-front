export interface VenueData {
  name: string;
  address: string;
  map_link: string;
  image: string;
  image_alt: string;
}

export interface Team {
  id: number;
  name: string;
}

export interface TeamMember {
  id: number;
  team_id: number;
  name: string;
  number: string;
  role: string;
  pronouns: string;
}
