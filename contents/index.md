---
# Root landing page. English now lives under /en/ and Japanese under /ja/, so
# this page immediately redirects visitors to the English site at /en/.
layout: page
title: Redirecting
head:
  - ['meta', { 'http-equiv': 'refresh', content: '0; url=/en/' }]
  - ['link', { rel: 'canonical', href: '/en/' }]
---

<script setup>
import { onMounted } from 'vue';
onMounted(() => {
  window.location.replace('/en/');
});
</script>

Redirecting to [/en/](/en/) ...
