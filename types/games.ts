export enum GameState {
	Scheduled = "scheduled",
	PreGame = "pre_game",
	InProgressP1 = "in_progress_p1",
	HalfTime = "half_time",
	InProgressP2 = "in_progress_p2",
	Finished = "finished",
	Unknown = "unknown",
}

export enum GameType {
	GroupsStage = "groups_stage",
	RankingsPlay = "rankings_play",
	TopEight = "top_eight",
	Quarterfinals = "quarterfinals",
	LowerTopEight = "lower_top_eight",
	UpperTopEight = "upper_top_eight",
	Semifinals = "semifinals",
	LowerFinal = "lower_final",
	GrandFinal = "grand_final",
}

export enum GameDuration {
	TwoXFifteen = "2x15",
	TwoXThirty = "2x30",
}

export interface IGame {
	id: number;
	number: number;
	venue: number;
	type: GameType;
	description: string | null;
	start_time: string;
	duration: GameDuration;
	state: GameState;
	home_team: number | null;
	away_team: number | null;
	home_source: string | null;
	away_source: string | null;
	home_color: string;
	away_color: string;
	home_score: number;
	away_score: number;
	video_url: string | null;
	stats_json: string | null;
	tournament_group: number | null;
}

export interface IGamesRequestData {
	data: IGame[];
}
