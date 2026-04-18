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
  display_name: string;
  items: IMenuItemWrapper[];
}

export interface IMenuItemWrapper {
  sort: number;
  collection: "pages" | "custom_links" | "menus";
  item: IPage | ICustomLink | IMenu;
}

export interface ILocalizedMenuItem {
  collection: "pages" | "custom_links" | "menus";
}

export interface ILocalizedMenuMenuItem extends ILocalizedMenuItem {
  name: string;
  display_name: string;
}

export interface ILocalizedMenu {
  name: string;
  classes: string;
  display_name: string;
  items:
    | (
        | ILocalizedPageMenuItem
        | ILocalizedCustomLinkMenuItem
        | ILocalizedMenuMenuItem
      )[]
    | null;
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
  background_section: string;
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
  background_section: string;
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
  background: string;
  reverse_mobile: boolean;
  column_a_blocks: IBlockWrapper[];
  column_b_blocks: IBlockWrapper[];
  translations: IBlockTwoColumnsTranslation[];
}

export interface IBlockTwoColumnsTranslation extends ITranslation {
  title: string;
  subtitle: string;
}

export interface ILocalizedBlockTwoColumns extends ILocalizedBlock {
  anchor_id: string;
  classes: string;
  title: string;
  subtitle: string;
  background: string;
  reverse_mobile: boolean;
  column_a_blocks: (ILocalizedBlockRichText | ILocalizedBlockCustom)[] | null;
  column_b_blocks: (ILocalizedBlockRichText | ILocalizedBlockCustom)[] | null;
}

// Tabs
export interface IBlockTabs {
  anchor_id: string;
  classes: string;
  tabs: IPageWrapper[];
}

export interface ILocalizedBlockTabs extends ILocalizedBlock {
  anchor_id: string;
  classes: string;
  tabs: string[]; // Each tab will have a slug reference to the related page, no need for more
}

export interface IBlockTabsSlot {
  anchor_id: string;
  classes: string;
  tabs: IBlockTabsSlotItem[];
}

export interface IBlockTabsSlotItem {
  label: string;
  slotKey: string;
}

export interface ILocalizedBlockTabsSlot {
  anchor_id: string;
  classes: string;
  tabs: IBlockTabsSlotItem[];
}

// Page Block Wrapper
export interface IBlockWrapper {
  sort: number;
  collection: string;
  item:
    | IBlockRichText
    | IBlockCustom
    | IBlockTwoColumns
    | IBlockTabs
    | IBlockTabsSlot;
}

// Page Wrapper
export interface IPageWrapper {
  sort: number | null;
  collection: "pages";
  item: {
    slug: string;
  };
}

// PAGES

export interface IPage {
  slug: string;
  classes: string;
  header_image: string;
  is_static: boolean;
  blocks: IBlockWrapper[];
  translations: IPageTranslation[];
}

export interface IPageTranslation extends ITranslation {
  show_title: boolean;
  title: string;
  menu_title: string;
}

export interface ILocalizedPage {
  slug: string;
  classes: string;
  header_image: string;
  show_title: boolean;
  title: string;
  menu_title: string;
  blocks:
    | (
        | ILocalizedBlockRichText
        | ILocalizedBlockCustom
        | ILocalizedBlockTwoColumns
        | ILocalizedBlockTabs
      )[]
    | null;
}

export interface IPagesRequestData {
  data: IPage[];
}

// SPONSORS

export interface ISponsor {
  translations: ISponsorTranslation[];
  url: string;
}

export interface ISponsorTranslation extends ITranslation {
  name: string;
  logo: string;
}

export interface ILocalizedSponsor {
  name: string;
  logo: string;
  url: string;
}

export interface ISponsorsRequestData {
  data: ISponsor[];
}

// VENUES

export interface IVenue {
  id: number;
  name: string;
  type: "main" | "secondary";
  address: string;
  map_url: string;
  image: string | null;
}

export interface ILocalizedVenue extends IVenue {
  imageUrl?: string;
}

export interface IVenuesRequestData {
  data: IVenue[];
}

// APPLICATIONS

export interface IApplication {
  status: "upcoming" | "open" | "closed";
  anchor_id: string;
  translations: IApplicationTranslation[];
}

export interface IApplicationDate {
  label: string;
  date: string;
}

export interface IApplicationTranslation extends ITranslation {
  name: string;
  description: string | null;
  dates: IApplicationDate[] | null;
}

export interface ILocalizedApplication {
  status: "upcoming" | "open" | "closed";
  anchor_id: string;
  name: string;
  description: string;
  dates: IApplicationDate[] | null;
}

export interface IApplicationsRequestData {
  data: IApplication[];
}

// OPTIONS

export interface IOptions {
  applications_page: {
    slug: string;
  };
}

export interface IOptionsRequestData {
  data: IOptions;
}

// TEAMS & TEAM MEMBERS

export interface ITeam {
  id: number;
  name: string;
  slug?: string;
  name_letters: string;
  logo: string;
  flag?: string;
  Instagram: string;
  Facebook: string;
  Website: string;
  Crowdfunding: string;
  countries_represented: string;
  team_history: string;
  team_anecdotes: string;
  previous_participations: string[];
  members?: ITeamMember[];
  charter?: ITeamMember[];
  group_id: number | null;
}

export interface ILocalizedTeam {
  id: number;
  name: string;
  slug: string;
  logo: string;
  instagram: string;
  facebook: string;
  website: string;
  crowdfunding: string;
  countriesRepresented: string;
  history: string;
  anecdotes: string;
  previousParticipations: string[];
  nameLetters: string;
  name_letters?: string;
  members?: ILocalizedTeamMember[];
  charter?: ILocalizedTeamMember[];
  flag?: string;
  group_id: number | null;
}

export interface ITeamWithRelations extends ITeam {
  members: ITeamMember[];
  charter: ITeamMember[];
}

export interface ITeamMember {
  id: number;
  team: number | ITeam;
  firstname: string;
  lastname: string;
  derbyname: string;
  number: string;
  roles: string[];
  roster_photo: string;
  pronouns: string;
  member_information: string;
  leagues_represented: string;
  translations: ITeamMemberTranslation[];
  charter_skater_id: number;
}

export interface ILocalizedTeamMember {
  id: number;
  team: number | ITeam;
  firstname: string;
  lastname: string;
  derbyname: string;
  number: string;
  roles: string[];
  rosterPhoto: string;
  pronouns: string;
  memberInformation: string;
  leaguesRepresented: string;
  translations: ITeamMemberTranslation[];
  charterSkaterId: number;
}

export interface ITeamMemberTranslation extends ITranslation {
  pronouns: string;
  team_member_id: number;
}

export interface ITeamsRequestData {
  data: ITeam[];
}

export interface ICharter {
  id: number;
  team: number | ITeam;
  charter_skaters: number[];
}

// OFFICIALS

export interface IOfficial {
  id: number;
  name: string;
  country: string;
  roles: string[];
}

export interface ILocalizedOfficial extends IOfficial {}

export interface IOfficialsCrew {
  id: number;
  name: string;
  secret_name: string;
  color: string;
  members_so: IOfficial[];
  members_nso: IOfficial[];
}

export interface ILocalizedOfficialsCrew extends IOfficialsCrew {}

export interface IOfficialsCrewsRequestData {
  data: IOfficialsCrew[];
}

export interface ITournamentGroup {
  id: number;
  number: number;
  teams: number[];
}

export interface ITournamentGroupRequestData {
  data: ITournamentGroup[];
}
