// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "kcmsx",
      locales: {
        root: {
          label: "日本語",
          lang: "ja-JP",
        },
      },
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
          items: ["guides/what-is-kcmsx", "guides/getting-started"],
        },
        {
          label: "ステップバイステップ",
          items: ["step-by-step", "step-by-step/register-teams"],
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
