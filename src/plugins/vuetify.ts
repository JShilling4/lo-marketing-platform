/**
 * Vuetify3 Plugin
 */
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { createVuetify, type ThemeDefinition } from "vuetify";

// For test use. Do not include createVuetify()
// see https://next.vuetifyjs.com/en/features/treeshaking/
// import * as components from "vuetify/components";
// import * as directives from "vuetify/directives";

// Translations provided by Vuetify
import { en } from "vuetify/locale";

// Misc

// Styles
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

enum ThemeColors {
  background = "#16af8c",
  primary = "#16af8c",
  secondary = "#142f42",
  error = "#e83953",
  success = "#00b84f",
}

const customTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: ThemeColors.background,
    primary: ThemeColors.primary,
    secondary: ThemeColors.secondary,
    error: ThemeColors.error,
  },
};

export default createVuetify({
  // Global configuration
  // https://next.vuetifyjs.com/en/features/global-configuration/
  /*
  defaults: {
    global: {
      ripple: false,
    },
    VSheet: {
      elevation: 4,
    },
  },
  */
  // Icon Fonts
  // https://next.vuetifyjs.com/en/features/icon-fonts/
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  // Internationalization (i18n)
  // https://next.vuetifyjs.com/en/features/internationalization/#internationalization-i18n
  locale: {
    locale: "en",
    fallback: "en",
    messages: { en },
  },
  // Theme
  // https://next.vuetifyjs.com/en/features/theme/
  theme: {
    defaultTheme: "customTheme",
    themes: {
      customTheme,
    },
  },
});

// Export for test.
// export { components, directives };
