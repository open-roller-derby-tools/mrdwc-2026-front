/**
 https://pinia.vuejs.org/core-concepts/#Setup-Stores
 
 In Setup Stores:
 - ref()s become state properties
 - computed()s become getters
 - function()s become actions
 */

import { defineStore } from "pinia";
import type {
  IBlockRichText,
  ILocalizedBlockCustom,
  ILocalizedBlockRichText,
  ILocalizedPage,
  IPage,
  IPagesRequestData,
} from "~~/types/custom";

export const usePagesStore = defineStore("pages", () => {
  const { locale, fallbackLocale } = useI18n();
  const isReady = ref<boolean>(false);
  const pages = ref<IPage[] | null>(null);

  /**
   * Fetch data from the API.
   */
  async function fetch() {
    try {
      const fields = {
        slug: true,
        classes: true,
        blocks: {
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
        translations: {
          languages_code: true,
          title: true,
          menu_title: true,
        },
      };
      const { data } = await $fetch<IPagesRequestData>(
        buildRESTURL("pages", fields).href
      );
      pages.value = data;
      isReady.value = true;
      return data;
    } catch (error) {
      console.error("Error fetching pages:", error);
      isReady.value = false;
      pages.value = null;
      throw error;
    }
  }

  /**
   * Check if a page exists for the requested slug
   */
  const hasPageWithSlug = computed(() => {
    return (slug: string): boolean => {
      // Find page from slug
      const page = pages.value?.find((page) => page.slug === slug);
      return page != undefined;
    };
  });

  /**
   * Get the fully localized page for the requested slug.
   */
  const getPageWithSlug = computed(() => {
    return (slug: string): ILocalizedPage | null => {
      // Find page from slug
      const page = pages.value?.find((page) => page.slug === slug);
      if (!page) return null;

      // Get translation from current locale
      let pageTranslation = page.translations.find(
        (translation) => translation.languages_code === locale.value
      );
      // If not found, try fallback locale
      if (!pageTranslation) {
        pageTranslation = page.translations.find(
          (translation) => translation.languages_code === fallbackLocale.value
        );
      }

      // Localize page blocks
      const blocks: (ILocalizedBlockRichText | ILocalizedBlockCustom)[] = [];
      page.blocks.forEach((block) => {
        switch (block.collection) {
          // RichText block
          case "blocks_richtext":
            // Get translation from current locale
            let blockTranslation = (
              block.item as IBlockRichText
            ).translations.find(
              (translation) => translation.languages_code === locale.value
            );
            // If not found, try fallback locale
            if (!blockTranslation) {
              blockTranslation = (
                block.item as IBlockRichText
              ).translations.find(
                (translation) =>
                  translation.languages_code === fallbackLocale.value
              );
            }
            // If found, add block to list
            if (blockTranslation) {
              blocks.push({
                collection: block.collection,
                name: block.item.name,
                background: (block.item as IBlockRichText).background,
                background_style: (block.item as IBlockRichText)
                  .background_style,
                classes: block.item.classes,
                title: blockTranslation?.title || "",
                content: blockTranslation?.content || "",
              } as ILocalizedBlockRichText);
            }
            break;

          // Custom block
          case "blocks_custom":
            // Add block to list
            blocks.push({
              collection: block.collection,
              name: block.item.name,
              classes: block.item.classes,
            } as ILocalizedBlockCustom);
            break;
        }
      });

      // Return the final ILocalizedPage object
      return {
        slug: page.slug,
        classes: page.classes,
        title: pageTranslation?.title || page.slug,
        menu_title:
          pageTranslation?.menu_title || pageTranslation?.title || page.slug,
        blocks: blocks,
      };
    };
  });

  // Expose the required properties, getters and actions
  return {
    fetch,
    isReady,
    pages, // Make sure to expose this even if we are not using it directly in the components (to prevent hydration mismatches)
    hasPageWithSlug,
    getPageWithSlug,
  };
});
