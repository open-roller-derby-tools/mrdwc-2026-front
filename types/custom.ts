// GLOBAL

export interface ITranslation {
  languages_code: string;
}

// VENUES

export interface IVenue {
  name: string;
  address: string;
  map_link: string;
  image: string;
  image_alt: string;
}

// TEAMS & TEAM MEMBERS

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

// MENUS

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

// BLOCKS

export interface ILocalizedBlock {
  collection: string;
}

// Rich Text
export interface IBlockRichText {
  name: string;
  classes: string;
  translations: IBlockRichTextTranslation[];
}

export interface IBlockRichTextTranslation extends ITranslation {
  title: string;
  content: string;
}

export interface ILocalizedBlockRichText extends ILocalizedBlock {
  name: string;
  classes: string;
  title: string;
  content: string;
}

// Custom
export interface IBlockCustom {
  name: string;
  classes: string;
}

export interface ILocalizedBlockCustom extends ILocalizedBlock {
  name: string;
  classes: string;
}

// Page Block Wrapper
export interface IPageBlockWrapper {
  order: number;
  collection: string;
  item: IBlockRichText | IBlockCustom;
}

// PAGES

export interface IPage {
  slug: string;
  classes: string;
  blocks: IPageBlockWrapper[];
  translations: IPageTranslation[];
}

export interface IPageTranslation extends ITranslation {
  title: string;
  menu_title: string;
}

// A useable
export interface ILocalizedPage {
  slug: string;
  classes: string;
  title: string;
  menu_title: string;
  blocks: (ILocalizedBlockRichText | ILocalizedBlockCustom)[] | null;
}

export interface IPagesRequestData {
  data: IPage[];
}
