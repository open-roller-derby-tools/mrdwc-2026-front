import { describe, it, expect, vi } from "vitest";

// Mock useRuntimeConfig before importing the module
vi.stubGlobal("useRuntimeConfig", () => ({
	public: {
		apiBase: "https://backend.example.org",
	},
}));

const { default: buildRESTURL } = await import(
	"~/utils/buildRESTURL"
);

describe("buildRESTURL", () => {
	it("builds a URL with the correct base path", () => {
		const url = buildRESTURL("pages", { slug: true });
		expect(url.origin).toBe("https://backend.example.org");
		expect(url.pathname).toBe("/items/pages/");
	});

	it("serialises flat fields", () => {
		const url = buildRESTURL("pages", { name: true, slug: true });
		expect(url.searchParams.get("fields")).toBe("name,slug");
	});

	it("serialises nested fields with dot notation", () => {
		const url = buildRESTURL("pages", {
			translations: {
				languages_code: true,
				title: true,
			},
		});
		expect(url.searchParams.get("fields")).toBe(
			"translations.languages_code,translations.title"
		);
	});

	it("serialises deeply nested fields", () => {
		const url = buildRESTURL("pages", {
			blocks: {
				sort: true,
				item: {
					translations: {
						languages_code: true,
					},
				},
			},
		});
		expect(url.searchParams.get("fields")).toBe(
			"blocks.sort,blocks.item.translations.languages_code"
		);
	});

	it("handles mixed flat and nested fields", () => {
		const url = buildRESTURL("teams", {
			name: true,
			members: {
				name: true,
				number: true,
			},
			slug: true,
		});
		expect(url.searchParams.get("fields")).toBe(
			"name,members.name,members.number,slug"
		);
	});

	it("uses the correct collection name in the path", () => {
		const url = buildRESTURL("sponsors", { name: true });
		expect(url.pathname).toBe("/items/sponsors/");
	});

	it("throws a clear error when apiBase is not set", async () => {
		vi.stubGlobal("useRuntimeConfig", () => ({
			public: { apiBase: "" },
		}));
		const { default: buildWithEmptyBase } = await import("~/utils/buildRESTURL");
		expect(() => buildWithEmptyBase("pages", { slug: true })).toThrow(
			"NUXT_PUBLIC_API_BASE"
		);
	});
});
