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
  IMenuItemWrapper,
  IPage,
  IPageTranslation,
  ICustomLink,
  ICustomLinkTranslation,
  ILocalizedCustomLinkMenuItem,
  ILocalizedPageMenuItem,
  IMenusRequestData,
  ILocalizedMenu,
} from "~~/types/custom";

export const useMenusStore = defineStore("menus", () => {
  const { locale, fallbackLocale } = useI18n();
  const isReady = ref<boolean>(false);
  const menus = ref<IMenu[] | null>(null);

  /**
   * Fetch data from the API.
   */
  async function fetch() {
    try {
      const fields = {
        name: true,
        classes: true,
        translations: {
          languages_code: true,
          items: {
            sort: true,
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
      const { data } = await $fetch<IMenusRequestData>(
        buildRESTURL("menus", fields).href
      );
      menus.value = data;
      isReady.value = true;
      return data;
    } catch (error) {
      console.error("Error fetching menus:", error);
      isReady.value = false;
      menus.value = null;
      throw error;
    }
  }

  /**
   * Check if a menu exists for the requested name
   */
  const hasMenuWithName = computed(() => {
    return (name: string): boolean => {
      // Find menu from name
      const menu = menus.value?.find((menu) => menu.name === name);
      return menu != undefined;
    };
  });

  /**
   * Get the fully localized menu for the requested name.
   */
  const getMenuWithName = computed(() => {
    return (name: string): ILocalizedMenu | null => {
      // Find menu from name
      const menu = menus.value?.find((menu) => menu.name === name);
      if (!menu) return null;

      // Get menu translation for current locale
      let menuTranslation = menu.translations.find(
        (translation) => translation.languages_code === locale.value
      );
      // If not found, try fallback locale
      if (!menuTranslation) {
        menuTranslation = menu.translations.find(
          (translation) => translation.languages_code === fallbackLocale.value
        );
      }
      if (!menuTranslation) return null;

      // Get localized menu items
      const localizedItems = menuTranslation.items.reduce<
        (ILocalizedPageMenuItem | ILocalizedCustomLinkMenuItem)[]
      >((result, value: IMenuItemWrapper) => {
        let itemTranslation = value.item.translations.find(
          (translation) => translation.languages_code === locale.value
        );
        // If not found, try fallback locale
        if (!itemTranslation) {
          itemTranslation = value.item.translations.find(
            (translation) => translation.languages_code === fallbackLocale.value
          );
        }
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
            } as ILocalizedPageMenuItem);
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
            } as ILocalizedCustomLinkMenuItem);
            break;
        }
        return result;
      }, []);

      // Return the final ILocalizedMenu object
      return {
        name: menu.name,
        classes: menu.classes,
        items: localizedItems,
      };
    };
  });

  // Expose the required properties, getters and actions
  return {
    fetch,
    isReady,
    menus, // Make sure to expose this even if we are not using it directly in the components (to prevent hydration mismatches)
    hasMenuWithName,
    getMenuWithName,
  };
});
