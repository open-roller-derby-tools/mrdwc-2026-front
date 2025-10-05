// GLOBAL

export interface ITranslation {
  languages_code: string;
}

// MENUS

export interface IMenu {
  name: string;
  classes: string;
  translations: IMenuTranslation[];
}

export interface IMenuTranslation extends ITranslation {
  items: IMenuItemWrapper[];
}

export interface IMenuItemWrapper {
  sort: number;
  collection: string;
  item: IPage | ICustomLink;
}

export interface ILocalizedMenuItem {
  collection: string;
}

export interface ILocalizedMenu {
  name: string;
  classes: string;
  items: (ILocalizedPageMenuItem | ILocalizedCustomLinkMenuItem)[] | null;
}

export interface IMenusRequestData {
  data: IMenu[];
}

// Pages

export interface ILocalizedPageMenuItem extends ILocalizedMenuItem {
  slug: string;
  classes: string;
  title: string;
  menu_title: string;
}

// Custom Links

export interface ICustomLink {
  classes: string;
  target: string;
  translations: ICustomLinkTranslation[];
}

export interface ICustomLinkTranslation extends ITranslation {
  label: string;
  url: string;
}

export interface ILocalizedCustomLinkMenuItem extends ILocalizedMenuItem {
  classes: string;
  target: string;
  label: string;
  url: string;
}

// BLOCKS

export interface ILocalizedBlock {
  collection: string;
}

// Rich Text
export interface IBlockRichText {
  name: string;
  background: string;
  background_style: string;
  anchor_id: string;
  classes: string;
  translations: IBlockRichTextTranslation[];
}

export interface IBlockRichTextTranslation extends ITranslation {
  title: string;
  content: string;
}

export interface ILocalizedBlockRichText extends ILocalizedBlock {
  name: string;
  background: string;
  background_style: string;
  anchor_id: string;
  classes: string;
  title: string;
  content: string;
}

// Custom
export interface IBlockCustom {
  name: string;
  anchor_id: string;
  classes: string;
}

export interface ILocalizedBlockCustom extends ILocalizedBlock {
  name: string;
  anchor_id: string;
  classes: string;
}

// Two Columns
export interface IBlockTwoColumns {
  anchor_id: string;
  classes: string;
  column_a_blocks: IBlockWrapper[];
  column_b_blocks: IBlockWrapper[];
}

export interface ILocalizedBlockTwoColumns extends ILocalizedBlock {
  anchor_id: string;
  classes: string;
  column_a_blocks: (ILocalizedBlockRichText | ILocalizedBlockCustom)[] | null;
  column_b_blocks: (ILocalizedBlockRichText | ILocalizedBlockCustom)[] | null;
}

// Page Block Wrapper
export interface IBlockWrapper {
  sort: number;
  collection: string;
  item: IBlockRichText | IBlockCustom | IBlockTwoColumns;
}

// PAGES

export interface IPage {
  slug: string;
  classes: string;
  blocks: IBlockWrapper[];
  translations: IPageTranslation[];
}

export interface IPageTranslation extends ITranslation {
  title: string;
  menu_title: string;
}

export interface ILocalizedPage {
  slug: string;
  classes: string;
  title: string;
  menu_title: string;
  blocks:
    | (
        | ILocalizedBlockRichText
        | ILocalizedBlockCustom
        | ILocalizedBlockTwoColumns
      )[]
    | null;
}

export interface IPagesRequestData {
  data: IPage[];
}

// SPONSORS

export interface ISponsor {
  translations: ISponsorTranslation[];
}

export interface ISponsorTranslation extends ITranslation {
  name: string;
  logo: string;
}

export interface ILocalizedSponsor {
  name: string;
  logo: string;
}

export interface ISponsorsRequestData {
  data: ISponsor[];
}

// VENUES

export interface IVenue {
  name: string;
  type: "main" | "secondary";
  address: string;
  map_url: string;
  image: string;
}

export interface ILocalizedVenue extends IVenue {}

export interface IVenuesRequestData {
  data: IVenue[];
}

// UNUSED DEFINITIONS (FOR NOW)

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
