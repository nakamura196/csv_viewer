# Contributing

Thanks for your interest in improving CSV Viewer. This document describes how to report issues and submit changes.

## Reporting Issues

Please open an issue at <https://github.com/nakamura196/csv_viewer/issues> and include:

- What you tried (URL of the CSV, browser, OS)
- What you expected to happen
- What actually happened (screenshots welcome)
- A minimal reproducible CSV when possible (or a public URL to one)

## Development

This project is a single static page under `docs/`. No build step is required.

```bash
git clone https://github.com/nakamura196/csv_viewer.git
cd csv_viewer
python -m http.server   # then open http://localhost:8000/docs/
```

The page loads its design tokens from `@nakamura196/react-ui`'s `static.css`. During local development the stylesheet is referenced via a relative path (`../../react-ui/src/styles/static.css`); production builds should swap that for a pinned jsDelivr URL.

Functional libraries (PapaParse, jQuery, DataTables) are loaded from CDN — no `node_modules` to install.

## Pull Requests

1. Fork the repository and create a topic branch off `main`.
2. Keep changes focused; one logical change per PR.
3. Test the change in a browser against at least one real CSV (the bundled samples on the page are fine).
4. Reference any related issue in the PR description.

## Sample Data

If you add or change a sample CSV link in `docs/index.html`, please also update the **Sample Data** table in [README.md](README.md) so source and license stay in sync. Prefer sources with a clear permissive license (CC0 / MIT / public domain). Avoid linking to CSVs hosted on personal infrastructure that may disappear.

## License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
