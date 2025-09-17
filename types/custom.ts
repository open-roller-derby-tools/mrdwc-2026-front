export interface VenueData {
  name: string;
  address: string;
  map_link: string;
  image: string;
  image_alt: string;
}

export interface Schema {
  teams: Team[];
  team_members: TeamMember[];
}

export interface Team {
  id: number;
  name: string;
  members: number[] | TeamMember[];
}

export interface TeamMember {
  id: number;
  team: number | Team;
  name: string;
  number: string;
  role: string;
  translations: TeamMemberTranslation[];
}

export interface TeamMemberTranslation {
  id: number;
  languages_code: string;
  pronouns: string;
  team_member_id: number;
}
