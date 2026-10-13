# Carte homepage (aiposlab.com)

Static site for Carte by AIPOS LAB.

- `main` is what GitHub Pages serves at www.aiposlab.com.
- `carte-homepage` holds the new Carte site until it is approved to go live.
- Tag `v1.0-company-site` marks the previous company site.

## Editing

Edit `site.src.html` (never the generated pages), then run:

    python3 build.py

This writes `index.html`, `pos.html`, `kitchen.html`, `table-order.html`, `back-office.html`, `faq.html`, `privacy.html` and `terms.html`.
Privacy and terms text lives in `privacy.inc.html` and `terms.inc.html`.

## Catalog

Open `catalog.html?lang=en|ko&pages=2|4` and print to PDF (US Letter).
