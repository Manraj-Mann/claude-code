# My Learning Garden

A calm, Markdown-driven learning hub built with plain HTML, CSS, and vanilla JavaScript. There is no build step or package manager: publish the files as-is with GitHub Pages.

## Run locally

The site fetches `manifest.json` and note files, so open it through a local web server rather than directly as a `file://` URL. For example, from the project directory:

```sh
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Add a learning module

1. Create a Markdown file inside `notes/`, such as `notes/03-css-layout.md`. Use standard Markdown headings, lists, links, and fenced code blocks. Add a language after the opening fence for highlighted code, for example ```` ```js ````.
2. Add an object to the array in `manifest.json`:

   ````json
   {
     "title": "CSS layout notes",
     "category": "Design",
     "status": "Draft",
     "date": "2026-11-12",
     "summary": "A short, one- or two-sentence preview of the note.",
     "file": "notes/03-css-layout.md"
   }
   ````

   Keep the JSON valid: separate objects with commas, but do not add a comma after the last object. Categories can be `Programming`, `Design`, `Systems`, or `Notes`. Use `Draft`, `In Progress`, or `Completed` for status.
3. Commit and push both files. The new card is loaded from the manifest automatically.

## Publish with GitHub Pages

1. Push the site files to a GitHub repository.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select the branch containing the site and the `/ (root)` folder, then save.
4. Open the published URL after GitHub Pages finishes deploying.

All site and note URLs are relative, so this also works when published at a repository subpath such as `username.github.io/repo-name/`.

## Included features

- Responsive topic cards with category filters and live search (`/` focuses search).
- Markdown reader dialog with syntax-highlighted fenced code and per-block copy buttons.
- Light/dark theme preference saved in `localStorage`.
- Marked, DOMPurify, Highlight.js, and web fonts loaded from CDNs.
