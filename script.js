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
  const adminBtn = document.getElementById('adminBtn');
  const adminModal = document.getElementById('adminModal');
  const adminBody = document.getElementById('adminBody');
  const adminClose = document.getElementById('adminClose');

  const teasers = [
    "Ой-ой, хрестик сховався за піною чаю — спробуй ще!",
    "Ти майже... але хрестик не любить поспіху.",
    "Може він зайнятий розмовою з чайним листком?",
    "Ні-ні, не так просто! Спробуй ще раз.",
    "Хрестик сьогодні грає в хованки.",
    "Ще трішки терпіння... і трохи натискань!",
    "Аромат чаю заважає хрестику стояти на місці.",
    "Хрестик втік за м'яким паром.",
    "Виглядає, що хрестик хоче уваги — дай йому ще клік!",
    "Хрестик: «Не сьогодні, друже» — спробуй ще.",
    "Ще кілька кліків — і може він втомиться.",
    "Виглядає, що хрестик танцює від радості.",
    "Спробуй ще раз, хрестик любить повтори.",
    "Хрестик каже: «Я просто подорожую по екрану»",
    "Можеш вважати це тренуванням — ще разок!"
  ];

  const ATT_KEY = 'chap_attempts_v3';
  const REDEEM_KEY = 'chap_redeem_v3';

  let attempts = parseInt(localStorage.getItem(ATT_KEY) || '0', 10) || 0;

  const redeemed = JSON.parse(localStorage.getItem(REDEEM_KEY) || 'null');
  if (redeemed) {
    showReceipt(redeemed);
    viewReceipt.style.display = 'inline-block';
  }

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
    const roleVal = roleInput.value.trim();
    if(!roleVal){
      alert('Живчику, ти забув ввести свою роль!');
      roleInput.focus();
      return;
    }
    if(redeemed){
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
    if(redeemed) {
      popup.style.display='none';
      return;
    }
    attempts++;
    localStorage.setItem(ATT_KEY, String(attempts));
    if(attempts>=20){
      popup.style.display='none';
      revealGiftButton();
    } else {
      randomPlace();
      setTease(attempts-1);
      popupCard.animate([{transform:'translateX(-50%) translateY(-6px)'},{transform:'translateX(-50%) translateY(0)'}],{duration:220});
      popup.style.display='block';
    }
  });

  function revealGiftButton(){
    popupFooter.innerHTML='';
    const btn=document.createElement('button');
    btn.className='btn';
    btn.textContent='Натисни аби отримати подарунок!';
    btn.addEventListener('click', redeemGift);
    popupFooter.appendChild(btn);
  }

  function redeemGift(){
    const role = (roleInput.value || 'Невідома роль').trim();
    const now = new Date();
    const iso = now.toISOString();
    const label = now.toLocaleString(undefined, {hour12:false});
    const data = {role, iso, label, attempts};
    localStorage.setItem(REDEEM_KEY, JSON.stringify(data));

    // Save to list
    const allUsers = JSON.parse(localStorage.getItem('chap_users')||'[]');
    allUsers.push({role,label});
    localStorage.setItem('chap_users', JSON.stringify(allUsers));

    showReceipt(data);
    viewReceipt.style.display='inline-block';
    popup.style.display='none';
  }

  function showReceipt(data){
    const text=`Вітаю тебе, дорогий учаснику нашої спільноти ЧАП.\n\nНезалежно від того чи ти новенький серед нас, чи ти у нас в нашій великій родині від самого початку — дякую тобі, що залишаєшся із нами та робиш внески в нашу дружню рольову. Цей рік минув швидко... Були і польоти, і падіння, щасливі та сумні події — але все це є нашою історією, яку ми пишемо і до нині.\n\nСаме тому наша адміністрація вирішила зробити тобі маленький подарунок — чарівна чашечка чаю, яка може тобі дати можливість пропустити один дедлайн по постам. Її зможеш використати у будь-який момент! Просто збережи цей лист щастя, аби потім скористатися ;)\n\n— З найщирішими побажаннями, ваша адміністрація.`;
    receiptText.textContent=text;
    receiptMeta.innerHTML=`<strong>Роль:</strong> ${escapeHtml(data.role)} <br><strong>Час отримання:</strong> ${escapeHtml(data.label)} <br><strong>Спроб закрити хрестиком:</strong> ${escapeHtml(String(data.attempts||attempts))}`;
    receiptEl.style.display='block';
    receiptEl.scrollIntoView({behavior:'smooth', block:'center'});
  }

  viewReceipt.addEventListener('click', () => {
    const redeemed = JSON.parse(localStorage.getItem(REDEEM_KEY)||'null');
    if(redeemed) showReceipt(redeemed);
    else alert('Подарунок ще не отримано — відкрий віконце і спробуй!');
  });

  adminBtn.addEventListener('click', ()=>{
    const password = prompt('Введіть пароль адміністратора:');
    if(password!=='ДєніскаВПопіСосиска69') return alert('Невірний пароль!');
    const allUsers = JSON.parse(localStorage.getItem('chap_users')||'[]');
    if(allUsers.length===0) adminBody.innerHTML='Ще ніхто не отримав сертифікатів';
    else adminBody.innerHTML='<ol>'+allUsers.map(u=>`<li>${escapeHtml(u.role)} — ${escapeHtml(u.label)}</li>`).join('')+'</ol>';
    adminModal.style.display='block';
  });

  adminClose.addEventListener('click',()=>adminModal.style.display='none');

  if(attempts>=20 && !localStorage.getItem(REDEEM_KEY)) revealGiftButton();

  window.addEventListener('load', ()=>{
    if(!localStorage.getItem(REDEEM_KEY)){
      popup.style.display='block';
      popupCard.style.left='50%';
      popupCard.style.top='12%';
      popupCard.style.transform='translateX(-50%)';
    }
  });

  document.addEventListener('keydown', e=>{
    if(e.key==='Escape'){
      if(localStorage.getItem(REDEEM_KEY)||attempts>=20) popup.style.display='none';
    }
  });

  function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').catch(err=>console.warn('SW failed',err));
  }
})();
