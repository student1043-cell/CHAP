(() => {
  const popup = document.getElementById('popup');
  const popupCard = document.querySelector('.popup-card');
  const closeX = document.getElementById('closeX');
  const popupBody = document.getElementById('popupBody');
  const popupFooter = document.getElementById('popupFooter');
  const openBtn = document.getElementById('openBtn');
  const roleInput = document.getElementById('roleInput');
  const viewReceipt = document.getElementById('viewReceipt');
  const receiptEl = document.getElementById('receipt');
  const receiptText = document.getElementById('receiptText');
  const receiptMeta = document.getElementById('receiptMeta');

  const ATT_KEY = 'chap_attempts_v2';
  const REDEEM_KEY = 'chap_redeem_v2';

  let attempts = parseInt(localStorage.getItem(ATT_KEY) || '0', 10) || 0;

  const redeemed = JSON.parse(localStorage.getItem(REDEEM_KEY) || 'null');
  if (redeemed) {
    showReceipt(redeemed);
    viewReceipt.style.display = 'inline-block';
  }

  const teasers = [
    "Ой-ой, хрестик сховався за піною чаю — спробуй ще!",
    "Ти майже... але хрестик не любить поспіху.",
    "Може він зайнятий розмовою з чайним листком?",
    "Ні-ні, не так просто! Спробуй ще раз.",
    "Хрестик сьогодні грає в хованки.",
    "Ще трішки терпіння... і трохи натискань!",
    "Аромат чаю заважає хрестику стояти на місці.",
    "Виглядає, що хрестик хоче уваги — дай йому ще клік!",
    "Хрестик: «Не сьогодні, друже» — спробуй ще.",
    "Ще кілька кліків — і може він втомиться.",
    "Виглядає, що хрестик танцює від радості.",
    "Спробуй ще раз, хрестик любить повтори.",
    "Хрестик каже: «Я просто подорожую по екрану»",
    "Можеш вважати це тренуванням — ще разок!"
  ];

  function place(x, y){
    const pw = popupCard.offsetWidth;
    const ph = popupCard.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const left = Math.max(8, Math.min(x, vw - pw - 8));
    const top = Math.max(8, Math.min(y, vh - ph - 8));
    popupCard.style.left = left + 'px';
    popupCard.style.top = top + 'px';
  }

  function randomPlace(){
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pw = popupCard.offsetWidth;
    const ph = popupCard.offsetHeight;
    const x = Math.floor(Math.random() * (vw - pw - 20)) + 10;
    const y = Math.floor(Math.random() * (vh - ph - 20)) + 10;
    place(x, y);
  }

  function setTease(n){
    popupBody.textContent = teasers[Math.min(n, teasers.length-1)];
  }

  setTease(attempts > 0 ? Math.min(attempts-1, teasers.length-1) : 0);

  openBtn.addEventListener('click', () => {
    const role = roleInput.value.trim();
    const roleWarning = document.getElementById('roleWarning');

    if (!role) {
      roleWarning.style.display = 'block';
      return;
    } else {
      roleWarning.style.display = 'none';
    }

    const redeemed = JSON.parse(localStorage.getItem(REDEEM_KEY) || 'null');
    if (redeemed) {
      showReceipt(redeemed);
      return;
    }

    popup.style.display = 'block';
    popupCard.style.left = '50%';
    popupCard.style.top = '12%';
    popupCard.style.transform = 'translateX(-50%)';
  });

  closeX.addEventListener('click', (e) => {
    e.preventDefault();

    const redeemed = JSON.parse(localStorage.getItem(REDEEM_KEY) || 'null');
    if (redeemed) {
      popup.style.display = 'none';
      return;
    }

    attempts++;
    localStorage.setItem(ATT_KEY, String(attempts));

    if (attempts >= 20) {
      popup.style.display = 'none';
      revealGiftButton();
    } else {
      randomPlace();
      setTease(attempts-1);
      popupCard.animate(
        [{ transform: 'translateX(-50%) translateY(-6px)' }, { transform: 'translateX(-50%) translateY(0)' }],
        { duration: 220 }
      );
      popup.style.display = 'block';
    }
  });

  function revealGiftButton(){
    popupFooter.innerHTML = '';
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = 'Натисни аби отримати сертифікат!';
    btn.addEventListener('click', redeemGift);
    popupFooter.appendChild(btn);
  }

  function redeemGift(){
    const role = (roleInput.value || 'Невідома роль').trim();
    const now = new Date();
    const iso = now.toISOString();
    const label = now.toLocaleString(undefined, {hour12:false});
    const data = { role, iso, label, attempts };
    localStorage.setItem(REDEEM_KEY, JSON.stringify(data));
    showReceipt(data);
    viewReceipt.style.display = 'inline-block';
    popup.style.display = 'none';
  }

  function showReceipt(data){
    const text = `Вітаю тебе, дорогий учаснику нашої спільноти ЧАП.\n\nНезалежно від того чи ти новенький серед нас, чи ти у нас в нашій великій родині від самого початку — дякую тобі, що залишаєшся із нами та робиш внески в нашу дружню рольову. Цей рік минув швидко... Були і польоти, і падіння, щасливі та сумні події — але все це є нашою історією, яку ми пишемо і до нині.\n\nСаме тому наша адміністрація вирішила зробити тобі маленький подарунок — чарівна чашечка чаю, яка може дати можливість пропустити один дедлайн по постам. Її зможеш використати у будь-який момент! Просто збережи цей лист щастя, аби потім скористатися ;)\n\n— З найщирішими побажаннями, ваша адміністрація.`;
    receiptText.textContent = text;
    receiptMeta.innerHTML = `<strong>Роль:</strong> ${escapeHtml(data.role)} <br><strong>Час отримання:</strong> ${escapeHtml(String(data.label))} <br><strong>Спроб закрити хрестиком:</strong> ${escapeHtml(String(data.attempts || attempts))}`;
    receiptEl.style.display = 'block';
    receiptEl.scrollIntoView({behavior:'smooth', block:'center'});
  }

  viewReceipt.addEventListener('click', () => {
    const redeemed = JSON.parse(localStorage.getItem(REDEEM_KEY) || 'null');
    if (redeemed) showReceipt(redeemed);
    else alert('Подарунок ще не отримано — відкрий віконце і спробуй!');
  });

  // simple HTML escape
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

  // Service Worker registration (offline support)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.warn('SW failed', err));і
  }
})();
