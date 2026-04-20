/**
 * https://pinia.vuejs.org/core-concepts/#Setup-Stores
 *
 * In Setup Stores:
 * - ref()s become state properties
 * - computed()s become getters
 * - function()s become actions
 */

import { defineStore } from "pinia";
import type { ITournamentGroup, ITournamentGroupRequestData } from "~~/types/custom";

export const useGroupsStore = defineStore("groups", () => {
	const {
		public: { apiBase },
	} = useRuntimeConfig();
	const isReady = ref<boolean>(false);
	const groups = ref<ITournamentGroup[] | null>(null);

	/**
	 * Fetch data from the API.
	 * Skips the network request when data was already loaded.
	 */
	async function fetch() {
		if (isReady.value && groups.value != null) {
			return groups.value;
		}

		try {
			const fields = {
				id: true,
				number: true,
				teams: true,
			};

			const { data } = await $fetch<ITournamentGroupRequestData>(
				buildRESTURL(apiBase, "tournament_groups", fields).href
			);

			groups.value = [...data].sort((a, b) => a.number - b.number);

			isReady.value = true;
			return groups.value;
		} catch (error) {
			console.error("Error fetching tournament groups:", error);
			isReady.value = false;
			groups.value = null;
			throw error;
		}
	}

	function getGroupById(id: number): ITournamentGroup | undefined {
		return groups.value?.find((group) => group.id === id);
	}

	function getGroupByNumber(number: number): ITournamentGroup | undefined {
		return groups.value?.find((group) => group.number === number);
	}

	return {
		fetch,
		isReady,
		groups,
		getGroupById,
		getGroupByNumber,
	};
});
