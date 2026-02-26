import { describe, it, expect, vi } from "vitest";

// Mock all .vue imports so we don't need the Vue plugin
vi.mock("~/components/blocks/BlockCustom.vue", () => ({ default: { name: "BlockCustom" } }));
vi.mock("~/components/blocks/BlockRichText.vue", () => ({ default: { name: "BlockRichText" } }));
vi.mock("~/components/blocks/BlockTwoColumns.vue", () => ({ default: { name: "BlockTwoColumns" } }));
vi.mock("~/components/blocks/BlockTabs.vue", () => ({ default: { name: "BlockTabs" } }));
vi.mock("~/components/blocks_custom/BlockHero.vue", () => ({ default: { name: "BlockHero" } }));
vi.mock("~/components/blocks_custom/BlockVenues.vue", () => ({ default: { name: "BlockVenues" } }));
vi.mock("~/components/blocks_custom/BlockApplications.vue", () => ({ default: { name: "BlockApplications" } }));
vi.mock("~/components/blocks_custom/BlockTickets.vue", () => ({ default: { name: "BlockTickets" } }));

const { default: getBlockComponent } = await import("~/utils/getBlockComponent");

describe("getBlockComponent", () => {
	it.each([
		"blocks_richtext",
		"blocks_custom",
		"blocks_two_columns",
		"blocks_tabs",
		"BlockHero",
		"BlockVenues",
		"BlockApplications",
		"BlockTickets",
	])("returns a component for '%s'", (name) => {
		expect(getBlockComponent(name)).toBeDefined();
	});

	it("returns undefined for an unknown collection", () => {
		expect(getBlockComponent("nonexistent")).toBeUndefined();
	});

	it("returns distinct components for different collections", () => {
		const richtext = getBlockComponent("blocks_richtext");
		const custom = getBlockComponent("blocks_custom");
		expect(richtext).not.toBe(custom);
	});
});
