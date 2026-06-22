import fs from 'node:fs/promises';
import path from 'node:path';
import { defineConfig, type SiteConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
// https://vitepress.dev/guide/i18n
export default defineConfig({
  title: 'Genji Fujimori',
  description: "Genji Fujimori's portfolio",

  // Browser favicon and iOS home screen icon. Served from contents/public/.
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', href: '/cat-icon-background.png' }],
  ],

  // English is the default locale, served at the site root (/).
  // Japanese lives under /ja/. VitePress renders a language switcher in the nav.
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'About', link: '/about' },
          { text: 'Talks', link: '/talks' },
        ],
        sidebar: [
          {
            text: 'Introduction',
            items: [
              { text: 'About', link: '/about' },
              { text: 'Talks', link: '/talks' },
            ],
          },
        ],
      },
    },
    ja: {
      label: '日本語',
      lang: 'ja',
      link: '/ja/',
      themeConfig: {
        nav: [
          { text: 'ホーム', link: '/ja/' },
          { text: '自己紹介', link: '/ja/about' },
          { text: '登壇資料', link: '/ja/talks' },
        ],
        sidebar: [
          {
            text: 'はじめに',
            items: [
              { text: '自己紹介', link: '/ja/about' },
              { text: '登壇資料', link: '/ja/talks' },
            ],
          },
        ],
      },
    },
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    socialLinks: [{ icon: 'github', link: 'https://github.com/ahandsel' }],
  },

  // Generate /en/* redirect stubs at build time so any legacy or hand-typed
  // /en/foo link resolves to the canonical /foo (the English default).
  // Skipped by `vitepress dev` (buildEnd only fires on production builds).
  async buildEnd(siteConfig: SiteConfig) {
    const distDir = siteConfig.outDir;
    const rootFiles = await collectRootHtml(distDir);

    await Promise.all(
      rootFiles.map(async (relPath) => {
        const target =
          '/' + relPath.replace(/(?:^|\/)index\.html$/, '').replace(/\.html$/, '');
        const stubPath = path.join(distDir, 'en', relPath);
        await fs.mkdir(path.dirname(stubPath), { recursive: true });
        await fs.writeFile(stubPath, redirectHtml(target), 'utf8');
      }),
    );
  },
});

// Walk dist/ and collect HTML files that belong to the English (root) locale.
// Excludes the ja/ and en/ subtrees, plus the 404 page.
async function collectRootHtml(distDir: string): Promise<string[]> {
  const out: string[] = [];
  async function walk(dir: string, rel: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const childRel = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        if (entry.name === 'en' || entry.name === 'ja') continue;
        await walk(path.join(dir, entry.name), childRel);
      } else if (entry.isFile() && entry.name.endsWith('.html')) {
        if (childRel === '404.html') continue;
        out.push(childRel);
      }
    }
  }
  await walk(distDir, '');
  return out;
}

function redirectHtml(target: string): string {
  const safe = target.replace(/"/g, '&quot;');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=${safe}">
<link rel="canonical" href="${safe}">
<title>Redirecting to ${safe}</title>
<script>window.location.replace(${JSON.stringify(target)});</script>
</head>
<body>
<p>Redirecting to <a href="${safe}">${safe}</a>...</p>
</body>
</html>
`;
}
