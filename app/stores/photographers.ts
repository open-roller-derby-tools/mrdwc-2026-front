import { defineStore } from "pinia";
import type {
	IPhotographer,
	ILocalizedPhotographer,
	IPhotographersRequestData,
} from "~~/types/photographers";

export const usePhotographersStore = defineStore("photographers", () => {
	const {
		public: { apiBase },
	} = useRuntimeConfig();

	const photographers = ref<ILocalizedPhotographer[] | null>(null);
	const isReady = ref(false);
	const inFlight = ref<Promise<ILocalizedPhotographer[]> | null>(null);

	function mapPhotographer(p: IPhotographer): ILocalizedPhotographer {
		return {
			id: p.id,
			name: p.name,
			slug: p.slug,
			logo: p.logo,
			avatar: p.avatar,
			portfolio: p.portfolio,
			pronouns: p.pronouns,
			photo_credits: p.photo_credits,
		};
	}

	async function fetch(options: { force?: boolean } = {}) {
		const force = options.force === true;

		if (!force && isReady.value && photographers.value) return photographers.value;
		if (inFlight.value) return inFlight.value;

		const request = (async () => {
			try {
				const fields = {
					id: true,
					status: true,
					name: true,
					slug: true,
					logo: true,
					avatar: true,
					portfolio: true,
					pronouns: true,
					photo_credits: true,
				};

				const { data } = await $fetch<IPhotographersRequestData>(
					buildRESTURL(apiBase, "photographers", fields).href
				);

				const mapped = data
					.filter((p) => p.status === "published")
					.map(mapPhotographer)
					.sort((a, b) => a.name.localeCompare(b.name));

				photographers.value = mapped;
				isReady.value = true;

				return mapped;
			} catch (error) {
				console.error("Error fetching photographers:", error);
				if (!photographers.value) {
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

	const getBySlug = (slug: string) => photographers.value?.find((p) => p.slug === slug);

	const photographersById = computed<Record<number, ILocalizedPhotographer>>(() => {
		return Object.fromEntries(photographers.value?.map((p) => [p.id, p]) ?? []);
	});

	return {
		fetch,
		refresh,
		isReady,
		photographers,
		photographersById,
		getBySlug,
	};
});
