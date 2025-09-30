/**
 https://pinia.vuejs.org/core-concepts/#Setup-Stores
 
 In Setup Stores:
 - ref()s become state properties
 - computed()s become getters
 - function()s become actions
 */

import { defineStore } from "pinia";
import type {
  IBlockCustom,
  IBlockRichText,
  ILocalizedBlockRichText,
  ILocalizedPage,
  IPage,
  IPagesRequestData,
} from "~~/types/custom";

export const usePagesStore = defineStore("pages", () => {
  const { locale } = useI18n();
  const isReady = ref<boolean>(false);
  const pages = ref<IPage[] | null>(null);

  /**
   * Fetch data from the API.
   */
  async function fetch() {
    try {
      const fields = {
        slug: true,
        blocks: {
          order: true,
          collection: true,
          item: {
            name: true,
            translations: {
              languages_code: true,
              title: true,
              content: true,
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
      console.error("Error fetching menu header:", error);
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
  const getPageBySlug = computed(() => {
    return (slug: string): ILocalizedPage | null => {
      // Find page from slug
      const page = pages.value?.find((page) => page.slug === slug);
      if (!page) return null;

      // Get translation from current locale
      const pageTranslation = page.translations.find(
        (translation) => translation.languages_code === locale.value
      );

      // Localize page blocks
      const blocks: (ILocalizedBlockRichText | IBlockCustom)[] = [];
      page.blocks.forEach((block) => {
        switch (block.collection) {
          // RichText block
          case "blocks_richtext":
            const blockTranslation = (
              block.item as IBlockRichText
            ).translations.find(
              (translation) => translation.languages_code === locale.value
            );
            blocks.push({
              name: block.item.name,
              title: blockTranslation?.title || "",
              content: blockTranslation?.content || "",
            });
            break;
          // Custom block
          case "blocks_custom":
            blocks.push({
              name: block.item.name,
            });
            break;
        }
      });

      // Return the final ILocalizedPage object
      return {
        slug: page.slug,
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
    getPageBySlug,
  };
});
