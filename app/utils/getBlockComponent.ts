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
import BlockOfficialsCrews from "~/components/blocks_custom/BlockOfficialsCrews.vue";
import BlockOfficialsCrew from "~/components/blocks_custom/BlockOfficialsCrew.vue";
import BlockCalendar from "~/components/blocks_custom/BlockCalendar.vue";
import BlockNoSpoilers from "~/components/blocks_custom/BlockNoSpoilers.vue";
import BlockTrackLocations from "~/components/blocks_custom/BlockTrackLocations.vue";
import BlockGroups from "~/components/blocks_custom/BlockGroups.vue";
import BlockGroupsRankings from "~/components/blocks_custom/BlockGroupsRankings.vue";
import BlockTimezoneSwitcher from "~/components/blocks_custom/BlockTimezoneSwitcher.vue";
import BlockAnnouncers from "~/components/blocks_custom/BlockAnnouncers.vue";
import BlockPhotographers from "~/components/blocks_custom/BlockPhotographers.vue";

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
	["BlockOfficialsCrews", BlockOfficialsCrews],
	["BlockOfficialsCrew", BlockOfficialsCrew],
	["BlockCalendar", BlockCalendar],
	["BlockNoSpoilers", BlockNoSpoilers],
	["BlockTrackLocations", BlockTrackLocations],
	["BlockGroups", BlockGroups],
	["BlockGroupsRankings", BlockGroupsRankings],
	["BlockTimezoneSwitcher", BlockTimezoneSwitcher],
	["BlockAnnouncers", BlockAnnouncers],
	["BlockPhotographers", BlockPhotographers],
]);

export default (collection: string) => components.get(collection);
