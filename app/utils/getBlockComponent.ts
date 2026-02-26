// Blocks
import BlockCustom from "~/components/blocks/BlockCustom.vue";
import BlockRichText from "~/components/blocks/BlockRichText.vue";
import BlockTwoColumns from "~/components/blocks/BlockTwoColumns.vue";
import BlockTabs from "~/components/blocks/BlockTabs.vue";
// Custom blocks
import BlockHero from "~/components/blocks_custom/BlockHero.vue";
import BlockVenues from "~/components/blocks_custom/BlockVenues.vue";
import BlockApplications from "~/components/blocks_custom/BlockApplications.vue";
import BlockTickets from "~/components/blocks_custom/BlockTickets.vue";
import BlockTeams from "~/components/blocks_custom/BlockTeams.vue";

const components = new Map<string, Component>([
  // Blocks
  ["blocks_richtext", BlockRichText],
  ["blocks_custom", BlockCustom],
  ["blocks_two_columns", BlockTwoColumns],
  ["blocks_tabs", BlockTabs],
  // Custom blocks
  ["BlockHero", BlockHero],
  ["BlockVenues", BlockVenues],
  ["BlockApplications", BlockApplications],
  ["BlockTickets", BlockTickets],
  ["BlockTeams", BlockTeams],
]);

export default (collection: string) => components.get(collection);
