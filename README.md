# TrekReel Website (Public)

This folder contains the public website files only.

## Files

- `index.html`
- `support.html`
- `privacy.html`
- `sources.html`
- `terms.html`
- `styles.css`

## Publish without touching local dev files

Dry run:

```bash
./scripts/publish-site.sh --dry-run origin gh-pages
```

Publish:

```bash
./scripts/publish-site.sh origin gh-pages
```

This script publishes only files from `website/` to the `gh-pages` branch.
It does **not** delete your local source code or dev assets.

## GitHub Pages

Set Pages source to:

- Branch: `gh-pages`
- Folder: `/ (root)`
