import { format, parseISO } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
// TODO: Add more locales if needed

export const useFormatTimeLocalized = () => {
    const { locale } = useI18n();

    const formatDate = (date: Date | string): string => {
        const parsedDate = typeof date === 'string' ? parseISO(date) : date;
        return format(parsedDate, 'PP', { locale: locale.value === 'fr-FR' ? fr : enUS });
    };

    const formatTime = (time: Date | string): string => {
        const parsedTime = typeof time === 'string' ? parseISO(time) : time;
        return format(parsedTime, 'p', { locale: locale.value === 'fr-FR' ? fr : enUS });
    };

    const formatDay = (date: Date | string): string => {
        const parsedDate = typeof date === 'string' ? parseISO(date) : date;
        return format(parsedDate, 'eeee', { locale: locale.value === 'fr-FR' ? fr : enUS });
    };

    const formatDayShort = (date: Date | string): string => {
        const parsedDate = typeof date === 'string' ? parseISO(date) : date;
        return format(parsedDate, 'eee', { locale: locale.value === 'fr-FR' ? fr : enUS });
    };

    return { formatDate, formatTime, formatDay, formatDayShort };
};