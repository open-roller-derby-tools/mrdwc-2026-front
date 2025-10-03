// Blocks
import BlockCustom from "~/components/blocks/BlockCustom.vue";
import BlockRichText from "~/components/blocks/BlockRichText.vue";
import BlockTwoColumns from "~/components/blocks/BlockTwoColumns.vue";
// Custom blocks
import BlockHero from "~/components/blocks_custom/BlockHero.vue";
import BlockVenues from "~/components/blocks_custom/BlockVenues.vue";

const components = new Map<string, Component>([
  // Blocks
  ["blocks_richtext", BlockRichText],
  ["blocks_custom", BlockCustom],
  ["blocks_two_columns", BlockTwoColumns],
  // Custom blocks
  ["BlockHero", BlockHero],
  ["BlockVenues", BlockVenues],
]);

export default (collection: string) => components.get(collection);
