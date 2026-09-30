import fs from 'node:fs/promises';
import path from 'node:path';
import { defineConfig, type SiteConfig } from 'vitepress';
import llmstxt, { copyOrDownloadAsMarkdownButtons } from 'vitepress-plugin-llms';

import { LLM_IGNORED_PATTERNS } from './llms-pages';

// https://vitepress.dev/reference/site-config
// https://vitepress.dev/guide/i18n
export default defineConfig({
  title: 'Genji Fujimori',
  titleTemplate: ':title - Genji Fujimori',
  description: "Genji Fujimori's portfolio",

  // Browser favicon and iOS home screen icon. Served from contents/public/.
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', href: '/cat-icon-background.png' }],
    // Apply the stored sidebar-collapse choice before the first paint, so the
    // sidebar does not flash open on a full page load. Layout.vue reads this
    // class on mount and owns it from then on.
    [
      'script',
      {},
      "try{if(localStorage.getItem('sidebar-collapsed')==='true')document.documentElement.classList.add('sidebar-collapsed')}catch{}",
    ],
  ],

  // Folder README.md files are internal documentation, not published pages.
  // Exclude them from the build so they are not routed or dead-link checked.
  srcExclude: ['**/README.md'],

  // Show a per-page "last updated" timestamp taken from git history.
  lastUpdated: true,

  // Generate llms.txt, llms-full.txt, and a raw .md twin for every English
  // content page so LLMs can read the site without scraping HTML
  // (https://llmstxt.org/). The twins also back the per-page copy and
  // download buttons registered in theme/index.ts.
  // The skipped pages live in llms-pages.ts, which the theme reads as well,
  // so the plugin output and the button visibility cannot disagree.
  vite: {
    // The theme imports the plugin's buttons component through this alias
    // instead of its real path, so vue-tsc type-checks the ambient
    // declaration in env.d.ts rather than the plugin's own .vue source,
    // which does not pass this repository's type check.
    resolve: {
      alias: {
        '@llms-copy-buttons':
          'vitepress-plugin-llms/vitepress-components/CopyOrDownloadAsMarkdownButtons.vue',
      },
    },
    plugins: [
      llmstxt({
        domain: 'https://ahandsel.github.io',
        title: 'Genji Fujimori',
        description: "Genji Fujimori's portfolio",
        ignoreFiles: LLM_IGNORED_PATTERNS,
      }),
    ],
  },

  // Insert the copy and download-as-Markdown buttons after the H1 of every
  // page. The theme registers a gated component under this name, so pages
  // without a generated .md twin render no buttons.
  markdown: {
    config(md) {
      md.use(copyOrDownloadAsMarkdownButtons);
    },
  },

  // English content lives under /en/ and Japanese under /ja/. The site root (/)
  // redirects to /en/ (see contents/index.md). English stays the default
  // (root) locale - its pages simply sit in the en/ folder - so `link` points
  // at /en/ and there is no phantom locale in the language switcher.
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'About', link: '/en/about' },
          { text: 'Talks', link: '/en/talks' },
          { text: 'Projects', link: '/en/projects' },
        ],
        sidebar: [
          {
            text: 'Introduction',
            items: [
              { text: 'About', link: '/en/about' },
              { text: 'Talks', link: '/en/talks' },
              { text: 'Projects', link: '/en/projects' },
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
          { text: 'プロジェクト', link: '/ja/projects' },
        ],
        sidebar: [
          {
            text: 'はじめに',
            items: [
              { text: '自己紹介', link: '/ja/about' },
              { text: '登壇資料', link: '/ja/talks' },
              { text: 'プロジェクト', link: '/ja/projects' },
            ],
          },
        ],
      },
    },
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    socialLinks: [{ icon: 'github', link: 'https://github.com/ahandsel' }],

    // Client-side full-text search over the built pages. No service or index
    // hosting is required; minisearch runs in the browser.
    search: { provider: 'local' },
  },

  // English now lives under /en/. Generate root-level redirect stubs at build
  // time so any legacy or hand-typed /foo link resolves to the canonical
  // /en/foo. The site root (/) is handled separately by contents/index.md, so
  // the en/index.html page is skipped here.
  // Skipped by `vitepress dev` (buildEnd only fires on production builds).
  async buildEnd(siteConfig: SiteConfig) {
    const distDir = siteConfig.outDir;
    const enFiles = await collectEnHtml(distDir);

    await Promise.all(
      enFiles.map(async (relPath) => {
        // relPath is relative to dist/en (e.g. "about.html", "index.html").
        if (relPath === 'index.html') return;
        const target =
          '/en/' +
          relPath.replace(/(?:^|\/)index\.html$/, '').replace(/\.html$/, '');
        const stubPath = path.join(distDir, relPath);
        await fs.mkdir(path.dirname(stubPath), { recursive: true });
        await fs.writeFile(stubPath, redirectHtml(target), 'utf8');
      }),
    );
  },
});

// Walk dist/en/ and collect its HTML files, relative to that directory.
async function collectEnHtml(distDir: string): Promise<string[]> {
  const out: string[] = [];
  const enDir = path.join(distDir, 'en');
  async function walk(dir: string, rel: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const childRel = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        await walk(path.join(dir, entry.name), childRel);
      } else if (entry.isFile() && entry.name.endsWith('.html')) {
        out.push(childRel);
      }
    }
  }
  await walk(enDir, '');
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
