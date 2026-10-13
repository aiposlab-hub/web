#!/usr/bin/env python3
"""Split site.src.html into one page per nav item. Edit site.src.html, then run: python3 build.py"""
import re, pathlib, time
VER = str(int(time.time()))
root = pathlib.Path(__file__).parent
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
    for f in ('style.css', 'screens.js', 'app.js'):
        html = html.replace('"%s"' % f, '"%s?v=%s"' % (f, VER))
    (root / name).write_text(html, encoding='utf8')
    print(name, len(html))
