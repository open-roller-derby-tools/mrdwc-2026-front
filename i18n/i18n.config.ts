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

export default defineI18nConfig(() => {
  return {
    fallbackLocale: "en",
    numberFormats: {
      en: {
        currency: {
          style: "currency",
          currency: "USD",
        },
      },
      fr: {
        currency: {
          style: "currency",
          currency: "EUR",
        },
      },
    },
    datetimeFormats: {
      en: datetimeFormats,
      fr: datetimeFormats,
    },
  };
});
