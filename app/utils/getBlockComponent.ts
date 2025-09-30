import BlockCustom from "~/components/blocks/BlockCustom.vue";
import BlockRichText from "~/components/blocks/BlockRichText.vue";

const components = new Map<string, Component>([
  ["blocks_richtext", BlockRichText],
  ["blocks_custom", BlockCustom],
]);

export default (collection: string) => components.get(collection);
