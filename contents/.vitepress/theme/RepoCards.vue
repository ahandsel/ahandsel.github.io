<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import { data as repos } from './repos.data.mts';

// The Japanese locale sets lang to "ja"; everything else falls back to English.
const { lang } = useData();

// Only list repositories that have earned at least one GitHub star.
const visibleRepos = computed(() => repos.filter((repo) => repo.stars >= 1));

const t = computed(() => {
  const ja = lang.value.startsWith('ja');
  return {
    empty: ja
      ? 'リポジトリを読み込めませんでした。'
      : 'No repositories to show right now.',
    stars: ja ? 'スター' : 'stars',
    forks: ja ? 'フォーク' : 'forks',
    updated: ja ? '更新' : 'Updated',
    homepage: ja ? 'サイトを開く' : 'Visit site',
  };
});

// Format the ISO timestamp using the active locale (e.g. "Jun 2026" / "2026 年 6 月").
const dateFmt = computed(
  () =>
    new Intl.DateTimeFormat(lang.value.startsWith('ja') ? 'ja-JP' : 'en-US', {
      year: 'numeric',
      month: 'short',
    }),
);
function formatDate(iso: string): string {
  return dateFmt.value.format(new Date(iso));
}
</script>

<template>
  <p v-if="!visibleRepos.length" class="repo-empty">{{ t.empty }}</p>

  <div v-else class="repo-grid">
    <article v-for="repo in visibleRepos" :key="repo.name" class="repo-card">
      <header class="repo-card__head">
        <h3 class="repo-card__name">
          <a :href="repo.url" target="_blank" rel="noopener">{{ repo.name }}</a>
        </h3>
      </header>

      <p v-if="repo.description" class="repo-card__desc">{{ repo.description }}</p>

      <ul v-if="repo.topics.length" class="repo-card__topics">
        <li v-for="topic in repo.topics.slice(0, 4)" :key="topic">{{ topic }}</li>
      </ul>

      <footer class="repo-card__meta">
        <span :title="`${repo.stars} ${t.stars}`">★ {{ repo.stars }}</span>
        <span :title="`${repo.forks} ${t.forks}`">⑂ {{ repo.forks }}</span>
        <span class="repo-card__updated">{{ t.updated }} {{ formatDate(repo.updatedAt) }}</span>
        <a
          v-if="repo.homepage"
          class="repo-card__home"
          :href="repo.homepage"
          target="_blank"
          rel="noopener"
          >{{ t.homepage }} ↗</a
        >
      </footer>
    </article>
  </div>
</template>

<style scoped>
.repo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-top: 1.5rem;
}

.repo-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  transition:
    border-color 0.25s,
    box-shadow 0.25s,
    transform 0.25s;
}

.repo-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.repo-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.repo-card__name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: normal;
  border-top: none;
  padding-top: 0;
}

.repo-card__name a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.repo-card__name a:hover {
  text-decoration: underline;
}

.repo-card__desc {
  margin: 0;
  flex-grow: 1;
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--vp-c-text-2);
}

.repo-card__topics {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.repo-card__topics li {
  margin: 0;
  padding: 0.1rem 0.5rem;
  font-size: 0.7rem;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-default-soft);
  border-radius: 6px;
}

.repo-card__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
}

.repo-card__updated {
  color: var(--vp-c-text-3);
}

.repo-card__home {
  margin-left: auto;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.repo-card__home:hover {
  text-decoration: underline;
}

.repo-empty {
  margin-top: 1.5rem;
  color: var(--vp-c-text-2);
}
</style>
