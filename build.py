#!/usr/bin/env python3
"""Split site.src.html into one page per nav item. Edit site.src.html, then run: python3 build.py"""
import re, json, pathlib, time
VER = str(int(time.time()))
root = pathlib.Path(__file__).parent
# Contact details live here only. Change them, run this script, and every page, the form and the catalog follow.
# (privacy.inc.html / terms.inc.html are legal text and keep their own wording.)
CONTACT = {'PHONE': '(778) 907-8907', 'TEL': '+17789078907', 'SALES': 'sales@aiposlab.com', 'SUPPORT': 'support@aiposlab.com'}
(root / 'contact.js').write_text('window.CARTE_CONTACT = %s;\n' % json.dumps({k.lower(): v for k, v in CONTACT.items()}), encoding='utf8')
src = (root / 'site.src.html').read_text(encoding='utf8')
head, rest = src.split('<main id="top">', 1)
body, tail = rest.split('</main>', 1)
secs = {m.group(1).split()[0]: m.group(0) for m in re.finditer(r'<section class="([^"]+)".*?</section>\n', body, re.S)}
PAGES = [
    ('index.html', 'Carte by AIPOS LAB — One platform for your whole restaurant', ['hero', 'plat', 'tools', 'flow', 'posteaser'], None),
    ('pos.html', 'POS — Carte by AIPOS LAB', ['pos'], 'POS'),
    ('kitchen.html', 'Kitchen Display — Carte by AIPOS LAB', ['kitchen'], 'Kitchen'),
    ('table-order.html', 'Table Order — Carte by AIPOS LAB', ['table'], 'Table Order'),
    ('back-office.html', 'Back office & Insights — Carte by AIPOS LAB', ['office', 'insight'], 'Back office'),
    ('faq.html', 'Switching & FAQ — Carte by AIPOS LAB', ['switch'], 'FAQ'),
    ('privacy.html', 'Privacy Policy — Carte by AIPOS LAB INC.', ['legal:privacy'], None),
    ('terms.html', 'Terms of Service — Carte by AIPOS LAB INC.', ['legal:terms'], None),
]
NAV = [('How it works', 'index.html#flow'), ('POS', 'pos.html'), ('Kitchen', 'kitchen.html'), ('Table Order', 'table-order.html'), ('Back office', 'back-office.html'), ('FAQ', 'faq.html')]
for name, title, keys, active in PAGES:
    cur = ' aria-current="page"'
    nav = '\n'.join('      <a href="%s"%s>%s</a>' % (h, cur if t == active else '', t) for t, h in NAV)
    h = re.sub(r'<nav class="nav-links">.*?</nav>', '<nav class="nav-links">\n' + nav + '\n    </nav>', head, flags=re.S)
    h = re.sub(r'<title>.*?</title>', f'<title>{title}</title>', h)
    h = h.replace('<a class="brand" href="#top"', '<a class="brand" href="index.html"')
    if keys[0].startswith('legal:'):
        inc = (root / (keys[0][6:] + '.inc.html')).read_text(encoding='utf8').replace('<h2>Cookies</h2>', '<h2 id="cookies">Cookies</h2>')
        main = '<section class="legal"><div class="wrap">\n' + inc + '\n</div></section>\n'
    else:
        main = '\n'.join(secs[k] for k in keys) + '\n'
        if 'plat' not in keys:  # sub-pages: the platform map again, with this page's parts lit
            main += secs['plat'].replace('<a href="%s">' % name, '<a class="on" href="%s">' % name).replace('class="plat"', 'class="plat plat-sub"').replace('Every part of your restaurant, <br>on one platform.', 'All of it runs on one platform.') + '\n'
        main += secs['quote'] + '\n'
    html = h + '<main id="top">\n\n' + main + '</main>' + tail
    if keys[0].startswith('legal:'):
        html = html.replace('href="#quote"', 'href="index.html#quote"')
    for k, v in CONTACT.items():
        html = html.replace('{{%s}}' % k, v)
    for f in ('style.css', 'contact.js', 'screens.js', 'app.js'):
        html = html.replace('"%s"' % f, '"%s?v=%s"' % (f, VER))
    (root / name).write_text(html, encoding='utf8')
    print(name, len(html))
