import { useLocalStorage } from "@vueuse/core";

const STORAGE_KEY = "mrdwc-no-spoiler-mode";

export function useNoSpoilerMode() {
	const isNoSpoilerModeActive = useLocalStorage(STORAGE_KEY, false);

	function toggleNoSpoilerMode() {
		isNoSpoilerModeActive.value = !isNoSpoilerModeActive.value;
	}

	function setNoSpoilerMode(value: boolean) {
		isNoSpoilerModeActive.value = value;
	}

	return {
		isNoSpoilerModeActive,
		toggleNoSpoilerMode,
		setNoSpoilerMode,
	};
}
