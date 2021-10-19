import available from "./available";

test("languages are defined correctly (minimally)", () => {
  const groups = {
    en: ["en", "en-en", "en-us", "en-au"],
    fr: ["ca", "ca-es"],
    es: ["es", "es-es"],
    pl: ["pl", "pl-pl"],
    no: ["nb-no"],
  };

  for (const locale of Object.keys(groups)) {
    for (const keyIndex of groups[locale]) {
      expect(available.find(({ key }) => key === keyIndex).value.locale).toBe(
        locale
      );
    }
  }
});

test("all languages define all and only all translations defined in English", () => {
  const english = available.find(({ key }) => key === "en").value;
  const languages = available
    .filter(({ key }) => ["ca", "es", "pl", "nb-no"].includes(key))
    .map(({ value }) => value);

  // All defined keys in English are defined in all languages
  const components = Object.keys(english).filter(
    (key) => !["locale", "name"].includes(key)
  );

  for (const component of components) {
    for (const text of Object.keys(english[component])) {
      // English key is equal to english translation
      try {
        expect(english[component][text]).toBe(text);
      } catch (err) {
        throw new Error(
          `Component '${component}' defined in English is NOT defined in language '${language.locale}'`
        );
      }

      // All English keys are defined in all languages
      for (const language of languages) {
        try {
          expect(language[component][text]).toBeDefined();
          expect(language[component][text].length).not.toBe(0);
        } catch (err) {
          throw new Error(
            `Text key '${text}' defined in component '${component}' defined in English is NOT defined in language '${language.locale}'`
          );
        }
      }
    }
  }

  // All defined keys and components in all languages are defined in English
  for (const language of languages) {
    const components = Object.keys(language).filter(
      (key) => !["locale", "name"].includes(key)
    );

    for (const component of components) {
      // Component defined in language is also defined in English
      try {
        expect(english[component]).toBeDefined();
      } catch (err) {
        throw new Error(
          `Component '${component}' defined in language '${language.locale}' is NOT defined in English`
        );
      }

      // All keys defined in language's components are also defined in English' components
      for (const text of Object.keys(language[component])) {
        try {
          expect(english[component][text]).toBeDefined();
        } catch (err) {
          throw new Error(
            `Text key '${text}' defined in component '${component}' defined in language '${language.locale}' is NOT defined in English`
          );
        }
      }
    }
  }
});
