(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches || !!window.CARTE_STATIC;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const money = n => '$' + n.toFixed(2);

  /* ---------- menu data (demo) ---------- */
  const MENU = [
    { id: 'bibimbap', name: 'Stone Pot Bibimbap', cat: 'Rice', price: 18, desc: 'Seasoned vegetables, beef and a fried egg over rice' },
    { id: 'chicken', name: 'Korean Fried Chicken', cat: 'Shared', price: 24, desc: 'Double-fried wings in sweet and spicy glaze' },
    { id: 'sushi', name: 'Sushi Platter', cat: 'Sushi', price: 32, desc: 'Chef’s selection of nigiri and rolls' },
    { id: 'ramen', name: 'Tonkotsu Ramen', cat: 'Noodles', price: 17, desc: 'Rich pork broth, chashu and soft egg' },
    { id: 'gyoza', name: 'Pan-Fried Gyoza', cat: 'Shared', price: 11, desc: 'Six pork and chive dumplings' },
    { id: 'bbq', name: 'Grilled Short Rib', cat: 'Grill', price: 36, desc: 'Marinated beef short rib for the table grill' },
    { id: 'tteokbokki', name: 'Tteokbokki', cat: 'Shared', price: 14, desc: 'Rice cakes in gochujang sauce' },
    { id: 'sashimi', name: 'Salmon Sashimi', cat: 'Sushi', price: 22, desc: 'Eight thick-cut slices' },
    { id: 'stew', name: 'Kimchi Stew', cat: 'Soup', price: 16, desc: 'Aged kimchi, tofu and pork' },
    { id: 'japchae', name: 'Japchae', cat: 'Noodles', price: 15, desc: 'Stir-fried glass noodles and vegetables' },
  ];
  const byId = Object.fromEntries(MENU.map(m => [m.id, m]));
  const img = id => `img/food/${id}.jpg`;
  const ICON = {
    grid: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 0h7v7h-7z"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 4 3 14 0 18M12 3c-3 4-3 14 0 18"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>',
    bell: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm7-6v-5a7 7 0 0 0-5-6.700V3.500a2 2 0 1 0-4 0v.800A7 7 0 0 0 5 11v5l-2 2v1h18v-1z"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" d="M12 6v12M6 12h12"/></svg>',
  };
  const LOGO = '<svg viewBox="0 0 30 24" class="lg"><rect x="1.5" y="1.5" width="27" height="17" rx="3" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M6 19l4 4 5-5" fill="none" stroke="#0a5cff" stroke-width="2.6"/><rect x="19" y="6" width="3" height="3" fill="#0a5cff"/><rect x="22.5" y="9.5" width="3" height="3" fill="#0a5cff"/></svg>';

  /* ---------- Table Order screen ---------- */
  function tableOrder(host, { theme = 'light', table = 'Table 07', items = MENU.slice(0, 6) } = {}) {
    host.innerHTML = `
    <div class="ui to ${theme}">
      <aside class="to-side">${LOGO}
        <div class="sb on">${ICON.grid}<span>MENU</span></div>
        <div class="sb">${ICON.globe}<span>Lang</span><em>EN</em></div>
        <div class="sb">${ICON.sun}<span>${theme === 'dark' ? 'Dark' : 'Light'}</span></div>
      </aside>
      <div class="to-main">
        <header class="to-top"><b>${table}</b><span class="pill">Order History</span><span class="pill cartbtn">Current Order<i class="badge"></i></span></header>
        <div class="to-banner" style="background-image:linear-gradient(90deg,rgba(0,0,0,.72),rgba(0,0,0,.05) 70%),url(${img('bbq')})"><span>New Menu</span><b>From the grill</b><small>Short rib, marinated in house</small></div>
        <div class="to-chips"><span class="on">All</span><span>Shared</span><span>Grill</span><span>Noodles</span><span>Sushi</span><span>Rice</span><span>Soup</span></div>
        <div class="to-label">Popular <small>${items.length} items</small></div>
        <div class="to-grid">${items.map(m => `
          <div class="card" data-id="${m.id}"><div class="ph" style="background-image:url(${img(m.id)})"></div>
            <div class="row"><b>${m.name}</b><i class="add">${ICON.plus}</i></div><p>${m.desc}</p><em>${money(m.price)}</em></div>`).join('')}
        </div>
        <div class="to-call">${ICON.bell}<span>Call</span></div>
      </div>
      <div class="to-scrim"></div>
      <aside class="to-cart"><header><b>Current Order</b><i class="count">0</i><span class="x">×</span></header>
        <div class="lines"></div>
        <footer><div><span>Subtotal</span><span class="c-sub">$0.00</span></div><div><span>Tax</span><span class="tax">$0.00</span></div>
          <div class="tot"><span>Total</span><span class="total">$0.00</span></div><button class="place" tabindex="-1">Place Order</button></footer>
      </aside>
      <div class="to-dialog"><b>Order Successful</b><p>Your order has been placed. Please wait.</p><span>OK</span></div>
    </div>`;
    const ui = $('.ui', host), lines = $('.lines', host);
    let cart = [];
    const paint = () => {
      const sub = cart.reduce((s, m) => s + m.price, 0);
      $('.count', host).textContent = cart.length;
      $('.badge', host).textContent = cart.length || '';
      $('.c-sub', host).textContent = money(sub);
      $('.tax', host).textContent = money(sub * 0.05);
      $('.total', host).textContent = money(sub * 1.05);
    };
    const api = {
      add(id) {
        const m = byId[id], card = $(`.card[data-id="${id}"]`, host);
        cart.push(m);
        if (card) { card.classList.add('tap'); setTimeout(() => card.classList.remove('tap'), 500); }
        ui.classList.add('open');
        const row = document.createElement('div');
        row.className = 'ln';
        row.innerHTML = `<div class="th" style="background-image:url(${img(id)})"></div><div><b>${m.name}</b><small>${m.cat}</small><em>${money(m.price)}</em></div><div class="qty"><i>−</i>1<i class="g">+</i></div>`;
        lines.appendChild(row);
        paint();
      },
      async place() {
        $('.place', host).classList.add('press');
        await wait(450);
        $('.place', host).classList.remove('press');
        ui.classList.remove('open'); ui.classList.add('done');
      },
      reset() { cart = []; lines.innerHTML = ''; paint(); ui.classList.remove('open', 'done'); },
      fill(ids) { ids.forEach(id => api.add(id)); },
    };
    paint();
    return api;
  }

  /* ---------- Kitchen Display screen ---------- */
  const STAGES = [
    { k: 'new', name: 'New Orders', btn: 'New → Prep' },
    { k: 'prep', name: 'Prep', btn: 'Prep → Cooking' },
    { k: 'cook', name: 'Cooking', btn: 'Cooking → Ready' },
    { k: 'ready', name: 'Ready', btn: 'Ready → SERVED' },
    { k: 'done', name: 'Completed', btn: 'Hides soon' },
  ];
  function kds(host) {
    host.innerHTML = `
    <div class="ui kd">
      <header class="kd-top"><b>Kitchen Display System</b><span class="live"><i></i>Live</span><time></time>${LOGO}<strong>CARTE</strong></header>
      <div class="kd-cols">${STAGES.map(s => `<section class="col ${s.k}"><h4>${s.name}<span>0</span></h4><div class="stack"></div></section>`).join('')}</div>
    </div>`;
    const cols = $$('.col', host), clock = $('time', host);
    const tick = () => clock.textContent = new Date().toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit' });
    tick(); setInterval(tick, 20000);
    let seq = 1040;
    const count = () => cols.forEach(c => $('h4 span', c).textContent = $$('.tk', c).length);
    const flip = (el, mutate) => {
      const a = el.getBoundingClientRect();
      mutate();
      const b = el.getBoundingClientRect();
      if (calm || !a.width) return;
      el.animate([{ transform: `translate(${a.left - b.left}px,${a.top - b.top}px) scale(1.03)`, zIndex: 5 }, { transform: 'none', zIndex: 5 }],
        { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)' });
    };
    const api = {
      add(table, ids, stage = 0, age = 0) {
        const el = document.createElement('article');
        el.dataset.stage = stage; el.dataset.age = age;
        el.innerHTML = `<h5>#${++seq}</h5><div class="meta"><span class="${/^Table/.test(table) ? '' : /Online/.test(table) ? 'ch on' : 'ch'}">${table}</span><em><i></i><u>${age}m</u></em></div>
          <ul>${ids.map(id => `<li>${byId[id].name}<i></i></li>`).join('')}</ul><button tabindex="-1"></button>`;
        api.paint(el);
        $('.stack', cols[stage]).prepend(el);
        if (!calm) el.animate([{ opacity: 0, transform: 'translateY(-1.5em) scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 500, easing: 'cubic-bezier(.2,.8,.2,1)' });
        count();
        return el;
      },
      paint(el) { const s = STAGES[+el.dataset.stage]; el.className = 'tk ' + s.k; $('button', el).textContent = s.btn; },
      advance(el) {
        const next = +el.dataset.stage + 1;
        if (next >= STAGES.length) {
          const done = () => { el.remove(); count(); };
          calm ? done() : el.animate([{ opacity: 1 }, { opacity: 0, transform: 'scale(.94)' }], { duration: 400 }).finished.then(done);
          return;
        }
        $('button', el).classList.add('press');
        setTimeout(() => flip(el, () => { el.dataset.stage = next; api.paint(el); $('.stack', cols[next]).prepend(el); count(); }), calm ? 0 : 260);
      },
      tickets: () => $$('.tk', host),
      age() { $$('.tk', host).forEach(t => { t.dataset.age = +t.dataset.age + 1; $('u', t).textContent = t.dataset.age + 'm'; }); },
    };
    return api;
  }
  const SEED = [
    ['Table 03', ['ramen', 'gyoza'], 0, 1], ['SkipTheDishes', ['bbq', 'stew', 'japchae'], 0, 2],
    ['Online · Pickup', ['chicken', 'tteokbokki'], 1, 4], ['Table 09', ['sushi', 'sashimi'], 2, 6],
    ['Uber Eats', ['bbq', 'bibimbap', 'gyoza'], 3, 9],
  ];
  const POOL = [['ramen', 'gyoza'], ['bbq', 'japchae'], ['sushi'], ['chicken', 'tteokbokki', 'stew'], ['bibimbap', 'sashimi'], ['stew', 'gyoza']];
  const SRC = ['Table 05', 'DoorDash', 'Table 11', 'Online · Pickup', 'Fantuan', 'Table 02', 'SkipTheDishes', 'Table 08', 'Uber Eats'];
  function runKds(k, host) {
    SEED.forEach(s => k.add(...s));
    if (calm) return;
    let n = 0, on = false;
    new IntersectionObserver(e => on = e[0].isIntersecting, { threshold: 0.2 }).observe(host);
    setInterval(() => {
      if (!on || document.hidden) return;
      n++;
      // the ticket furthest along moves first, so the board drains left to right
      const ts = k.tickets().sort((a, b) => (+b.dataset.stage - +a.dataset.stage) || (+b.dataset.age - +a.dataset.age));
      const pick = ts[n % 2 ? 0 : Math.min(ts.length - 1, 1 + (n % 3))];
      if (pick) k.advance(pick);
      if (n % 3 === 1 && ts.length < 7) k.add(SRC[Math.floor(n / 3) % SRC.length], POOL[n % POOL.length]);
      if (n % 5 === 0) k.age();
    }, 1700);
  }

  /* ---------- POS floor screen ---------- */
  function floor(host) {
    const T = [[1, 34], [2, 12], [3, 0], [4, 51], [5, 8], [6, 0], [7, 0], [8, 27], [9, 0], [10, 43], [11, 19], [12, 0]];
    host.innerHTML = `
    <div class="ui ps">
      <header class="ps-top"><span>←</span><b>Register · For Here</b>${LOGO}<strong>CARTE</strong></header>
      <div class="ps-body"><div class="ps-tabs"><span class="on">Main</span><span>Bar</span><span>Patio</span></div>
      <div class="ps-grid">${T.map(([n, m]) => `<div class="tb ${m ? 'occ' : ''}" data-n="${n}"><b>Table ${String(n).padStart(2, '0')}</b><span>${m ? 'OCCUPIED' : 'AVAILABLE'}</span><small>${m ? m + 'm elapsed' : '&nbsp;'}</small></div>`).join('')}</div></div>
    </div>`;
    return {
      seat(n) {
        const t = $(`.tb[data-n="${n}"]`, host);
        t.classList.add('occ', 'pop');
        $('span', t).textContent = 'OCCUPIED'; $('small', t).textContent = 'Just ordered';
        setTimeout(() => t.classList.remove('pop'), 900);
      },
      clear(n) {
        const t = $(`.tb[data-n="${n}"]`, host);
        t.classList.remove('occ'); $('span', t).textContent = 'AVAILABLE'; $('small', t).innerHTML = '&nbsp;';
      },
    };
  }

  /* ---------- POS pay screen ---------- */
  function pay(host) {
    const P = [['Guest 1', 'Visa'], ['Guest 2', 'Debit'], ['Guest 3', 'Cash'], ['Guest 4', 'Visa']];
    host.innerHTML = `
    <div class="ui ps">
      <header class="ps-top"><span>←</span><b>Payment · Table 07</b>${LOGO}<strong>CARTE</strong></header>
      <div class="py"><aside><h6>Pay for this order</h6><p><span>Subtotal</span><span>$104.00</span></p><p><span>GST (5%)</span><span>$5.20</span></p><p class="t"><span>Total</span><span>$109.20</span></p><p class="r"><span>Remaining</span><span class="rem">$109.20</span></p></aside>
      <div class="py-main"><div class="py-tabs"><span>Pay full amount</span><span>Split custom amount</span><span>Split by items</span><span class="on">Split by payer</span></div>
        <div class="py-rows">${P.map(([g, m]) => `<div class="pr"><b>${g}</b><span>$27.30</span><em data-m="${m}">Due</em></div>`).join('')}</div>
        <div class="py-methods"><span>Card</span><span>Cash</span><span>Points</span></div></div></div>
    </div>`;
    const rows = $$('.pr', host), rem = $('.rem', host);
    let i = 0;
    const step = () => {
      if (i === rows.length) { rows.forEach(r => { r.classList.remove('paid'); $('em', r).textContent = 'Due'; }); i = 0; rem.textContent = '$109.20'; return; }
      const r = rows[i++]; r.classList.add('paid'); $('em', r).textContent = 'Paid · ' + $('em', r).dataset.m;
      rem.textContent = money(Math.max(0, 109.20 - 27.30 * i));
    };
    if (calm) { step(); step(); return; }
    let on = false;
    new IntersectionObserver(e => on = e[0].isIntersecting).observe(host);
    setInterval(() => on && step(), 1400);
  }

  /* ---------- POS report screen ---------- */
  function report(host) {
    const H = [18, 26, 54, 72, 38, 22, 30, 64, 96, 88, 60, 34];
    const top = [['Stone Pot Bibimbap', 86], ['Grilled Short Rib', 74], ['Korean Fried Chicken', 61], ['Tonkotsu Ramen', 55], ['Sushi Platter', 40]];
    host.innerHTML = `
    <div class="ui ps">
      <header class="ps-top"><span>←</span><b>Reporting</b>${LOGO}<strong>CARTE</strong></header>
      <div class="rp"><nav><span class="on">Sales Overview</span><span>Employees</span><span>Item Sales</span><span>Discounts</span><span>Taxes</span><span>Hourly Sales</span></nav>
        <div class="rp-main"><h6>Sales by hour <small>Demo data</small></h6>
          <div class="bars">${H.map((h, i) => `<i style="--h:${h}%;--d:${i * 50}ms"><u>${(10 + i) % 12 + 1}</u></i>`).join('')}</div>
          <h6>Best sellers</h6><div class="tops">${top.map(([n, v], i) => `<p style="--w:${v}%;--d:${i * 90}ms"><span>${n}</span><b></b></p>`).join('')}</div></div></div>
    </div>`;
  }


  /* ---------- POS register (order entry) screen ---------- */
  function register(host) {
    const cats = ['Shared', 'Grill', 'Noodles', 'Sushi', 'Rice', 'Soup', 'Drinks'];
    host.innerHTML = `
    <div class="ui ps rg">
      <header class="ps-top"><span>←</span><b>Register · Main · Table 04</b>${LOGO}<strong>CARTE</strong></header>
      <div class="rg-body">
        <aside class="rg-order"><div class="rg-types"><span class="on">For Here</span><span>To Go</span><span>Guests 4</span></div>
          <div class="rg-lines"></div>
          <div class="rg-tot"><p><span>Subtotal</span><span class="r-sub">$0.00</span></p><p><span>Tax</span><span class="r-tax">$0.00</span></p><p class="t"><span>Total</span><span class="r-total">$0.00</span></p></div>
          <div class="rg-btns"><span class="b-order">Order</span><span class="b-pay">Pay</span><span>More</span></div></aside>
        <div class="rg-right"><div class="rg-bar"><span>←</span><b>Select Category &amp; Item</b><em>Search item</em></div><div class="rg-pick"><nav class="rg-cats">${cats.map((c, i) => `<span class="${i ? '' : 'on'}">${c}</span>`).join('')}</nav>
        <div class="rg-items">${MENU.slice(0, 9).map(m => `<div data-id="${m.id}"><b>${m.name}</b><em>${money(m.price)}</em></div>`).join('')}</div></div></div>
      </div>
    </div>`;
    const lines = $('.rg-lines', host), ui = $('.ui', host);
    let cart = [];
    const paint = () => { const sub = cart.reduce((a, m) => a + m.price, 0); $('.r-sub', host).textContent = money(sub); $('.r-tax', host).textContent = money(sub * .05); $('.r-total', host).textContent = money(sub * 1.05); };
    const add = id => { const m = byId[id], t = $(`.rg-items [data-id="${id}"]`, host); cart.push(m); if (t) { t.classList.add('tap'); setTimeout(() => t.classList.remove('tap'), 450); }
      const r = document.createElement('p'); r.innerHTML = `<b>${m.name}</b><i>− 1 +</i><em>${money(m.price)}</em><u>New</u>`; lines.appendChild(r); paint(); };
    const reset = () => { cart = []; lines.innerHTML = ''; ui.classList.remove('sent'); paint(); };
    const send = () => { ui.classList.add('sent'); $$('u', lines).forEach(u => u.textContent = 'Ordered'); };
    paint();
    if (calm) { ['bbq', 'chicken', 'ramen', 'gyoza'].forEach(add); send(); return; }
    let on = false; new IntersectionObserver(e => on = e[0].isIntersecting).observe(host);
    const sets = [['bbq', 'chicken', 'ramen', 'gyoza'], ['sushi', 'sashimi', 'stew'], ['bibimbap', 'tteokbokki', 'gyoza', 'ramen']];
    (async () => { for (let k = 0; ; k++) { reset(); await wait(900); for (const id of sets[k % sets.length]) { while (!on) await wait(400); add(id); await wait(750); } await wait(600); $('.b-order', host).classList.add('press'); await wait(350); $('.b-order', host).classList.remove('press'); send(); await wait(2600); } })();
  }

  /* ---------- POS home screen ---------- */
  const PI = {
    Transactions: '<path d="M7 4h18v24l-3-2-3 2-3-2-3 2-3-2-3 2z" fill="#9aa1ab"/><rect x="10" y="7" width="12" height="2" fill="#0a5cff"/><rect x="10" y="11" width="12" height="1.6" fill="#fff"/><path d="M10 16h1.6v7H10zm3 0h1v7h-1zm2.4 0H17v7h-1.600zm3 0h1v7h-1zm2 0H22v7h-1.600z" fill="#22262c"/>',
    Register: '<rect x="11" y="3" width="10" height="3" rx="1" fill="#22262c"/><rect x="14.5" y="6" width="3" height="3" fill="#22262c"/><path d="M8 9h16l2 12H6z" fill="#22262c"/><rect x="11" y="11" width="10" height="3" fill="#7dd3fc"/><path d="M11 16h2v2h-2zm3 0h2v2h-2zm3 0h2v2h-2zm3 0h1v2h-1z" fill="#9aa1ab"/><rect x="4" y="21" width="24" height="7" rx="1.500" fill="#0a5cff"/><circle cx="16" cy="24.500" r="1.200" fill="#22262c"/>',
    Orders: '<rect x="6" y="5" width="20" height="24" rx="2" fill="#f59e0b"/><rect x="8.500" y="8" width="15" height="19" fill="#fff"/><rect x="12" y="3" width="8" height="5" rx="1.500" fill="#22262c"/><path d="M11 13l1.200 1.200 2-2.400" stroke="#ef4444" stroke-width="1.400" fill="none"/><path d="M16 13h6M16 17.500h6M16 22h6M11 17.500h2M11 22h2" stroke="#6b7280" stroke-width="1.500"/>',
    Refund: '<circle cx="18" cy="13" r="8" fill="#f59e0b"/><path d="M18 8.500v9M20.500 10.800c-2-1.600-5-.800-4.600 1 .400 1.800 4.400.800 4.700 2.800.200 1.700-3 2.300-5 .700" stroke="#fff" stroke-width="1.500" fill="none"/><path d="M8 9a11 11 0 0 1 18-3" stroke="#ef4444" stroke-width="1.800" fill="none"/><path d="M26 2.500V7h-4.500" stroke="#ef4444" stroke-width="1.800" fill="none"/><path d="M5 22l7-3 9 2 6-2v4l-8 5H9z" fill="#fcd9b0"/><rect x="2" y="21" width="5" height="8" rx="1" transform="rotate(-25 4.500 25)" fill="#0a5cff"/>',
    Tips: '<rect x="6" y="6" width="15" height="20" rx="3" fill="#bfe3f7"/><rect x="8" y="3" width="11" height="4" rx="1" fill="#0a5cff"/><path d="M9 13h9M9 17h7" stroke="#f59e0b" stroke-width="2"/><circle cx="23" cy="22" r="6.500" fill="#f59e0b"/><path d="M23 18v8M25 20c-1.500-1.200-4-.600-3.700.900.300 1.400 3.500.600 3.700 2.200.200 1.400-2.400 1.800-4 .600" stroke="#fff" stroke-width="1.300" fill="none"/>',
    'Cash Log': '<path d="M11 3v7M8.500 6L11 3l2.500 3" stroke="#0f2547" stroke-width="1.800" fill="none"/><path d="M20 10V3M17.500 7L20 10l2.500-3" stroke="#0a5cff" stroke-width="1.800" fill="none"/><rect x="3" y="13" width="26" height="15" rx="2" fill="#22a35a"/><rect x="6" y="16" width="20" height="9" rx="1" fill="#bdf0d0"/><circle cx="16" cy="20.500" r="4" fill="#22a35a"/><path d="M16 18v5" stroke="#fff" stroke-width="1.300"/>',
    'Gift Card': '<rect x="3" y="11" width="26" height="15" rx="2" fill="#0a5cff"/><rect x="3" y="17" width="26" height="3" fill="#f59e0b"/><rect x="14" y="11" width="4" height="15" fill="#f59e0b"/><path d="M16 11c-2-5-7-5-6-2s4 2 6 2zm0 0c2-5 7-5 6-2s-4 2-6 2z" fill="#f59e0b"/>',
    Shift: '<circle cx="15" cy="18" r="10" fill="#0a5cff"/><circle cx="15" cy="18" r="7.500" fill="#e0f2fe"/><path d="M15 13v5.500l3.500 2" stroke="#0f2547" stroke-width="1.800" fill="none"/><circle cx="25" cy="8" r="5" fill="#f59e0b"/><path d="M22.800 8l1.600 1.600 2.800-3" stroke="#fff" stroke-width="1.400" fill="none"/>',
    Schedule: '<rect x="5" y="6" width="22" height="22" rx="3" fill="#bfe3f7"/><rect x="5" y="6" width="22" height="7" rx="3" fill="#0a5cff"/><rect x="10" y="3" width="2.500" height="6" rx="1" fill="#f59e0b"/><rect x="19.500" y="3" width="2.500" height="6" rx="1" fill="#f59e0b"/><text x="16" y="24.500" text-anchor="middle" font-size="9.500" font-weight="800" fill="#0f2547" font-family="Arial">11</text>',
    Calculator: '<rect x="6" y="3" width="20" height="26" rx="2" fill="#0a5cff"/><rect x="9" y="6" width="14" height="5" fill="#bfe3f7"/><path d="M9 14h3v3H9zm5 0h3v3h-3zm5 0h4v3h-4zM9 19h3v3H9zm5 0h3v3h-3zM9 24h3v3H9zm5 0h3v3h-3z" fill="#0f2547"/><rect x="19" y="19" width="4" height="8" fill="#f59e0b"/>',
    Employees: '<path d="M9 3l7 5 7-5" stroke="#23b89a" stroke-width="1.800" fill="none"/><rect x="8" y="8" width="16" height="21" rx="2" fill="#0a5cff"/><circle cx="16" cy="15" r="3.500" fill="#e0f2fe"/><path d="M10.500 23c1-4 10-4 11 0z" fill="#e0f2fe"/><rect x="11" y="24.500" width="10" height="2.500" fill="#fff"/>',
    Customers: '<circle cx="9" cy="10" r="3.500" fill="#38bdf8"/><path d="M3 24c0-8 12-8 12 0z" fill="#38bdf8"/><circle cx="23" cy="10" r="3.500" fill="#23b89a"/><path d="M17 24c0-8 12-8 12 0z" fill="#23b89a"/><circle cx="16" cy="14" r="4" fill="#0a5cff"/><path d="M9 29c0-10 14-10 14 0z" fill="#0a5cff"/>',
    Printers: '<rect x="9" y="3" width="14" height="9" fill="#c9ced6"/><path d="M11 6h10M11 9h7" stroke="#6b7280" stroke-width="1.300"/><rect x="4" y="11" width="24" height="12" rx="2" fill="#22262c"/><rect x="4" y="15" width="24" height="2.500" fill="#ef4444"/><rect x="8" y="21" width="16" height="7" fill="#e5e7eb"/>',
    Terminals: '<rect x="16" y="3" width="12" height="7" rx="1" transform="rotate(-12 22 6.500)" fill="#f59e0b"/><rect x="6" y="8" width="16" height="21" rx="2.500" fill="#0f2547"/><rect x="8.500" y="11" width="11" height="5" fill="#7dd3fc"/><path d="M9 19h2.500v2H9zm4 0h2.500v2H13zm4 0h2.500v2H17zM9 23h2.500v2H9zm4 0h2.500v2H13zm4 0h2.500v2H17z" fill="#38bdf8"/>',
    Reporting: '<rect x="4" y="4" width="24" height="24" rx="2" fill="#0f2547"/><rect x="4" y="4" width="24" height="5" rx="2" fill="#22262c"/><circle cx="7" cy="6.500" r="1" fill="#f59e0b"/><circle cx="10" cy="6.500" r="1" fill="#f59e0b"/><circle cx="12" cy="19" r="5" fill="#0a5cff"/><path d="M12 19v-5a5 5 0 0 1 5 5z" fill="#7dd3fc"/><path d="M20 24v-6M23 24V13M26 24v-9" stroke="#f59e0b" stroke-width="2"/>',
    Setup: '<path d="M16 3l2.500 3 3.800-1 1 3.800 3.700 1.200-1 3.800 2.500 3-2.500 3 1 3.800-3.700 1.200-1 3.800-3.800-1-2.500 3-2.500-3-3.800 1-1-3.800L5 23.600l1-3.800-2.500-3 2.500-3-1-3.800L8.700 8.800l1-3.800 3.800 1z" fill="#38bdf8" transform="translate(0 -1.500)"/><circle cx="16" cy="15.500" r="6" fill="#0a5cff"/><path d="M13.200 15.500l2 2 3.600-4" stroke="#fff" stroke-width="1.800" fill="none"/>',
  };
  function posHome(host) {
    const big = ['Transactions', 'Register', 'Orders', 'Refund'];
    const small = ['Tips', 'Cash Log', 'Gift Card', 'Shift', 'Schedule', 'Calculator', 'Employees', 'Customers', 'Printers', 'Terminals', 'Reporting', 'Setup'];
    const tile = n => `<div><svg viewBox="0 0 32 32">${PI[n].replace(/(\d)00\b/g, '$1')}</svg><b>${n}</b></div>`;
    host.innerHTML = `
    <div class="ui ps hm">
      <div class="hm-main"><div class="hm-big">${big.map(tile).join('')}</div><div class="hm-small">${small.map(tile).join('')}</div></div>
      <aside class="hm-side"><div class="hm-logo">${LOGO}<strong>CARTE</strong></div><span class="help">Help</span>
        <div class="box"><b>Your Restaurant</b><p><span>Station</span><span>Logged in</span></p><p class="v"><span>Front counter</span><span>Owner</span></p></div>
        <div class="dev"><span>This Device</span><em>MAIN</em><b>POS 1</b></div>
        <div class="lock">Owner<svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2"/></svg></div></aside>
    </div>`;
  }

  /* ---------- POS: extra screens for the POS page ---------- */
  const seen = host => { const o = { on: false }; new IntersectionObserver(e => o.on = e[0].isIntersecting).observe(host); return o; };
  const keys = (extra = ['00', '0', '⌫']) => `<div class="kp">${[1, 2, 3, 4, 5, 6, 7, 8, 9, ...extra].map(k => `<span data-k="${k}">${k}</span>`).join('')}</div>`;
  const press = (host, k) => { const el = $(`.kp [data-k="${k}"]`, host); if (el) { el.classList.add('hit'); setTimeout(() => el.classList.remove('hit'), 220); } };

  function passcode(host) {
    host.innerHTML = `<div class="ui ps pc"><div class="pc-l">${keys(['', '0', '⌫'])}</div>
      <div class="pc-r">${LOGO}<strong>CARTE</strong><p class="msg">Enter your passcode</p><div class="dots">${'<i></i>'.repeat(6)}</div><p class="who">&nbsp;</p></div></div>`;
    const dots = $$('.dots i', host), msg = $('.msg', host), who = $('.who', host);
    if (calm) { dots.slice(0, 4).forEach(d => d.classList.add('on')); return; }
    const v = seen(host);
    (async () => { for (; ;) { dots.forEach(d => d.classList.remove('on')); msg.textContent = 'Enter your passcode'; who.innerHTML = '&nbsp;'; await wait(900);
      for (let i = 0; i < 6; i++) { while (!v.on) await wait(400); press(host, [4, 8, 2, 6, 1, 9][i]); dots[i].classList.add('on'); await wait(380); }
      msg.textContent = 'Welcome back'; who.textContent = 'Server · Shift started 4:02 p.m.'; await wait(2400); } })();
  }

  function cash(host) {
    host.innerHTML = `<div class="ui ps"><header class="ps-top"><span>←</span><b>Cash · Table 04</b>${LOGO}<strong>CARTE</strong></header>
      <div class="cs"><div class="cs-l"><p class="due"><span>Amount due</span><b class="c-due">$92.40</b></p>
        <div class="quick"><span data-q="0">Exact</span><span data-q="1">$95</span><span data-q="2">$100</span><span data-q="3">$120</span></div>${keys()}</div>
        <div class="cs-r"><p><span>Received</span><b class="c-rec">$0.00</b></p><p class="chg"><span>Change due</span><b class="c-chg">$0.00</b></p><em class="done">Done</em></div></div></div>`;
    const set = (rec, due) => { $('.c-rec', host).textContent = money(rec); $('.c-chg', host).textContent = money(Math.max(0, rec - due)); };
    const runs = [[92.40, 2, 100], [47.25, 1, 50], [118.65, 3, 120]];
    if (calm) { set(100, 92.40); $('.cs-r', host).classList.add('ok'); return; }
    const v = seen(host);
    (async () => { for (let r = 0; ; r++) { const [due, q, rec] = runs[r % runs.length]; const qs = $$('.quick span', host);
      $('.c-due', host).textContent = money(due); qs[1].textContent = money(Math.ceil(due / 5) * 5).replace('.00', ''); qs[2].textContent = '$' + rec; qs.forEach(x => x.classList.remove('on'));
      $('.cs-r', host).classList.remove('ok'); set(0, due); $('.c-chg', host).textContent = '$0.00'; await wait(1200); while (!v.on) await wait(400);
      qs[2].classList.add('on'); const t0 = performance.now(); await new Promise(res => { const f = n => { const p = Math.min(1, (n - t0) / 600); set(rec * p, due * p + (1 - p) * rec * p); if (p < 1) requestAnimationFrame(f); else { set(rec, due); res(); } }; requestAnimationFrame(f); });
      $('.cs-r', host).classList.add('ok'); await wait(2800); } })();
  }

  function earn(host) {
    host.innerHTML = `<div class="ui ps"><header class="ps-top"><span>←</span><b>Payment · Table 04</b>${LOGO}<strong>CARTE</strong></header>
      <div class="en"><div class="en-box"><h6>Earn points on this bill?</h6><p class="num">Phone number</p>${keys(['', '0', '⌫'])}<div class="en-btn"><span>Skip</span><span class="go">Earn</span></div>
        <div class="en-ok"><b>+92 points</b><span>Gold member · 1,240 points total</span></div></div></div></div>`;
    const num = $('.num', host), box = $('.en-box', host), digits = '6045550142', fmt = d => d.replace(/^(\d{0,3})(\d{0,3})(\d{0,4}).*/, (m, a, b, c) => [a, b, c].filter(Boolean).join(' '));
    if (calm) { num.textContent = fmt(digits); box.classList.add('ok'); return; }
    const v = seen(host);
    (async () => { for (; ;) { box.classList.remove('ok'); num.textContent = 'Phone number'; num.classList.remove('f'); await wait(1000);
      for (let i = 1; i <= digits.length; i++) { while (!v.on) await wait(400); press(host, digits[i - 1]); num.classList.add('f'); num.textContent = fmt(digits.slice(0, i)); await wait(170); }
      await wait(500); box.classList.add('ok'); await wait(2800); } })();
  }

  function orders(host) {
    const rows = [['7:42 p.m.', 'Uber Eats', 'Delivery', 'Short Rib, Japchae', 53.55, 'OPEN', 'ch'], ['7:40 p.m.', 'Table 04', 'For Here', 'Fried Chicken, Ramen, Gyoza', 54.60, 'OPEN', ''], ['7:36 p.m.', 'Online', 'Pickup', 'Sushi Platter', 33.60, 'PAID', 'on'], ['7:31 p.m.', 'Table 09', 'For Here', 'Bibimbap, Kimchi Stew', 35.70, 'PAID', ''], ['7:28 p.m.', 'SkipTheDishes', 'Delivery', 'Tteokbokki, Gyoza', 26.25, 'PAID', 'ch'], ['7:20 p.m.', 'Table 02', 'For Here', 'Salmon Sashimi, Sushi Platter', 56.70, 'PAID', '']];
    const extra = [['DoorDash', 'Delivery', 'Bibimbap, Fried Chicken', 44.10, 'ch'], ['Table 11', 'For Here', 'Short Rib, Kimchi Stew, Ramen', 72.45, ''], ['Fantuan', 'Delivery', 'Ramen, Gyoza', 29.40, 'ch'], ['Online', 'Pickup', 'Japchae, Tteokbokki', 30.45, 'on']];
    const row = ([t, src, type, items, amt, st, c]) => `<p><span>${t}</span><span><i class="src ${c}">${src}</i></span><span>${type}</span><span class="it">${items}</span><b>${money(amt)}</b><em class="${st.toLowerCase()}">${st}</em></p>`;
    host.innerHTML = `<div class="ui ps"><header class="ps-top"><span>←</span><b>Orders</b>${LOGO}<strong>CARTE</strong></header>
      <div class="ol"><div class="ol-f"><span>Today</span><span>Status · All</span><span>Order type · All</span><span>Source · All</span></div>
        <div class="ol-h"><span>Placed</span><span>Source</span><span>Type</span><span>Items</span><span>Total</span><span>Status</span></div><div class="ol-b">${rows.map(row).join('')}</div></div></div>`;
    if (calm) return;
    const body = $('.ol-b', host), v = seen(host); let n = 0;
    setInterval(() => { if (!v.on || document.hidden) return; n++;
      if (n % 2) { const e = extra[(n >> 1) % extra.length]; body.insertAdjacentHTML('afterbegin', row(['Just now', e[0], e[1], e[2], e[3], 'OPEN', e[4]])); body.firstElementChild.classList.add('new'); if (body.children.length > 7) body.lastElementChild.remove(); }
      else { const o = [...$$('em.open', body)].pop(); if (o) { o.className = 'paid flip'; o.textContent = 'PAID'; } }
    }, 2100);
  }

  function refund(host) {
    host.innerHTML = `<div class="ui ps"><header class="ps-top"><span>←</span><b>Refund</b>${LOGO}<strong>CARTE</strong></header>
      <div class="rf"><div class="rf-l">${keys()}</div><div class="rf-r"><p>Enter refund amount</p><b class="amt">-$0.00</b><label><i></i>Includes tip</label><span class="look">Look Up Past Payment</span>
        <div class="found"><b>Table 09 · 7:31 p.m.</b><span>Paid $35.70 · Visa</span></div></div></div></div>`;
    const amt = $('.amt', host), r = $('.rf-r', host);
    if (calm) { amt.textContent = '-$24.00'; return; }
    const v = seen(host);
    (async () => { for (; ;) { amt.textContent = '-$0.00'; r.classList.remove('ok'); await wait(1100); let c = 0;
      for (const k of ['2', '4', '00']) { while (!v.on) await wait(400); press(host, k); c = c * (k === '00' ? 100 : 10) + +k; amt.textContent = '-' + money(c / 100); await wait(420); }
      await wait(500); $('.look', host).classList.add('hit'); await wait(260); $('.look', host).classList.remove('hit'); r.classList.add('ok'); await wait(2800); } })();
  }
  window.Carte = { $, $$, calm, wait, money, MENU, byId, img, LOGO, tableOrder, kds, runKds, floor, pay, report, register, posHome, passcode, cash, earn, orders, refund };
})();
