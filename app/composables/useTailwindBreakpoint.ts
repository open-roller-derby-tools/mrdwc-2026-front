const DEFAULT_ROOT_FONT_SIZE = 16;

const parseCssLengthToPx = (rawValue: string, fallback: number): number => {
    if (!rawValue)
        return fallback;

    if (rawValue.endsWith('px'))
        return Number.parseFloat(rawValue);

    if (rawValue.endsWith('rem'))
        return Number.parseFloat(rawValue) * DEFAULT_ROOT_FONT_SIZE;

    return Number.parseFloat(rawValue) || fallback;
};

export const useTailwindBreakpoint = () => {
    const getBreakpointPx = (name: string, fallback: number): number => {
        if (typeof document === 'undefined')
            return fallback;

        const styles = getComputedStyle(document.documentElement);
        const rawValue = styles.getPropertyValue(`--breakpoint-${name}`).trim();
        return parseCssLengthToPx(rawValue, fallback);
    };

    return { getBreakpointPx };
};

