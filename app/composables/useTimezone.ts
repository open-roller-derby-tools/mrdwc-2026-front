import { useLocalStorage } from "@vueuse/core";

const STORAGE_KEY = "mrdwc-timezone";

export function useTimezone() {
    const active_timezone = useLocalStorage(STORAGE_KEY, 'Europe/Paris');
    const tournament_timezone = 'Europe/Paris';
    const user_timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    function toggleTimezone() {
        active_timezone.value = active_timezone.value === tournament_timezone ? user_timezone : tournament_timezone;
    }

    return {
        active_timezone,
        tournament_timezone,
        user_timezone,
        toggleTimezone,
    };
}
