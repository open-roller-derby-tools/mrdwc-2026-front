/**
 https://pinia.vuejs.org/core-concepts/#Setup-Stores
 
 In Setup Stores:
 - ref()s become state properties
 - computed()s become getters
 - function()s become actions
 */

import { defineStore } from "pinia";
import type {
  IMenu,
  IMenuRequestData,
  IMenuItemWrapper,
  IPage,
  IPageTranslation,
  ICustomLink,
  ICustomLinkTranslation,
  ILocalizedCustomLinkMenuItem,
  ILocalizedPageMenuItem,
} from "~~/types/custom";

export const useMenusStore = defineStore("menus", () => {
  const { locale } = useI18n();
  const isMenuHeaderReady = ref<boolean>(false);
  const menuHeader = ref<IMenu | null>(null);

  /**
   * Fetch data from the API.
   */
  async function fetchMenuHeader() {
    try {
      const fields = {
        translations: {
          languages_code: true,
          items: {
            order: true,
            collection: true,
            item: {
              "*": true,
              translations: {
                languages_code: true,
                "*": true,
              },
            },
          },
        },
      };
      const { data } = await $fetch<IMenuRequestData>(
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

  const localizedMenuHeader = computed(
    (): (ILocalizedPageMenuItem | ILocalizedCustomLinkMenuItem)[] => {
      if (!menuHeader.value || !isMenuHeaderReady.value) return [];

      const menuTranslation = menuHeader.value?.translations.find(
        (translation) => translation.languages_code === locale.value
      );
      if (!menuTranslation) return [];

      // Map the data to an array of ILocalizedPages (without blocks) for use in the components
      return menuTranslation.items.reduce<
        (ILocalizedPageMenuItem | ILocalizedCustomLinkMenuItem)[]
      >((result, value: IMenuItemWrapper) => {
        const itemTranslation = value.item.translations.find(
          (translation) => translation.languages_code === locale.value
        );

        if (!itemTranslation) return result;

        let typedItem: IPage | ICustomLink;
        let typedItemTranslation: IPageTranslation | ICustomLinkTranslation;
        switch (value.collection) {
          // Page
          case "pages":
            typedItem = value.item as IPage;
            typedItemTranslation = itemTranslation as IPageTranslation;
            result.push({
              collection: value.collection,
              slug: typedItem.slug,
              classes: typedItem.classes,
              title: typedItemTranslation.title || typedItem.slug,
              menu_title:
                typedItemTranslation.menu_title ||
                typedItemTranslation.title ||
                typedItem.slug,
            });
            break;
          // Custom Link
          case "custom_links":
            typedItem = value.item as ICustomLink;
            typedItemTranslation = itemTranslation as ICustomLinkTranslation;
            result.push({
              collection: value.collection,
              classes: typedItem.classes,
              target: typedItem.target,
              label: typedItemTranslation.label,
              url: typedItemTranslation.url,
            });
            break;
        }
        return result;
      }, []);
    }
  );

  // Expose the required properties, getters and actions
  return {
    fetchMenuHeader,
    isMenuHeaderReady,
    menuHeader, // Make sure to expose this even if we are not using it directly in the components (to prevent hydration mismatches)
    localizedMenuHeader,
  };
});
