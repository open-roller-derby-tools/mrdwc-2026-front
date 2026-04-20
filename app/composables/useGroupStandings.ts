import { GameState, type IGame } from "~~/types/games";
import type { ITournamentGroup } from "~~/types/custom";
import { useGamesStore } from "~/stores/games";

const { isNoSpoilerModeActive } = useNoSpoilerMode();

export interface ITeamStanding {
	teamId: number;
	played: number;
	wins: number;
	losses: number;
	pointsFor: number;
	pointsAgainst: number;
	differential: number;
	adjustedDifferential: number;
}

export function useGroupStandings() {
	const gamesStore = useGamesStore();

	function computeTeamStats(teamId: number, games: IGame[]): ITeamStanding {
		let wins = 0;
		let losses = 0;
		let pointsFor = 0;
		let pointsAgainst = 0;
		let biggestLoss = 0;

		for (const game of games) {
			if (isNoSpoilerModeActive.value || game.state !== GameState.Finished) continue;

			const isHome = game.home_team === teamId;
			const isAway = game.away_team === teamId;

			if (!isHome && !isAway) continue;

			const teamScore = isHome ? game.home_score : game.away_score;
			const opponentScore = isHome ? game.away_score : game.home_score;

			pointsFor += teamScore;
			pointsAgainst += opponentScore;

			if (teamScore > opponentScore) wins++;
			else if (teamScore < opponentScore) {
				losses++;
				const lossMargin = opponentScore - teamScore;
				if (lossMargin > biggestLoss) biggestLoss = lossMargin;
			}
		}

		const differential = pointsFor - pointsAgainst;

		return {
			teamId,
			played: wins + losses,
			wins,
			losses,
			pointsFor,
			pointsAgainst,
			differential,
			adjustedDifferential: differential + biggestLoss,
		};
	}

	function getHeadToHeadWins(teamA: number, teamB: number, games: IGame[]): number {
		let wins = 0;
		for (const game of games) {
			if (game.state !== GameState.Finished) continue;

			const aIsHome = game.home_team === teamA && game.away_team === teamB;
			const aIsAway = game.away_team === teamA && game.home_team === teamB;

			if (!aIsHome && !aIsAway) continue;

			const teamScore = aIsHome ? game.home_score : game.away_score;
			const opponentScore = aIsHome ? game.away_score : game.home_score;

			if (teamScore > opponentScore) wins++;
		}
		return wins;
	}

	function getGroupStandings(group: ITournamentGroup): ITeamStanding[] {
		const groupGames = gamesStore.getGamesByGroup(group.number);

		const standings = group.teams.map((teamId) => computeTeamStats(teamId, groupGames));

		if (isNoSpoilerModeActive.value) {
			return standings;
		}

		// Sort by: wins (desc), adjusted differential (desc), head-to-head wins (desc)
		standings.sort((a, b) => {
			if (b.wins !== a.wins) return b.wins - a.wins;
			if (b.adjustedDifferential !== a.adjustedDifferential)
				return b.adjustedDifferential - a.adjustedDifferential;
			const aH2H = getHeadToHeadWins(a.teamId, b.teamId, groupGames);
			const bH2H = getHeadToHeadWins(b.teamId, a.teamId, groupGames);
			return bH2H - aH2H;
		});

		return standings;
	}

	function getOverallRankings(groups: ITournamentGroup[]): ITeamStanding[] {
		const allStandings: ITeamStanding[] = [];

		for (const group of groups) {
			const groupGames = gamesStore.getGamesByGroup(group.number);
			for (const teamId of group.teams) {
				allStandings.push(computeTeamStats(teamId, groupGames));
			}
		}

		// Sort by: wins (desc), adjusted differential (desc)
		allStandings.sort((a, b) => {
			if (b.wins !== a.wins) return b.wins - a.wins;
			if (b.adjustedDifferential !== a.adjustedDifferential)
				return b.adjustedDifferential - a.adjustedDifferential;
			return b.differential - a.differential;
		});

		return allStandings;
	}

	return {
		getGroupStandings,
		getOverallRankings,
	};
}
