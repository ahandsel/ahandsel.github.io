// https://vitepress.dev/guide/custom-theme
import { defineComponent, h, watch } from 'vue';
import type { Theme } from 'vitepress';
import { inBrowser, useData } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import CopyOrDownloadAsMarkdownButtons from '@llms-copy-buttons';
import Layout from './Layout.vue';
import RepoCards from './RepoCards.vue';
import { hasMarkdownTwin } from '../llms-pages';
import './style.css';

// vitepress-plugin-llms generates a raw .md twin for English content pages only, so render the copy and download buttons only where a twin exists.
// Japanese pages and the pages listed in llms-pages.ts would otherwise show buttons that fetch a 404.
const GatedCopyOrDownloadAsMarkdownButtons = defineComponent({
  name: 'GatedCopyOrDownloadAsMarkdownButtons',
  setup() {
    const { page } = useData();
    return () =>
      hasMarkdownTwin(page.value.filePath) ? h(CopyOrDownloadAsMarkdownButtons) : null;
  },
});

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router }) {
    // Register globally so Markdown pages can use <RepoCards /> without importing.
    app.component('RepoCards', RepoCards);

    // The copyOrDownloadAsMarkdownButtons markdown-it plugin in config.mts injects this component name after the H1 of every page.
    app.component('CopyOrDownloadAsMarkdownButtons', GatedCopyOrDownloadAsMarkdownButtons);

    // Toggle the rainbow accent animation on the home page only by adding or removing the `rainbow-active` class on <html>.
    // The animation itself is defined in style.css.
    if (inBrowser) {
      watch(
        () => router.route.path,
        (path) => {
          document.documentElement.classList.toggle('rainbow-active', path === '/');
        },
        { immediate: true },
      );
    }
  },
} satisfies Theme;
