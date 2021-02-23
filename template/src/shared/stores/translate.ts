import type { Resource, TFunction } from "i18next";
import i18next from 'i18next';
import { readable } from 'svelte/store';

export const translate = (
  translations: Resource | Resource[],
  locale = "en_us"
) =>
  readable<TFunction>(
    () => {
      if (!i18next.isInitialized) {
        loadI18Next(locale, () => {});

        return "";
      } else {
        loadTranslations(translations);

        return i18next.t.bind(i18next);
      }
    },
    (set) => {
      if (!i18next.isInitialized) {
        loadI18Next(locale, (t) => {
          loadTranslations(translations);
          set(t);
        });
      } else {
        loadTranslations(translations);

        set(i18next.t.bind(i18next));
      }
    }
  );

function loadI18Next(locale: string, loaded: (value: TFunction) => void) {
  i18next
    .init({
      lng: locale,
    })
    .then(loaded);
}

function loadTranslations(translations: Resource | Resource[]) {
  let arrayTranslations: Resource[];

  if (Array.isArray(translations)) {
    arrayTranslations = translations;
  } else {
    arrayTranslations = [translations];
  }

  for (const translation of arrayTranslations)
    for (const languageName in translation) {
      const language = translation[languageName];

      for (const namespaceName in language) {
        const resouceBundle = language[namespaceName];

        i18next.addResourceBundle(
          languageName,
          namespaceName,
          resouceBundle,
          true
        );
      }
    }
}
