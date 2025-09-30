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
  pages: IMenuHeaderPageWrapper[];
}

export interface IMenuHeaderPageWrapper {
  item: IPage;
}

export interface IMenuHeaderRequestData {
  data: IMenuHeader;
}

// Blocks

export interface IBlockRichText {
  name: string;
  translations: IBlockRichTextTranslation[];
}

export interface IBlockRichTextTranslation extends ITranslation {
  title: string;
  content: string;
}

export interface ILocalizedBlockRichText {
  name: string;
  title: string;
  content: string;
}

export interface IBlockCustom {
  name: string;
}

export interface IPageBlockWrapper {
  order: number;
  collection: string;
  item: IBlockRichText | IBlockCustom;
}

// Pages

export interface IPage {
  slug: string;
  blocks: IPageBlockWrapper[];
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
  blocks: (ILocalizedBlockRichText | IBlockCustom)[] | null;
}

export interface IPagesRequestData {
  data: IPage[];
}
