const datetimeFormats = {
  d: {
    day: "numeric",
  },
  m: {
    month: "long",
  },
  dm: {
    month: "long",
    day: "numeric",
  },
  dmy: {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
  ddmy: {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  },
  dmyhm: {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
  },
};

export default function i18nConfig() {
  return {
    fallbackLocale: "fr-FR",
    numberFormats: {
      "en-US": {
        currency: {
          style: "currency",
          currency: "USD",
        },
      },
      "fr-FR": {
        currency: {
          style: "currency",
          currency: "EUR",
        },
      },
    },
    datetimeFormats: {
      "en-US": datetimeFormats,
      "fr-FR": datetimeFormats,
    },
  };
}
