import withNuxt from "./.nuxt/eslint.config.mjs";
import prettier from "eslint-config-prettier";
import vueParser from "vue-eslint-parser";
import tsParser from "@typescript-eslint/parser";

export default withNuxt(
  {
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        sourceType: "module",
        ecmaVersion: "latest",
        extraFileExtensions: [".vue"]
      }
    },
    
  },
	// Disable formatting conflicts with Prettier
	prettier,
	{
		rules: {
			// Nuxt auto-imports components, so single-word names are common and expected
			"vue/multi-word-component-names": "off",
			// This project uses v-html intentionally for CMS rich text content
			"vue/no-v-html": "off",
			"no-case-declarations": "off",
		},
	}
);
