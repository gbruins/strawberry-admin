import { createI18n } from 'vue-i18n';

export const i18n = () => {
    function loadLocaleMessages() {
        const locales = import.meta.glob<{ default: Record<string, string> }>('../locales/*.js', { eager: true });
        const messages: Record<string, Record<string, string>> = {};

        for (const path in locales) {
            const matched = path.match(/([A-Za-z0-9-_]+)\.js$/i);
            if (matched?.[1]) {
                messages[matched[1]] = locales[path]!.default;
            }
        }

        return messages;
    }

    const defaultLocale = 'en-US';
    document.documentElement.setAttribute('lang', defaultLocale);

    return createI18n({
        lazy: true,
        legacy: false,
        globalInjection: true,
        locale: defaultLocale,
        fallbackLocale: defaultLocale,
        messages: loadLocaleMessages(),
        missingWarn: true,
        datetimeFormats: {
            'en-US': {
                short: {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                },
                long: {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    weekday: 'short',
                    hour: 'numeric',
                    minute: 'numeric'
                }
            }
        },
        numberFormats: {
            'en-US': {
                currency: {
                    style: 'currency',
                    currency: 'USD',
                    useGrouping: true,
                    currencyDisplay: 'symbol'
                },
                decimal: {
                    style: 'decimal',
                    useGrouping: true
                },
                percent: {
                    style: 'percent',
                    useGrouping: true
                }
            }
        }
    });
}
