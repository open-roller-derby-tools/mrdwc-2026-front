import withNuxt from "./.nuxt/eslint.config.mjs";
import prettier from "eslint-config-prettier";

export default withNuxt(
	// Disable formatting conflicts with Prettier
	prettier,
	{
		rules: {
			// Nuxt auto-imports components, so single-word names are common and expected
			"vue/multi-word-component-names": "off",
			// This project uses v-html intentionally for CMS rich text content
			"vue/no-v-html": "off",
		},
	},
);