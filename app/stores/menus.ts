import { defineStore } from "pinia";
import type {
  ILocalizedPage,
  IMenuHeader,
  IMenuHeaderRequestData,
  IMenuHeaderTranslationPage,
} from "~~/types/custom";

export const useMenusStore = defineStore("menus", () => {
  const { locale } = useI18n();
  const isMenuHeaderReady = ref<boolean>(false);
  const menuHeader = ref<IMenuHeader | null>(null);

  /**
   * Fetch data from the API.
   */
  async function fetchMenuHeader() {
    try {
      const fields = {
        id: true,
        translations: {
          languages_code: true,
          pages: {
            item: {
              slug: true,
              translations: {
                languages_code: true,
                title: true,
                menu_title: true,
              },
            },
          },
        },
      };
      const { data } = await $fetch<IMenuHeaderRequestData>(
        buildRESTURL("menu_header", fields).href
      );
      menuHeader.value = data;
      isMenuHeaderReady.value = true;
      return data;
    } catch (error) {
      console.error("Error fetching menu header:", error);
      isMenuHeaderReady.value = false;
      menuHeader.value = null;
      throw error;
    }
  }

  const localizedMenuHeader = computed((): ILocalizedPage[] => {
    if (!menuHeader.value || !isMenuHeaderReady.value) return [];

    const menuTranslation = menuHeader.value?.translations.find(
      (translation) => translation.languages_code === locale.value
    );
    if (!menuTranslation) return [];

    // Map the data to an array of ILocalizedPages for use in the components
    return menuTranslation.pages.map((value: IMenuHeaderTranslationPage) => {
      const pageTranslation = value.item.translations.find(
        (translation) => translation.languages_code === locale.value
      );
      return {
        slug: value.item.slug,
        title: pageTranslation?.title || value.item.slug,
        menu_title:
          pageTranslation?.menu_title ||
          pageTranslation?.title ||
          value.item.slug,
      };
    });
  });

  // Expose the required properties, getters and actions
  return {
    fetchMenuHeader,
    isMenuHeaderReady,
    menuHeader, // Make sure to expose this even if we are not using it directly in the components (to prevent hydration mismatches)
    localizedMenuHeader,
  };
});
