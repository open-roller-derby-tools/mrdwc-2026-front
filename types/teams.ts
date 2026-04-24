// TEAMS & TEAM MEMBERS

import type { ITranslation } from "./custom";

export interface ITeam {
	id: number;
	name: string;
	slug?: string;
	name_letters: string;
	logo: string;
	flag?: string;
	Instagram: string | null;
	Facebook: string | null;
	Website: string | null;
	Crowdfunding: string | null;
	countries_represented: string | null;
	team_history: string | null;
	team_anecdotes: string | null;
	preparation_games: string | null;
	national_anthem: string | null;
	anthem_audio: string | null;
	parade_audio: string | null;
	announcer_notes: string | null;
	previous_participations: string[];
	members?: ITeamMember[];
	charter?: ITeamMember[];
	group_id: number | null;
	schedule_color: string | null;
	translations: ITeamTranslation[];
}

export interface ITeamTranslation extends ITranslation {
	country: string;
}

export interface ILocalizedTeam {
	id: number;
	name: string;
	slug: string;
	logo: string;
	instagram: string | null;
	facebook: string | null;
	website: string | null;
	crowdfunding: string | null;
	countriesRepresented: string | null;
	history: string | null;
	anecdotes: string | null;
	preparationGames: string | null;
	nationalAnthem: string | null;
	anthemAudio: string | null;
	paradeAudio: string | null;
	announcerNotes: string | null;
	previousParticipations: string[];
	name_letters?: string;
	members?: ILocalizedTeamMember[];
	charter?: ILocalizedTeamMember[];
	flag?: string;
	group_id: number | null;
	schedule_color: string | null;
	country: string | null;
}

export interface ITeamWithRelations extends ITeam {
	members: ITeamMember[];
	charter: ITeamMember[];
}

export interface ITeamMember {
	id: number;
	team: number | ITeam;
	derbyname: string;
	derbyname_pronunciation: string;
	number: string;
	roles: string[];
	roster_photo: string;
	pronouns: string;
	member_information: string;
	leagues_represented: string;
	announcer_notes: string;
	translations: ITeamMemberTranslation[];
	charter_skater_id: number;
}

export interface ILocalizedTeamMember {
	id: number;
	team: number | ITeam;
	derbyname: string;
	derbynamePronunciation: string;
	number: string;
	roles: string[];
	rosterPhoto: string;
	pronouns: string;
	memberInformation: string;
	leaguesRepresented: string;
	announcerNotes: string;
	translations: ITeamMemberTranslation[];
	charterSkaterId: number;
}

export interface ITeamMemberTranslation extends ITranslation {
	pronouns: string;
	team_member_id: number;
}

export interface ICharter {
	id: number;
	team: number | ITeam;
	charter_skaters: number[];
}

export interface ITeamsRequestData {
	data: ITeam[];
}

export interface ITeamMembersRequestData {
	data: ITeamMember[];
}

export interface IChartersRequestData {
	data: ICharter[];
}
