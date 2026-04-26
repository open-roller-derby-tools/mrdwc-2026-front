/**
 https://pinia.vuejs.org/core-concepts/#Setup-Stores

 In Setup Stores:
 - ref()s become state properties
 - computed()s become getters
 - function()s become actions
 */

import { defineStore } from "pinia";
import type { IFaq, IFaqsRequestData, ILocalizedFaq } from "~~/types/custom";

export const useFaqsStore = defineStore("faqs", () => {
	const {
		public: { apiBase },
	} = useRuntimeConfig();
	const { locale, fallbackLocale } = useI18n();
	const isReady = ref<boolean>(false);
	const faqs = ref<IFaq[] | null>(null);

	/**
	 * Fetch data from the API.
	 * Skips the network request when data was already loaded
	 */
	async function fetch() {
		if (isReady.value && faqs.value != null) {
			return faqs.value;
		}
		try {
			const fields = {
				id: true,
				slug: true,
				category: true,
				translations: {
					languages_code: true,
					question: true,
					answer: true,
				},
			};
			const { data } = await $fetch<IFaqsRequestData>(buildRESTURL(apiBase, "faq", fields).href);
			faqs.value = data;
			isReady.value = true;
			return data;
		} catch (error) {
			console.error("Error fetching faqs:", error);
			isReady.value = false;
			faqs.value = null;
			throw error;
		}
	}

	/**
	 * Return an array of localized FAQs sorted by the sort field.
	 * This getter transforms the raw FAQ data into a structure suitable for localized display.
	 */
	const localizedFaqs = computed((): ILocalizedFaq[] => {
		if (!faqs.value) return [];

		return faqs.value.reduce<ILocalizedFaq[]>((result, faq) => {
			// Skip if translations are missing (e.g. API permissions)
			if (!faq.translations?.length) return result;
			// Get translation from current locale
			let faqTranslation = faq.translations.find(
				(translation) => translation.languages_code === locale.value
			);
			// If not found, try fallback locale
			if (!faqTranslation) {
				faqTranslation = faq.translations.find(
					(translation) => translation.languages_code === fallbackLocale.value
				);
			}
			// If a translation is found, add the localized FAQ to the result
			if (faqTranslation) {
				result.push({
					id: faq.id,
					slug: faq.slug,
					category: faq.category,
					question: faqTranslation.question,
					answer: faqTranslation.answer,
				} as ILocalizedFaq);
			}
			return result;
		}, []);
	});

	// Expose the required properties, getters and actions
	return {
		fetch,
		isReady,
		faqs,
		localizedFaqs,
	};
});
