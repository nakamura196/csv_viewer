# CSV Viewer

A simple, responsive web-based CSV viewer that supports URL-based CSV loading, built with **Tailwind CSS**, **PapaParse**, and **DataTables**.

## Features

- Load CSV data via a direct URL or through a query parameter (`?u=`).
- Display CSV data in a responsive and interactive table with pagination, search, and sorting (powered by DataTables).
- Modern and clean UI styled with **Tailwind CSS**.
- Automatically parses CSV headers and skips empty rows.

## Demo

Check out the live demo [here](https://nakamura196.github.io/csv_viewer/).

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/nakamura196/csv_viewer.git
cd csv_viewer
```

### 2. Open the `docs/index.html` File

You can open the file directly in your browser:

```bash
open docs/index.html
```

Or use a simple HTTP server to serve the file:

```bash
python -m http.server
```

Then, open `http://localhost:8000/docs` in your browser.

---

## Usage

### Load CSV via Input Field

1. Paste a CSV file URL in the input field.
2. Click the "Load CSV" button to load and display the CSV data.

### Load CSV via URL Query Parameter

Add `?u=CSV_FILE_URL` to the URL to directly load a CSV file.

Example:

```plaintext
http://localhost:8000/docs/?u=https://example.com/sample.csv
```

---

## Sample Data

The viewer ships with three quick-load sample CSVs (visible under "サンプル:" on the page):

| Label | Source | License |
| --- | --- | --- |
| Omeka S BulkImport `item.csv` | [omeka-j/Omeka-S-module-BulkImport-Sample-Data](https://github.com/omeka-j/Omeka-S-module-BulkImport-Sample-Data) | CC0-1.0 |
| `iris.csv` | [mwaskom/seaborn-data](https://github.com/mwaskom/seaborn-data) | (per upstream) |
| `titanic.csv` | [datasciencedojo/datasets](https://github.com/datasciencedojo/datasets) | (per upstream) |

The Omeka S sample illustrates the Dublin Core column layout (`dcterms:title`, `dcterms:description`, ...) used by the BulkImport module — handy for previewing a CSV before importing it into Omeka S.

## Dependencies

- [Tailwind CSS](https://tailwindcss.com/)
- [PapaParse](https://www.papaparse.com/)
- [jQuery](https://jquery.com/)
- [DataTables](https://datatables.net/)

All dependencies are loaded via CDN.

---

## Customization

### Modify Styles

To customize the table styles, edit the inline `<style>` section in the `docs/index.html` file.

### Add New Features

Modify the JavaScript section to add additional features such as:

- Custom CSV validation.
- Support for different file formats.

---

## Deployment

You can deploy this project easily on GitHub Pages:

1. Push your code to a GitHub repository.
2. Enable GitHub Pages in the repository settings.
3. Select the branch (`main` or `master`) and the root directory.
4. Access your site at `https://your-username.github.io/csv_viewer/`.

---

## Contributing

Bug reports, feature requests, and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for the workflow.

## License

This project is licensed under the [MIT License](LICENSE).

Bundled sample data is distributed under its own license — see [Sample Data](#sample-data) above.

---

## Author

- **Satoru Nakamura**  
  [GitHub Profile](https://github.com/nakamura196)
