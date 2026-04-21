/**
 https://pinia.vuejs.org/core-concepts/#Setup-Stores

 In Setup Stores:
 - ref()s become state properties
 - computed()s become getters
 - function()s become actions
 */

import { defineStore } from "pinia";
import type {
	ITeamsRequestData,
	ILocalizedTeam,
	ITeamMember,
	ILocalizedTeamMember,
	ITeamWithRelations,
	ITeamMembersRequestData,
	IChartersRequestData,
} from "~~/types/teams";

export const useTeamsStore = defineStore("teams", () => {
	const {
		public: { apiBase },
	} = useRuntimeConfig();
	const { locale, fallbackLocale } = useI18n();

	const isReady = ref<boolean>(false);
	const teams = ref<ITeamWithRelations[]>();

	const slugify = (str: string) =>
		str
			?.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "") ?? "";

	const getAssetId = (file: string | { id: string } | null): string | null => {
		if (!file) return null;
		if (typeof file === "string") return file;
		if (typeof file === "object" && "id" in file) return file.id;
		return null;
	};

	/**
	 * Fetch data from the API.
	 * Skips the network request when data was already loaded (e.g. from a previous call during the same server run).
	 */
	async function fetch() {
		if (isReady.value && teams.value) return teams.value;

		try {
			const teamFields = {
				id: true,
				name: true,
				name_letters: true,
				logo: true,
				flag: true,
				Instagram: true,
				Facebook: true,
				Website: true,
				Crowdfunding: true,
				countries_represented: true,
				previous_participations: true,
				team_history: true,
				team_anecdotes: true,
				preparation_games: true,
				national_anthem: true,
				anthem_audio: true,
				parade_audio: true,
				group_id: true,
				schedule_color: true,
			};

			const memberFields = {
				id: true,
				team: true,
				derbyname: true,
				derbyname_pronunciation: true,
				number: true,
				roles: true,
				roster_photo: true,
				pronouns: true,
				member_information: true,
				leagues_represented: true,
				charter_skater_id: true,
				translations: {
					languages_code: true,
					pronouns: true,
				},
			};

			const charterFields = {
				id: true,
				team: true,
			};

			const [teamsRes, membersRes, chartersRes] = await Promise.all([
				$fetch<ITeamsRequestData>(buildRESTURL(apiBase, "teams", teamFields).href),
				$fetch<ITeamMembersRequestData>(
					buildRESTURL(apiBase, "team_members", memberFields, { limit: -1 }).href
				),
				$fetch<IChartersRequestData>(buildRESTURL(apiBase, "charter", charterFields).href),
			]);

			const rawTeams = teamsRes.data;
			const rawMembers = membersRes.data;
			const rawCharters = chartersRes.data;

			const teamsWithRelations = rawTeams.map((team) => {
				// MEMBERS TEAM
				const members = rawMembers.filter((m) => {
					const teamId = typeof m.team === "object" ? m.team?.id : m.team;
					return Number(teamId) === Number(team.id);
				});

				// CHARTER ENTITY
				const charter = rawCharters.find((c) => Number(c.team) === Number(team.id));

				// MEMBERS IN CHARTER
				const charterMembers = charter
					? members.filter((m) => Number(m.charter_skater_id) === Number(charter.id))
					: [];

				return {
					...team,
					members,
					charter: charterMembers,
				};
			});

			teams.value = teamsWithRelations.sort((a, b) =>
				(a.name ?? "").localeCompare(b.name ?? "", undefined, {
					sensitivity: "base",
				})
			);

			isReady.value = true;

			return teams.value;
		} catch (error) {
			console.error("Error fetching teams:", error);
			isReady.value = false;
			throw error;
		}
	}

	const localizeMember = (member: ITeamMember): ILocalizedTeamMember => {
		const translations = member.translations ?? [];

		const translation =
			translations.find((t) => t.languages_code === locale.value) ||
			translations.find((t) => t.languages_code === fallbackLocale.value);

		return {
			id: member.id,
			team: member.team,
			derbyname: member.derbyname,
			derbynamePronunciation: member.derbyname_pronunciation ?? "",
			number: member.number,
			roles: member.roles,
			rosterPhoto: getAssetId(member.roster_photo) ?? "",
			pronouns: translation?.pronouns ?? member.pronouns ?? "",
			memberInformation: member.member_information,
			leaguesRepresented: member.leagues_represented,
			charterSkaterId: member.charter_skater_id,
			translations,
		};
	};

	const localizedTeams = computed((): ILocalizedTeam[] => {
		if (!teams.value) return [];

		return teams.value.map((team) => {
			const localizedMembers = team.members?.map(localizeMember) ?? [];

			const charterMembers = team.charter ?? [];

			return {
				id: team.id,
				slug: slugify(team.name),
				name: team.name,
				name_letters: team.name_letters,
				logo: team.logo,
				flag: team.flag,
				instagram: team.Instagram,
				facebook: team.Facebook,
				website: team.Website,
				crowdfunding: team.Crowdfunding,
				countriesRepresented: team.countries_represented,
				history: team.team_history,
				anecdotes: team.team_anecdotes,
				preparationGames: team.preparation_games,
				nationalAnthem: team.national_anthem,
				anthemAudio: team.anthem_audio,
				paradeAudio: team.parade_audio,
				previousParticipations: team.previous_participations,
				members: localizedMembers,
				charter: charterMembers.map(localizeMember),
				group_id: team.group_id,
				schedule_color: team.schedule_color,
			};
		});
	});

	function getTeamBySlug(slug: string) {
		return localizedTeams.value?.find((t) => t.slug === slug) ?? null;
	}

	function getTeamById(id: number) {
		return localizedTeams.value?.find((team) => team.id === id) ?? null;
	}

	function getRandomTeam() {
		return localizedTeams.value?.[Math.floor(Math.random() * localizedTeams.value.length)] ?? null;
	}

	// console.log("🔥 teams", teams);

	/**
	 * Expose the required properties, getters and actions
	 */
	return {
		fetch,
		isReady,
		teams,
		localizedTeams,
		getTeamBySlug,
		getTeamById,
		getRandomTeam,
	};
});
