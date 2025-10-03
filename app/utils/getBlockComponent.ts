import BlockCustom from "~/components/blocks/BlockCustom.vue";
import BlockRichText from "~/components/blocks/BlockRichText.vue";
import BlockHero from "~/components/blocks_custom/BlockHero.vue";
import BlockVenues from "~/components/blocks_custom/BlockVenues.vue";

const components = new Map<string, Component>([
  ["blocks_richtext", BlockRichText],
  ["blocks_custom", BlockCustom],
  ["BlockHero", BlockHero],
  ["BlockVenues", BlockVenues],
]);

export default (collection: string) => components.get(collection);
