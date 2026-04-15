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
    start_time: string;
    duration: GameDuration;
    venue: number;
    home_team: number;
    away_team: number;
    home_score: number;
    away_score: number;
    home_color: string;
    away_color: string;
    home_source: string | null;
    away_source: string | null;
    state: GameState;
    video_url: string | null;
    type: GameType;
    description: string | null;
}

export interface ILocalizedGame extends IGame { }

export interface IGamesRequestData {
    data: IGame[];
}
