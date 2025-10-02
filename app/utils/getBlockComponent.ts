import BlockCustom from "~/components/blocks/BlockCustom.vue";
import BlockRichText from "~/components/blocks/BlockRichText.vue";
import BlockHero from "~/components/blocks_custom/BlockHero.vue";

const components = new Map<string, Component>([
  ["blocks_richtext", BlockRichText],
  ["blocks_custom", BlockCustom],
  ["BlockHero", BlockHero],
]);

export default (collection: string) => components.get(collection);
