import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
//import node from "@astrojs/node";
import cloudflare from "@astrojs/cloudflare";
import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import { loadEnv } from "vite";
import spectre, { type GiscusMapping } from "./package/src";
import { spectreDark } from "./src/ec-theme";

const {
	GISCUS_REPO,
	GISCUS_REPO_ID,
	GISCUS_CATEGORY,
	GISCUS_CATEGORY_ID,
	GISCUS_MAPPING,
	GISCUS_STRICT,
	GISCUS_REACTIONS_ENABLED,
	GISCUS_EMIT_METADATA,
	GISCUS_LANG,
} = loadEnv(process.env.NODE_ENV!, process.cwd(), "");

// https://astro.build/config
const config = defineConfig({
	site: "https://spectre.lou.gg",
	output: "static",
	integrations: [
		expressiveCode({
			themes: [spectreDark],
		}),
		mdx(),
		sitemap(),
		spectre({
			name: "Ben Larkin",
			openGraph: {
				home: {
					title: "Ben Larkin",
					description: "A minimalistic theme for Astro.",
				},
				blog: {
					title: "Blog",
					description: "News and guides for Spectre.",
				},
				projects: {
					title: "Projects",
				},
			},
			/*giscus: {
				repository: GISCUS_REPO,
				repositoryId: GISCUS_REPO_ID,
				category: GISCUS_CATEGORY,
				categoryId: GISCUS_CATEGORY_ID,
				mapping: GISCUS_MAPPING as GiscusMapping,
				strict: GISCUS_STRICT === "true",
				reactionsEnabled: GISCUS_REACTIONS_ENABLED === "true",
				emitMetadata: GISCUS_EMIT_METADATA === "true",
				lang: GISCUS_LANG,
			},*/
		}),
	],
	// 	adapter: node({
	// 	mode: "standalone",
	// }),
	adapter: cloudflare(),
});

export default config;
