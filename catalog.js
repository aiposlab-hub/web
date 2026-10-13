(() => {
  const { $, $$, tableOrder, kds, runKds, floor, pay, report, orders } = window.Carte;
  const q = new URLSearchParams(location.search);
  const lang = q.get('lang') === 'ko' ? 'ko' : 'en';
  const pages = q.get('pages') === '4' ? 4 : 2;
  document.documentElement.lang = lang;
  document.body.classList.add(lang);

  const T = {
    en: {
      tag: 'Restaurant POS · Canada & US',
      h1: ['Manage less.', 'Serve more.'],
      lede: 'Guests order from the table. The kitchen sees it the same second. The floor knows who is waiting, and the bill closes straight into tonight’s report. One system, one vendor.',
      steps: [['Guests order', 'Guests order and call staff from the tablet.'], ['Kitchen gets the ticket', 'Tickets appear on the kitchen display at once.'], ['Servers see every table', 'Every table shows its status and time.'], ['The bill is paid', 'Card, cash or points. Split any way.'], ['The report is ready', 'Sales and best sellers, no spreadsheet.']],
      oneH: 'One order, every screen.',
      oneP: 'POS, table ordering and kitchen display are one system. Send an order once and every screen updates.',
      caps: [['Kitchen Display', 'Dine-in, online and delivery tickets on one board.'], ['Floor', 'See which tables are occupied and for how long.'], ['Payment', 'Full amount, or split by item, amount or payer.']],
      featH: 'Everything else, in one back office.',
      feat: [['Kitchen routing', 'Send each dish to the right display or printer.'], ['Menu control', 'Mark a dish sold out and it leaves every tablet.'], ['Staff', 'Weekly schedules, time clock, roles and permissions.'], ['Tip pooling', 'Set each role’s share once. Carte splits the pool daily.'], ['Membership', 'Points, tiers, rewards and gift cards.'], ['Online ordering', 'Your own ordering site from the same menu.'], ['Insights', 'What to feature, your peak hours, what to double-check.'], ['Delivery apps', 'Uber Eats, DoorDash, SkipTheDishes and Fantuan orders in the same POS.']],
      info: [['Languages', 'English, Korean, Chinese and Spanish. More on the way.'], ['Card payments', 'Moneris in Canada. In the US, call us and we will match a processor to your restaurant.'], ['Hardware', 'Carte is Android-based. Tell us how you serve and we will recommend a setup.']],
      ctaH: 'See Carte with your own menu.',
      ctaP: 'Tell us how you serve. We’ll call with a quote.',
      hours: '10 a.m.–5 p.m. PT · English and Korean',
      toolsH: 'Five tools. One platform.',
      toolsP: 'Most restaurants run a POS, a card terminal, an online ordering site, delivery tablets and a spreadsheet. Carte puts orders, payments and reports in one flow, with one team to call.',
      tools: ['POS terminal', 'Card terminal', 'Online ordering', 'Delivery tablets', 'Reports & spreadsheets'],
      soon: ['In development', 'Uber Eats, DoorDash, SkipTheDishes, Fantuan and other delivery apps, sending orders straight into the same POS and kitchen display.'],
      ordCap: ['Orders on the POS', 'Dine-in, pickup and delivery orders in one list, each marked with its source.'],
      flowH: 'Follow one order through Carte.',
      kitH: 'Every order, every channel, one board.',
      kitP: 'Table tablet, counter, online order or delivery app: every order lands on the same kitchen display and the same POS, tagged with where it came from. Nothing to sync, no second vendor to call.',
      insH: ['Most POS systems show what happened.', 'Carte shows what to do next.'],
      ins: [['Menu', 'Sorts dishes into what to feature, reprice or rethink.'], ['Tables', 'Peak hours and a heatmap of your floor.'], ['Money', 'Flags unusual voids and discounts by employee.']],
      howH: 'How switching works',
      how: [['Send us your menu.', 'A spreadsheet or a photo is enough to start.'], ['We set up your devices.', 'Tablets, printers and terminals, before you open.'], ['Train, then go live.', 'We walk your staff through it before the first shift.']],
      demo: 'Product screens shown with demo data.',
      motto: 'Manage less. Serve more.',
    },
    ko: {
      tag: '레스토랑 POS · 캐나다 · 미국',
      h1: ['주문부터 마감까지,', 'Carte 하나로.'],
      lede: '손님이 테이블에서 주문하면 주방 화면에 바로 뜨고, 계산이 끝나면 매출까지 자동으로 정리됩니다. 따로 쓰던 시스템을 하나로 합쳐, 적은 인원으로도 매장이 매끄럽게 돌아갑니다.',
      steps: [['테이블에서 주문', '손님이 태블릿으로 직접 주문하고, 필요하면 직원을 호출합니다.'], ['주방에 즉시 전달', '주문과 동시에 주방 화면에 표시됩니다.'], ['홀 상황 한눈에', '테이블별 이용 현황과 경과 시간을 확인합니다.'], ['간편한 계산', '카드·현금·포인트 결제, 나눠 계산도 가능합니다.'], ['자동 매출 정리', '시간대별 매출과 인기 메뉴가 자동 집계됩니다.']],
      oneH: '주문은 한 번, 모든 화면에 동시에',
      oneP: 'POS·테이블오더·주방 화면이 하나의 시스템이라, 주문을 한 번만 넣으면 모든 화면에 바로 반영됩니다.',
      caps: [['주방 화면(KDS)', '매장·온라인·배달 주문을 한 화면에서 확인'], ['홀 관리', '테이블별 이용 현황과 경과 시간 확인'], ['결제', '전액 결제는 물론 메뉴별·금액별·인원별 분할 결제']],
      featH: '매장 운영에 필요한 기능을 한곳에',
      feat: [['주방 라우팅', '메뉴에 따라 해당 주방 화면·프린터로 자동 전달'], ['메뉴 관리', '품절 처리 시 모든 태블릿에 즉시 반영'], ['직원 관리', '근무 일정, 출퇴근 기록, 역할별 권한 설정'], ['팁 정산', '역할별 비율에 따라 매일 자동 분배'], ['멤버십', '포인트 적립, 등급, 리워드, 기프트카드'], ['온라인 주문', '같은 메뉴로 운영하는 매장 전용 주문 사이트'], ['매출 분석', '인기 메뉴, 피크 시간대, 이상 거래 확인'], ['배달 앱 연동', 'Uber Eats, DoorDash, SkipTheDishes, Fantuan 주문을 POS에서 한 번에']],
      info: [['지원 언어', '영어·한국어·중국어·스페인어 지원, 추가 언어 확대 예정'], ['카드 결제', '캐나다는 Moneris 연동. 미국은 매장 상황에 맞춰 안내해 드립니다.'], ['기기', 'Android 기반. 매장 환경에 맞는 구성을 추천해 드립니다.']],
      ctaH: '우리 매장 메뉴로 직접 확인해 보세요',
      ctaP: '운영 방식을 알려 주시면 맞춤 견적과 함께 연락드리겠습니다.',
      hours: '상담 시간 오전 10시~오후 5시(태평양 시간) · 한국어 상담 가능',
      toolsH: '따로 쓰던 다섯 가지를 하나로',
      toolsP: 'POS, 카드 단말기, 온라인 주문, 배달 태블릿, 매출 정리용 엑셀. 따로 관리하던 것들을 Carte 하나로 합쳤습니다. 문의도 한 곳으로 하시면 됩니다.',
      tools: ['POS 단말기', '카드 단말기', '온라인 주문', '배달 태블릿', '매출 엑셀'],
      soon: ['', ''],
      ordCap: ['POS 주문 목록', '매장·포장·배달 주문을 한 목록에서 확인. 주문 경로도 함께 표시됩니다.'],
      flowH: '주문 한 건은 이렇게 흘러갑니다',
      kitH: '모든 주문을 주방 화면 하나로',
      kitP: '테이블, 카운터, 온라인, 배달 앱 어디서 들어온 주문이든 같은 주방 화면과 POS에 표시됩니다. 주문 경로가 함께 표시되어 헷갈릴 일이 없고, 별도 연동이나 추가 업체도 필요 없습니다.',
      insH: ['매출만 보여 주는 POS가 아니라,', '다음에 할 일을 알려 주는 POS.'],
      ins: [['메뉴', '주력 메뉴, 가격 조정이 필요한 메뉴, 재검토할 메뉴를 구분'], ['테이블', '피크 시간대와 테이블별 매출 현황'], ['거래 관리', '평소와 다른 취소·할인을 직원별로 표시']],
      howH: '도입 절차',
      how: [['메뉴 전달', '엑셀 파일이나 메뉴판 사진만 보내 주세요.'], ['기기 세팅', '태블릿·프린터·단말기를 오픈 전에 설치합니다.'], ['교육 후 오픈', '첫 영업 전에 직원 교육까지 진행합니다.']],
      demo: '화면 속 내용은 예시입니다.',
      motto: 'Manage less. Serve more.',
    },
  }[lang];

  const top = `<header class="top"><span class="lock"><img src="img/logo.svg" alt="Carte"><i>by</i><img class="am" src="img/aipos.svg" alt=""><b>AIPOS LAB</b></span><span class="mono">${T.tag}</span></header>`;
  const foot = `<footer class="foot-line"><span>(778) 907-8907 · info@aiposlab.com · aiposlab.com</span><span>${T.demo}</span></footer>`;
  const tab = (id, cls = '') => `<div class="tablet flat ${cls}"><div class="scr" data-s="${id}"></div></div>`;
  const steps = `<div class="steps5">${T.steps.map(([a, b], i) => `<div><i>${i + 1}</i><h3>${a}</h3><p>${b}</p></div>`).join('')}</div>`;
  const trio = `<div class="trio">${['kds', 'floor', 'pay'].map((s, i) => `<div>${tab(s)}<h3>${T.caps[i][0]}</h3><p>${T.caps[i][1]}</p></div>`).join('')}</div>`;
  const feat = (cls = '') => `<div class="feat ${cls}">${T.feat.map(([a, b]) => `<div><h3>${a}</h3><p>${b}</p></div>`).join('')}</div>`;
  const soon = '';
  const info = `<div class="info">${T.info.map(([a, b]) => `<div><span class="mono">${a}</span><p>${b}</p></div>`).join('')}</div>`;
  const cta = `<div class="cta"><div><h2>${T.ctaH}</h2><p>${T.ctaP}</p></div><address>(778) 907-8907<br>info@aiposlab.com<small>${T.hours}</small><small>Carte by AIPOS LAB Inc. · Burnaby, BC</small></address></div>`;
  const tools = `<div class="tools5">${T.tools.map(t => `<span>${t}</span>`).join('')}<b>→</b><strong>CARTE</strong></div>`;

  const P = pages === 2 ? [
    `<section class="pg">${top}
      <h1>${T.h1[0]}<em>${T.h1[1]}</em></h1><p class="lede">${T.lede}</p>
      <div class="grow"></div>${tab('menu')}${steps}${foot}</section>`,
    `<section class="pg soft">${top}
      <h2>${T.oneH}</h2><p class="lede">${T.oneP}</p>${trio}
      <h2 class="sec">${T.featH}</h2>${feat()}${soon}
      <div class="grow"></div>${info}${cta}
      <footer class="foot-line"><span>${T.motto}</span><span>${T.demo}</span></footer></section>`,
  ] : [
    `<section class="pg cover">${top}
      <div><h1>${T.h1[0]}<em>${T.h1[1]}</em></h1><p class="lede">${T.lede}</p></div>
      ${tab('menu')}
      <footer class="foot-line"><span>${T.motto}</span><span>aiposlab.com</span></footer></section>`,
    `<section class="pg soft">${top}
      <h2>${T.toolsH}</h2><p class="lede">${T.toolsP}</p>${tools}
      <h2 class="sec">${T.flowH}</h2>${steps}
      <div class="grow"></div>${tab('cart')}${foot}</section>`,
    `<section class="pg">${top}
      <h2>${T.kitH}</h2><p class="lede">${T.kitP}</p>
      <div style="margin-top:.22in">${tab('kds')}</div>
      <div class="duo"><div>${tab('orders')}<h3 style="margin-top:10px">${T.ordCap[0]}</h3><p style="margin:3px 0 0;color:var(--ink2);font-size:11.5px">${T.ordCap[1]}</p></div>
      <div>${tab('pay')}<h3 style="margin-top:10px">${T.caps[2][0]}</h3><p style="margin:3px 0 0;color:var(--ink2);font-size:11.5px">${T.caps[2][1]}</p></div></div>
      <div class="grow"></div>${foot}</section>`,
    `<section class="pg night">${top}
      <h2>${T.insH[0]}<br><span class="blue">${T.insH[1]}</span></h2>
      <div class="ins3">${T.ins.map(([a, b]) => `<div><h3>${a}</h3><p>${b}</p></div>`).join('')}</div>
      <h2 class="sec" style="font-size:24px">${T.featH}</h2>
      <div class="feat" style="--x:0">${T.feat.map(([a, b]) => `<div style="border-color:rgba(255,255,255,.25)"><h3>${a}</h3><p style="color:#b4bfcc">${b}</p></div>`).join('')}</div>${soon}
      <div class="info" style="background:#151c24">${T.info.map(([a, b]) => `<div><span class="mono">${a}</span><p style="color:#dfe6ee">${b}</p></div>`).join('')}</div>
      <h2 class="sec" style="font-size:24px">${T.howH}</h2>
      <div class="how3">${T.how.map(([a, b]) => `<div><h3>${a}</h3><p style="color:#b4bfcc">${b}</p></div>`).join('')}</div>
      <div class="grow"></div>${cta}
      <footer class="foot-line"><span>${T.motto}</span><span style="color:#9fb0c3">${T.demo}</span></footer></section>`,
  ];
  $('#book').innerHTML = P.join('');

  $$('[data-s]').forEach(el => {
    const s = el.dataset.s;
    if (s === 'menu') tableOrder(el);
    if (s === 'cart') tableOrder(el).fill(['bibimbap', 'chicken', 'sushi']);
    if (s === 'kds') runKds(kds(el), el);
    if (s === 'floor') floor(el);
    if (s === 'orders') orders(el);
    if (s === 'pay') pay(el);
    if (s === 'report') { report(el); $('.rp', el).classList.add('in'); }
  });

  // Korean edition: translate the text inside the product screens too.
  if (lang === 'ko') {
    const D = {
      'Stone Pot Bibimbap': '돌솥비빔밥', 'Korean Fried Chicken': '양념치킨', 'Sushi Platter': '모둠초밥', 'Tonkotsu Ramen': '돈코츠 라멘', 'Pan-Fried Gyoza': '군만두', 'Grilled Short Rib': 'LA갈비', 'Tteokbokki': '떡볶이', 'Salmon Sashimi': '연어회', 'Kimchi Stew': '김치찌개', 'Japchae': '잡채',
      'Seasoned vegetables, beef and a fried egg over rice': '나물과 소고기, 달걀프라이를 올린 돌솥밥', 'Double-fried wings in sweet and spicy glaze': '두 번 튀겨 매콤달콤한 양념을 입힌 치킨', 'Chef’s selection of nigiri and rolls': '셰프가 고른 초밥과 롤', 'Rich pork broth, chashu and soft egg': '진한 돼지 육수에 차슈와 반숙란', 'Six pork and chive dumplings': '돼지고기 부추 만두 6개', 'Marinated beef short rib for the table grill': '테이블에서 굽는 양념 갈비',
      'MENU': '메뉴', 'Lang': '언어', 'EN': '한국어', 'Light': '라이트', 'Order History': '주문 내역', 'Current Order': '현재 주문', 'New Menu': '신메뉴', 'From the grill': '그릴 메뉴', 'Short rib, marinated in house': '매장에서 직접 재운 갈비', 'All': '전체', 'Shared': '사이드', 'Grill': '구이', 'Noodles': '면', 'Sushi': '초밥', 'Rice': '밥', 'Soup': '국·찌개', 'Popular ': '인기 메뉴 ', '6 items': '6개', 'Call': '호출', 'Subtotal': '소계', 'Tax': '세금', 'Total': '합계', 'Place Order': '주문하기',
      'Kitchen Display System': '주방 디스플레이', 'Live': '실시간', 'New Orders': '신규', 'Prep': '준비', 'Cooking': '조리 중', 'Ready': '완료', 'Completed': '서빙 완료', 'New → Prep': '신규 → 준비', 'Prep → Cooking': '준비 → 조리', 'Cooking → Ready': '조리 → 완료', 'Ready → SERVED': '완료 → 서빙', 'Hides soon': '곧 숨김', 'Online · Pickup': '온라인 · 포장',
      'Register · For Here': '주문 · 매장', 'Main': '홀', 'Bar': '바', 'Patio': '테라스', 'OCCUPIED': '사용 중', 'AVAILABLE': '빈 테이블',
      'Payment · Table 07': '결제 · 테이블 07', 'Pay for this order': '결제 금액', 'Remaining': '남은 금액', 'Pay full amount': '전액 결제', 'Split custom amount': '금액 나눠 결제', 'Split by items': '메뉴별 결제', 'Split by payer': '인원별 결제', 'Due': '미결제', 'Card': '카드', 'Cash': '현금', 'Points': '포인트',
      'Orders': '주문 목록', 'Today': '오늘', 'Status · All': '상태 · 전체', 'Order type · All': '주문 유형 · 전체', 'Source · All': '주문 경로 · 전체', 'Placed': '주문 시각', 'Source': '경로', 'Type': '유형', 'Items': '메뉴', 'Status': '상태', 'Delivery': '배달', 'For Here': '매장', 'Pickup': '포장', 'Online': '온라인', 'OPEN': '진행 중', 'PAID': '결제 완료',
      'Short Rib, Japchae': 'LA갈비, 잡채', 'Fried Chicken, Ramen, Gyoza': '양념치킨, 라멘, 군만두', 'Bibimbap, Kimchi Stew': '돌솥비빔밥, 김치찌개', 'Tteokbokki, Gyoza': '떡볶이, 군만두', 'Salmon Sashimi, Sushi Platter': '연어회, 모둠초밥',
    };
    const R = [[/^Table (\d+)$/, '테이블 $1'], [/^(\d+)m elapsed$/, '$1분 경과'], [/^(\d+)m$/, '$1분'], [/^Guest (\d)$/, '손님 $1'], [/^Paid · (.+)$/, '결제 완료 · $1'], [/^(\d+:\d+) p\.m\.$/, '오후 $1']];
    const walk = document.createTreeWalker($('#book'), NodeFilter.SHOW_TEXT);
    for (let n; (n = walk.nextNode());) {
      if (!n.parentElement.closest('.ui')) continue;
      const raw = n.nodeValue, t = raw.trim();
      if (!t) continue;
      let out = D[t] ?? D[raw];
      if (out === undefined) for (const [re, to] of R) if (re.test(t)) { out = t.replace(re, to); break; }
      if (out !== undefined) n.nodeValue = out;
    }
  }
  document.title = `Carte catalog (${pages} pages, ${lang.toUpperCase()})`;
})();
