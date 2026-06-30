<script setup lang="ts">
import { useData, inBrowser } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { computed, nextTick, provide, ref, watch } from 'vue';

const { isDark, frontmatter, lang } = useData();

// Sidebar collapse toggle.
//
// VitePress has no built-in control to collapse the whole desktop sidebar, so
// we render a floating button that toggles a `sidebar-collapsed` class on
// <html>. The actual hide/reflow is done in style.css. The choice is persisted
// to localStorage so it survives navigation and reloads.
const STORAGE_KEY = 'sidebar-collapsed';
const collapsed = ref(
  inBrowser && localStorage.getItem(STORAGE_KEY) === 'true',
);

// Show the toggle only on pages that actually render a sidebar. This mirrors
// the default theme's own `hasSidebar` rule: a sidebar shows unless the page
// opts out (`sidebar: false`) or is treated as the home page. The `isHome`
// frontmatter override lets the Talks pages keep `layout: home` while still
// rendering the configured sidebar, so the toggle must appear there too. The
// `page` layout is the root redirect stub, which has no sidebar.
const showToggle = computed(() => {
  const fm = frontmatter.value;
  if (fm.layout === 'page') return false;
  const isHome = !!(fm.isHome ?? fm.layout === 'home');
  return fm.sidebar !== false && !isHome;
});

const toggleLabel = computed(() => {
  const ja = lang.value.startsWith('ja');
  if (collapsed.value) {
    return ja ? 'サイドバーを表示' : 'Show sidebar';
  }
  return ja ? 'サイドバーを隠す' : 'Hide sidebar';
});

if (inBrowser) {
  watch(
    collapsed,
    (value) => {
      document.documentElement.classList.toggle('sidebar-collapsed', value);
      localStorage.setItem(STORAGE_KEY, String(value));
    },
    { immediate: true },
  );
}

// Only animate when the browser supports the View Transitions API and the
// visitor has not asked to reduce motion.
function enableTransitions() {
  return (
    'startViewTransition' in document &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches
  );
}

// VitePress's built-in appearance switch calls this injected function, so the
// sun/moon toggle reveals the new theme as a circle growing from the cursor.
provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value;
    return;
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px at ${x}px ${y}px)`,
  ];

  const root = document.documentElement;

  // Pause the continuously-running rainbow animation on <html> while the view
  // transition is in flight. The transition snapshots <html>; if the rainbow
  // keeps mutating it mid-capture, the old and new layers drift apart and the
  // reveal looks jittery on repeated toggles.
  root.classList.add('vt-freeze');

  const transition = document.startViewTransition(async () => {
    isDark.value = !isDark.value;
    await nextTick();
  });

  await transition.ready;

  const animation = root.animate(
    { clipPath: isDark.value ? [...clipPath].reverse() : clipPath },
    {
      duration: 600,
      easing: 'ease-in',
      pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`,
    },
  );

  animation.finished.finally(() => root.classList.remove('vt-freeze'));
});
</script>

<template>
  <DefaultTheme.Layout />

  <button
    v-if="showToggle"
    type="button"
    class="sidebar-toggle"
    :class="{ 'is-collapsed': collapsed }"
    :aria-expanded="(!collapsed).toString()"
    aria-controls="VPSidebarNav"
    :aria-label="toggleLabel"
    :title="toggleLabel"
    @click="collapsed = !collapsed"
  >
    <svg
      class="sidebar-toggle__icon"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  </button>
</template>
