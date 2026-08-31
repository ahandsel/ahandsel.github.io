# Alert title lines must be plain text

* Type: Styling
* Added: 2026-08-28
* Source: the `gitHubAlertsPlugin` implementation in VitePress 2.0.0-alpha (`node_modules/vitepress/dist/node/`)

VitePress captures everything after `[!TIP]` on the first line of a GitHub-style alert as a raw title string and prints it verbatim.
The title line is never parsed as Markdown, so formatting there reaches the reader as literal characters:

* `**Manage settings**` renders with its asterisks visible.
* `` `--force` `` renders with its backticks visible.
* `[Manage settings][link]` renders as unresolved bracket syntax, and the link is dead.

An angle bracket fails harder than that.
The plugin interpolates the title into `<p class="custom-block-title">${title}</p>` without escaping it, and VitePress then compiles the page as a Vue single-file component, so a title such as `> [!IMPORTANT] Enter <your-domain>.example.com` aborts `pnpm vitepress-build` with `Element is missing end tag`.
The pull request workflow only lints, so the failure surfaces in the deploy workflow after the merge, and the error names the Vue compiler rather than the alert, so the cause is not obvious from the message.

Line 2 and later are ordinary Markdown and render normally, so move every bold label, code span, link, and angle-bracket placeholder there.
Keep the title line a short plain-text summary.
Also note that a two-sentence title line puts both sentences in the bold title, which conflicts with [Keep each sentence on one source line](styling-sentence-per-line.md); split the second sentence onto line 2 instead.
