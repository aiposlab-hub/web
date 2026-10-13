(() => {
  const { $, $$, calm, wait, byId, tableOrder, kds, runKds, floor, pay, report, register, posHome, passcode, cash, earn, orders, refund } = window.Carte;
  const on = (sel, fn) => { const el = $(sel); if (el) fn(el); };
  /* ---------- mount ---------- */
  on('#heroTO', () => {
  const heroTO = tableOrder($('#heroTO'));
  const heroK = $('#heroTicket');
  const stageNames = ['New', 'Prep', 'Cooking', 'Ready'], stageCls = ['new', 'prep', 'cook', 'ready'];
  const ticketHTML = (ids, s) => `<header><b>Table 07</b><span class="st ${stageCls[s]}">${stageNames[s]}</span></header><ul>${ids.map(id => `<li>${byId[id].name}</li>`).join('')}</ul><footer>Kitchen display · just now</footer>`;
  async function heroLoop() {
    const picks = [['bibimbap', 'chicken', 'sushi'], ['ramen', 'gyoza'], ['bbq', 'chicken', 'ramen']];
    for (let r = 0; ; r++) {
      const ids = picks[r % picks.length];
      heroTO.reset(); heroK.className = 'ticket';
      await wait(1100);
      for (const id of ids) { heroTO.add(id); await wait(850); }
      await wait(700);
      await heroTO.place();
      heroK.innerHTML = ticketHTML(ids, 0);
      heroK.className = 'ticket in';
      for (let s = 1; s < stageNames.length; s++) {
        await wait(1500);
        const st = $('.st', heroK); st.textContent = stageNames[s]; st.className = 'st ' + stageCls[s];
      }
      await wait(2200);
      heroK.className = 'ticket out';
      await wait(500);
    }
  }
  if (calm) { heroTO.fill(['bibimbap', 'chicken', 'sushi']); heroK.innerHTML = ticketHTML(['bibimbap', 'chicken', 'sushi'], 2); heroK.className = 'ticket in'; }
  else heroLoop();
  });

  on('#fTable', () => {
  tableOrder($('#fTable')).fill(['bibimbap', 'chicken', 'sushi']);
  runKds(kds($('#fKitchen')), $('#fKitchen'));
  const fl = floor($('#fFloor'));
  if (!calm) { let s = 0; const free = [3, 6, 7, 9, 12]; setInterval(() => { const n = free[s++ % free.length]; fl.seat(n); setTimeout(() => fl.clear(n), 4200); }, 2600); }
  pay($('#fPay'));
  report($('#fReport'));
  });
  on('#bigKds', el => runKds(kds(el), el));
  on('#posReg', register);
  on('#homeReg', register);
  on('#posOrders', orders);
  on('#posLogin', passcode);
  on('#posCash', cash);
  on('#posEarn', earn);
  on('#posRefund', refund);
  on('#posHome', posHome);
  on('#posFloor', floor);
  on('#posPay', pay);
  on('#posReport', report);

  /* ---------- page behaviour ---------- */
  const nav = $('#nav');
  addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 8), { passive: true });


  // insights: peak-hour heat grid
  const heat = $('#heat');
  if (heat) { let s = ''; for (let r = 0; r < 7; r++) for (let c = 0; c < 12; c++) { const o = Math.max(.08, Math.min(1, (Math.sin((c - 2) / 2.6) * .5 + .45) * (r > 3 ? 1.25 : .8) + ((r * 7 + c * 3) % 5) * .04)); s += `<i style="--o:${o.toFixed(2)};--d:${(r * 40 + c * 30)}ms"></i>`; } heat.innerHTML = s; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.18 });
  $$('.rv, .merge, .rp, .bx, .ins article, .plat-map').forEach(el => io.observe(el));

  const stage = $('#heroStage'), tab = $('#heroTablet');
  if (stage && !calm && matchMedia('(hover:hover) and (min-width:901px)').matches) {
    stage.addEventListener('pointermove', e => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      tab.style.transform = `rotateY(${-8 + x * 10}deg) rotateX(${4 - y * 8}deg)`;
    });
    stage.addEventListener('pointerleave', () => tab.style.transform = '');
  }

  const steps = $$('.step'), fs = $$('.fs'), rail = $('#railFill'), railLabels = $$('.rail span');
  const setStep = i => {
    steps.forEach((s, k) => s.classList.toggle('on', k === i));
    fs.forEach((s, k) => s.classList.toggle('on', k === i));
    railLabels.forEach((s, k) => s.classList.toggle('on', k <= i));
    if (rail) rail.style.transform = `scaleX(${(i + 1) / steps.length})`;
  };
  const sio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setStep(+e.target.dataset.i); }), { rootMargin: '-45% 0px -45% 0px' });
  steps.forEach(s => sio.observe(s));

  on('#compare', cmp => {
  tableOrder($('#cmpLight'), { theme: 'light' });
  tableOrder($('#cmpDark'), { theme: 'dark' });
  const top = $('#cmpDark'), handle = $('#compareHandle');
  let auto = !calm; const t0 = performance.now();
  const setCmp = p => { top.style.clipPath = `inset(0 0 0 ${p}%)`; handle.style.left = p + '%'; };
  const drag = e => { const r = cmp.getBoundingClientRect(); setCmp(Math.min(100, Math.max(0, (e.clientX - r.left) / r.width * 100))); };
  cmp.addEventListener('pointerdown', e => { auto = false; cmp.setPointerCapture(e.pointerId); drag(e); });
  cmp.addEventListener('pointermove', e => { if (!auto && (e.buttons || e.pointerType === 'touch')) drag(e); });
  const sweep = t => { if (!auto) return; setCmp(50 + Math.sin((t - t0) / 1500) * 34); requestAnimationFrame(sweep); };
  auto ? requestAnimationFrame(sweep) : setCmp(50);
  });


  // membership tiers: click to switch (cycles on its own until touched)
  on('.v-loyal output', tOut => {
  const tiers = $$('.v-loyal button');
  let tAuto = !calm, ti = 1;
  const setTier = i => { ti = i; tiers.forEach((b, k) => { b.classList.toggle('on', k === i); b.setAttribute('aria-pressed', k === i); }); tOut.innerHTML = `<b>${tiers[i].dataset.rate}</b><span>${tiers[i].dataset.perk}</span>`; };
  tiers.forEach((b, k) => b.addEventListener('click', () => { tAuto = false; setTier(k); }));
  setTier(1);
  if (tAuto) setInterval(() => tAuto && !document.hidden && setTier((ti + 1) % tiers.length), 2600);
  });
  on('.merge', merge => merge.addEventListener('click', () => { merge.classList.remove('in'); void merge.offsetWidth; merge.classList.add('in'); }));

  $$('.faq button').forEach(b => b.addEventListener('click', () => b.parentElement.classList.toggle('open')));

  // Quote form: posts to the Google Sheet receiver (forms/quote-form.gs). Until FORM_URL is set it opens an email instead.
  const C = window.CARTE_CONTACT;
  const FORM_URL = '';
  on('#quoteForm', form => {
    const msg = $('.form-msg', form), btn = $('button[type=submit]', form), note = $('.mailto-note', form);
    const say = (text, bad) => { msg.textContent = text; msg.hidden = !text; msg.classList.toggle('bad', !!bad); };
    const mailto = f => { const L = []; for (const [k, v] of f) if (v && k !== 'website') L.push(`${k}: ${v}`); return 'mailto:' + C.sales + '?subject=' + encodeURIComponent('Quote request: ' + (f.get('Restaurant') || '')) + '&body=' + encodeURIComponent(L.join('\n')); };
    if (FORM_URL && note) note.hidden = true;
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const f = new FormData(form);
      if (!String(f.get('Phone') || '').trim() && !String(f.get('Email') || '').trim()) { say('Add a phone number or an email so we can reach you.', true); form.elements.Phone.focus(); return; }
      if (!FORM_URL) { location.href = mailto(f); return; }
      if (f.get('SMS consent')) f.set('SMS consent text', $('.check span', form).textContent.trim());
      f.set('Page', location.href); f.set('Browser', navigator.userAgent);
      btn.disabled = true; say('Sending…');
      try {
        const r = await fetch(FORM_URL, { method: 'POST', body: new URLSearchParams(f) });
        const j = await r.json();
        if (!j.ok) throw new Error(j.error || 'failed');
        form.reset(); form.classList.add('sent');
        say('Thanks. Your request is in, and we will call or email you within one business day.');
      } catch (err) {
        btn.disabled = false;
        msg.innerHTML = 'That did not go through. Please try again, call ' + C.phone + ', or <a href="' + mailto(f) + '">send it by email</a>.';
        msg.hidden = false; msg.classList.add('bad');
      }
    });
  });
})();
