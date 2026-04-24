import { defineStore } from "pinia";
import type { IAnnouncer, ILocalizedAnnouncer, IAnnouncersRequestData } from "~~/types/announcers";

export const useAnnouncersStore = defineStore("announcers", () => {
	const {
		public: { apiBase },
	} = useRuntimeConfig();

	const announcers = ref<ILocalizedAnnouncer[] | null>(null);
	const isReady = ref(false);
	const inFlight = ref<Promise<ILocalizedAnnouncer[]> | null>(null);

	function mapAnnouncer(a: IAnnouncer): ILocalizedAnnouncer {
		return {
			id: a.id,
			name: a.name,
			avatar: a.avatar,
			pronouns: a.pronouns,
			nationalities: a.nationalities,
			photo_credits: a.photo_credits,
		};
	}

	async function fetch(options: { force?: boolean } = {}) {
		const force = options.force === true;

		if (!force && isReady.value && announcers.value) return announcers.value;
		if (inFlight.value) return inFlight.value;

		const request = (async () => {
			try {
				const fields = {
					id: true,
					status: true,
					name: true,
					avatar: true,
					pronouns: true,
					nationalities: true,
					photo_credits: true,
				};

				const { data } = await $fetch<IAnnouncersRequestData>(
					buildRESTURL(apiBase, "announcers", fields).href
				);

				const mapped = data
					.filter((a) => a.status === "published")
					.map(mapAnnouncer)
					.sort((a, b) => a.name.localeCompare(b.name));

				announcers.value = mapped;
				isReady.value = true;

				return mapped;
			} catch (error) {
				console.error("Error fetching announcers:", error);
				if (!announcers.value) {
					isReady.value = false;
				}
				throw error;
			} finally {
				inFlight.value = null;
			}
		})();

		inFlight.value = request;
		return request;
	}

	async function refresh() {
		return fetch({ force: true });
	}

	const getById = (id: number) => announcers.value?.find((a) => a.id === id);

	return {
		fetch,
		refresh,
		isReady,
		announcers,
		getById,
	};
});
