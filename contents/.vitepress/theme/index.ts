// https://vitepress.dev/guide/custom-theme
import { h, watch } from 'vue';
import type { Theme } from 'vitepress';
import { inBrowser } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import Layout from './Layout.vue';
import RepoCards from './RepoCards.vue';
import './style.css';

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router }) {
    // Register globally so Markdown pages can use <RepoCards /> without importing.
    app.component('RepoCards', RepoCards);

    // Toggle the rainbow accent animation on the home page only by adding or
    // removing the `rainbow-active` class on <html>. The animation itself is
    // defined in style.css.
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
