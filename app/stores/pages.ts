/**
 https://pinia.vuejs.org/core-concepts/#Setup-Stores
 
 In Setup Stores:
 - ref()s become state properties
 - computed()s become getters
 - function()s become actions
 */

import { defineStore } from "pinia"
import type {
  IBlockCustom,
  IBlockRichText,
  IBlockTwoColumns,
  IBlockWrapper,
  ILocalizedBlockCustom,
  ILocalizedBlockRichText,
  ILocalizedBlockTwoColumns,
  ILocalizedPage,
  IPage,
  IPagesRequestData,
} from "~~/types/custom"

export const usePagesStore = defineStore("pages", () => {
  const { locale, fallbackLocale } = useI18n()
  const isReady = ref<boolean>(false)
  const pages = ref<IPage[] | null>(null)

  /**
   * Fetch data from the API.
   */
  async function fetch() {
    try {
      const fields = {
        slug: true,
        classes: true,
        header_image: true,
        blocks: {
          sort: true,
          collection: true,
          item: {
            "*": true,
            // Only valid if collection == blocks_richtext
            translations: {
              languages_code: true,
              "*": true,
            },
            // Only valid if collection == blocks_two_columns
            column_a_blocks: {
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
            // Only valid if collection == blocks_two_columns
            column_b_blocks: {
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
        },
        translations: {
          languages_code: true,
          show_title: true,
          title: true,
          menu_title: true,
        },
      }
      const { data } = await $fetch<IPagesRequestData>(
        buildRESTURL("pages", fields).href
      )
      pages.value = data
      isReady.value = true
      return data
    } catch (error) {
      console.error("Error fetching pages:", error)
      isReady.value = false
      pages.value = null
      throw error
    }
  }

  /**
   * Check if a page exists for the requested slug
   */
  const hasPageWithSlug = computed(() => {
    return (slug: string): boolean => {
      // Find page from slug
      const page = pages.value?.find((page) => page.slug === slug)
      return page != undefined
    }
  })

  /**
   * Get the fully localized page for the requested slug.
   */
  const getPageWithSlug = computed(() => {
    return (slug: string): ILocalizedPage | null => {
      // Find page from slug
      const page = pages.value?.find((page) => page.slug === slug)
      if (!page) return null

      // Get translation from current locale
      let pageTranslation = page.translations.find(
        (translation) => translation.languages_code === locale.value
      )
      // If not found, try fallback locale
      if (!pageTranslation) {
        pageTranslation = page.translations.find(
          (translation) => translation.languages_code === fallbackLocale.value
        )
      }

      // Return the final ILocalizedPage object
      return {
        slug: page.slug,
        classes: page.classes,
        header_image: page.header_image,
        show_title: pageTranslation?.show_title || false,
        title: pageTranslation?.title || page.slug,
        menu_title:
          pageTranslation?.menu_title || pageTranslation?.title || page.slug,
        blocks: localizeBlocks(page.blocks),
      }
    }
  })

  const localizeBlocks = (blocks: IBlockWrapper[]) => {
    const localizedBlocks: (
      | ILocalizedBlockRichText
      | ILocalizedBlockCustom
      | ILocalizedBlockTwoColumns
    )[] = []

    blocks.forEach((block) => {
      switch (block.collection) {
        // RichText block
        case "blocks_richtext":
          // Get translation from current locale
          let blockTranslation = (
            block.item as IBlockRichText
          ).translations.find(
            (translation) => translation.languages_code === locale.value
          )
          // If not found, try fallback locale
          if (!blockTranslation) {
            blockTranslation = (block.item as IBlockRichText).translations.find(
              (translation) =>
                translation.languages_code === fallbackLocale.value
            )
          }
          // If found, add block to list
          if (blockTranslation) {
            localizedBlocks.push({
              collection: block.collection,
              name: (block.item as IBlockRichText).name,
              background: (block.item as IBlockRichText).background,
              background_style: (block.item as IBlockRichText).background_style,
              anchor_id: block.item.anchor_id,
              classes: block.item.classes,
              title: blockTranslation?.title || "",
              content: blockTranslation?.content || "",
            } as ILocalizedBlockRichText)
          }
          break

        // Custom block
        case "blocks_custom":
          // Add block to list
          localizedBlocks.push({
            collection: block.collection,
            name: (block.item as IBlockCustom).name,
            anchor_id: block.item.anchor_id,
            classes: block.item.classes,
          } as ILocalizedBlockCustom)
          break

        // Two-columns block
        case "blocks_two_columns":
          const blockTwoColumns = block.item as IBlockTwoColumns
          // Add block to list
          localizedBlocks.push({
            collection: block.collection,
            anchor_id: blockTwoColumns.anchor_id,
            classes: blockTwoColumns.classes,
            reverse_mobile: blockTwoColumns.reverse_mobile || false,
            column_a_blocks: localizeBlocks(
              (block.item as IBlockTwoColumns).column_a_blocks
            ),
            column_b_blocks: localizeBlocks(
              (block.item as IBlockTwoColumns).column_b_blocks
            ),
          } as ILocalizedBlockTwoColumns)
          break
      }
    })
    return localizedBlocks
  }

  // Expose the required properties, getters and actions
  return {
    fetch,
    isReady,
    pages, // Make sure to expose this even if we are not using it directly in the components (to prevent hydration mismatches)
    hasPageWithSlug,
    getPageWithSlug,
  }
})
