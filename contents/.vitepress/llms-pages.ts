// Single source of truth for which pages take part in the LLM-facing Markdown output that vitepress-plugin-llms generates.
// config.mts feeds these lists to the plugin's ignoreFiles option, and the theme uses hasMarkdownTwin to render the copy and download buttons only on pages that actually have a generated .md twin, so the two cannot drift apart.

// Pages the plugin must skip, as source paths relative to contents/.
// The root index.md is a redirect stub, and the two home-layout pages keep all of their content in frontmatter, so their Markdown twins would be empty shells that llms.txt would still advertise.
export const LLM_IGNORED_SOURCE_PAGES = ['index.md', 'en/index.md', 'en/talks.md'];

// Full ignore list for the plugin.
// Japanese pages are skipped because the plugin author recommends English-only output for LLMs, and folder README.md files are internal documentation already excluded from the build through srcExclude.
export const LLM_IGNORED_PATTERNS = [...LLM_IGNORED_SOURCE_PAGES, 'ja/**', '**/README.md'];

// True when a page has a raw .md twin in the build output, so the theme can hide the copy and download buttons everywhere else.
// Takes VitePress's page.filePath, the source path such as "en/about.md".
export function hasMarkdownTwin(filePath: string): boolean {
  if (!filePath.startsWith('en/')) return false;
  return !LLM_IGNORED_SOURCE_PAGES.includes(filePath);
}
