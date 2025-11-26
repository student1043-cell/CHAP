(() => {
  const popup = document.getElementById('popup');
  const popupCard = document.querySelector('.popup-card');
  const popupBody = document.getElementById('popupBody');
  const popupFooter = document.getElementById('popupFooter');
  const openBtn = document.getElementById('openBtn');
  const roleInput = document.getElementById('roleInput');
  const viewReceipt = document.getElementById('viewReceipt');
  const receiptEl = document.getElementById('receipt');
  const receiptText = document.getElementById('receiptText');
  const receiptMeta = document.getElementById('receiptMeta');
  const adminBtn = document.getElementById('adminBtn');

  const REDEEM_KEY = 'chap_redeem_v2';

  const teasers = ["Подарунок готовий, натисни кнопку нижче!"];

  // if redeemed, load data
  const redeemed = JSON.parse(localStorage.getItem(REDEEM_KEY) || 'null');
  if (redeemed) {
    showReceipt(redeemed);
    viewReceipt.style.display = 'inline-block';
  }

  openBtn.addEventListener('click', () => {
    const redeemed = JSON.parse(localStorage.getItem(REDEEM_KEY) || 'null');
    if (redeemed) {
      showReceipt(redeemed);
      return;
    }
    popup.style.display = 'block';
    popupCard.style.left = '50%';
    popupCard.style.top = '20%';
    popupCard.style.transform = 'translateX(-50%)';
    revealGiftButton();
  });

  function revealGiftButton(){
    popupFooter.innerHTML = '';
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = 'Натисни аби отримати подарунок!';
    btn.addEventListener('click', redeemGift);
    popupFooter.appendChild(btn);
  }

  function redeemGift(){
    const role = (roleInput.value || 'Невідома роль').trim();
    const now = new Date();
    const label = now.toLocaleString(undefined, {hour12:false});
    const data = { role, label };
    localStorage.setItem(REDEEM_KEY, JSON.stringify(data));
    showReceipt(data);
    viewReceipt.style.display = 'inline-block';
    popup.style.display = 'none';
  }

  function showReceipt(data){
    const text = `Вітаю тебе, дорогий учаснику нашої спільноти ЧАП.\n\nНезалежно від того чи ти новенький серед нас, чи ти у нас в нашій великій родині від самого початку — дякую тобі, що залишаєшся із нами та робиш внески в нашу дружню рольову. Цей рік минув швидко... Були і польоти, і падіння, щасливі та сумні події — але все це є нашою історією, яку ми пишемо і до нині.\n\nСаме тому ваша адміністрація вирішила зробити вам маленький подарунок — чарівна чашечка чаю, яка може дати можливість пропустити один дедлайн по постам. Її можна використати у будь-який момент! Просто збережіть цей лист щастя, аби потім скористатися ;)\n\n— З найщирішими побажаннями, ваша адміністрація.`;
    receiptText.textContent = text;
    receiptMeta.innerHTML = `<strong>Роль:</strong> ${escapeHtml(data.role)} <br><strong>Час отримання:</strong> ${escapeHtml(data.label)}`;
    receiptEl.style.display = 'block';
    receiptEl.scrollIntoView({behavior:'smooth', block:'center'});
  }

  viewReceipt.addEventListener('click', () => {
    const redeemed = JSON.parse(localStorage.getItem(REDEEM_KEY) || 'null');
    if (redeemed) showReceipt(redeemed);
    else alert('Подарунок ще не отримано — відкрий віконце і натисни кнопку!');
  });

  adminBtn.addEventListener('click', () => {
    const pass = prompt('Введіть пароль адміністратора:');
    if(pass === 'ДенискаВПопіСосиска'){
      const data = JSON.parse(localStorage.getItem(REDEEM_KEY) || '[]');
      alert('Отримали сертифікат: ' + JSON.stringify(data));
    } else {
      alert('Невірний пароль');
    }
  });

  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
})();
