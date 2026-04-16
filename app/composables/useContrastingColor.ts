import { computed, unref, type MaybeRef } from "vue";

function normalizeHexColor(input: string): string | null {
	const raw = input.trim();
	if (!raw) return null;

	const hex = raw.startsWith("#") ? raw.slice(1) : raw;
	// Support #RGB shorthand -> expand to #RRGGBB
	const expanded =
		hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;

	if (!/^[0-9a-fA-F]{6}$/.test(expanded)) return null;
	return expanded.toUpperCase();
}

/**
 * Pick a readable foreground color (black or white) for a given background hex color.
 * Returns `#000000` when the input isn't a supported hex format.
 */
export function getContrastingTextColor(
	bg: string | null | undefined
): "#000000" | "#FFFFFF" {
	if (!bg) return "#000000";

	const normalized = normalizeHexColor(bg);
	if (!normalized) return "#000000";

	const r = parseInt(normalized.slice(0, 2), 16) / 255;
	const g = parseInt(normalized.slice(2, 4), 16) / 255;
	const b = parseInt(normalized.slice(4, 6), 16) / 255;

	// Relative luminance (WCAG)
	const srgbToLin = (c: number) =>
		c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
	const L = 0.2126 * srgbToLin(r) + 0.7152 * srgbToLin(g) + 0.0722 * srgbToLin(b);

	return L > 0.5 ? "#000000" : "#FFFFFF";
}

/**
 * Vue composable wrapper around `getContrastingTextColor`.
 */
export function useContrastingColor(bg: MaybeRef<string | null | undefined>) {
	return computed(() => getContrastingTextColor(unref(bg)));
}

