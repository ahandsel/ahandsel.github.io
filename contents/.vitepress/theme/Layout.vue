<script setup lang="ts">
import { useData } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { nextTick, provide } from 'vue';

const { isDark } = useData();

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
</template>
