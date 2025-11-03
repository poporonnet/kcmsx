// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "kcmsx",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/poporonnet/kcmsx",
        },
        {
          icon: "external",
          label: "Poporon Network",
          href: "https://poporon.org",
        },
      ],
      sidebar: [
        {
          label: "ガイド",
          autogenerate: { directory: "guides" },
        },
        {
          label: "リファレンス",
          autogenerate: { directory: "references" },
        },
      ],
      editLink: {
        baseUrl: "https://github.com/poporonnet/kcmsx/edit/main/packages/site",
      },
      lastUpdated: true,
    }),
  ],
});
