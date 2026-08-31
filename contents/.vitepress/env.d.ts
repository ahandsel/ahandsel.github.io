// Ambient module declarations for imports that TypeScript cannot resolve on
// its own.

// The copy and download buttons component ships inside vitepress-plugin-llms
// as a raw .vue file whose internals do not pass this repository's type
// check (unresolvable `?raw` svg imports and an internal type error).
// The theme therefore imports it through the @llms-copy-buttons alias that
// config.mts defines for Vite, and this declaration gives the alias a type,
// so vue-tsc never loads the plugin's own source.
declare module '@llms-copy-buttons' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent;
  export default component;
}
