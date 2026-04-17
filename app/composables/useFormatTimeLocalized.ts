import { format, parseISO } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
import { tz } from '@date-fns/tz';

export const useFormatTimeLocalized = () => {
    const { locale } = useI18n();
    const { active_timezone } = useTimezone();

    const formatDate = (date: Date | string): string => {
        const parsedDate = typeof date === 'string' ? parseISO(date) : date;
        return format(parsedDate, 'PP', { locale: locale.value === 'fr-FR' ? fr : enUS, in: tz(active_timezone.value) });
    };

    const formatTime = (time: Date | string): string => {
        const parsedTime = typeof time === 'string' ? parseISO(time) : time;

        return format(parsedTime, 'p', { locale: locale.value === 'fr-FR' ? fr : enUS, in: tz(active_timezone.value) });
    };

    const formatDay = (date: Date | string): string => {
        const parsedDate = typeof date === 'string' ? parseISO(date) : date;
        return format(parsedDate, 'eeee', { locale: locale.value === 'fr-FR' ? fr : enUS, in: tz(active_timezone.value) });
    };

    const formatDayShort = (date: Date | string): string => {
        const parsedDate = typeof date === 'string' ? parseISO(date) : date;
        return format(parsedDate, 'eee', { locale: locale.value === 'fr-FR' ? fr : enUS, in: tz(active_timezone.value) });
    };

    const formatDateYMD = (date: Date | string): string => {
        const parsedDate = typeof date === 'string' ? parseISO(date) : date;
        return format(parsedDate, 'yyyy-MM-dd', { locale: locale.value === 'fr-FR' ? fr : enUS, in: tz(active_timezone.value) });
    };

    return { formatDate, formatTime, formatDay, formatDayShort, formatDateYMD };
};