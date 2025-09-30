// Global

export interface ITranslation {
  languages_code: string;
}

// Venues

export interface IVenue {
  name: string;
  address: string;
  map_link: string;
  image: string;
  image_alt: string;
}

// Teams & Team Members

export interface ITeam {
  id: number;
  name: string;
  members: number[] | ITeamMember[];
}

export interface ILocalizedTeam {
  id: number;
  name: string;
  members: number[] | ILocalizedTeamMember[];
}

export interface ITeamMember {
  id: number;
  team: number | ITeam;
  name: string;
  number: string;
  role: string;
  translations: ITeamMemberTranslation[];
}

export interface ILocalizedTeamMember {
  id: number;
  team: number | ITeam;
  name: string;
  number: string;
  role: string;
  pronouns: string;
}

export interface ITeamMemberTranslation extends ITranslation {
  pronouns: string;
  team_member_id: number;
}

export interface ITeamsRequestData {
  data: ITeam[];
}

// Menus

export interface IMenuHeader {
  id: number;
  translations: IMenuHeaderTranslation[];
}

export interface IMenuHeaderTranslation extends ITranslation {
  pages: IMenuHeaderTranslationPage[];
}

export interface IMenuHeaderTranslationPage {
  item: IPage;
}

export interface IMenuHeaderRequestData {
  data: IMenuHeader;
}

// Pages

export interface IPage {
  id: number;
  slug: string;
  // TODO: blocks
  translations: IPageTranslation[];
}

export interface IPageTranslation extends ITranslation {
  title: string;
  menu_title: string;
}

export interface ILocalizedPage {
  slug: string;
  title: string;
  menu_title: string;
}
