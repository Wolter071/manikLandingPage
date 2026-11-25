'use strict';
/* ===== НАСТРОЙКИ — замените на свои ===== */
const CONFIG = {
  telegramUsername: 'your_username', // без @, ваш Telegram-аккаунт или бот
  studioName: 'Lumière Nails'
};

/* Меню */
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const closeMenu = () => { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); };
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

/* Тень шапки */
const header = document.querySelector('.header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* Плавное появление блоков */
const items = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  items.forEach(el => io.observe(el));
} else {
  items.forEach(el => el.classList.add('in'));
}

/* Telegram-ссылки */
const tgUrl = (text) => `https://t.me/${CONFIG.telegramUsername}` + (text ? `?text=${encodeURIComponent(text)}` : '');
document.querySelectorAll('a[href^="https://t.me/"]').forEach(a => {
  a.href = tgUrl('Здравствуйте! Хочу записаться на маникюр.');
});

/* Форма */
const form = document.getElementById('form');
const msg = document.getElementById('msg');
const dateInput = form.elements.date;
dateInput.min = new Date().toISOString().split('T')[0];
document.getElementById('year').textContent = new Date().getFullYear();

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const f = form.elements;
  let ok = true;
  const mark = (el, bad) => { el.classList.toggle('invalid', bad); if (bad) ok = false; };

  mark(f.name, f.name.value.trim().length < 2);
  mark(f.phone, f.phone.value.replace(/\D/g, '').length < 10);
  mark(f.service, !f.service.value);
  mark(f.date, !f.date.value);
  if (!f.agree.checked) ok = false;

  if (!ok) {
    msg.style.color = '#c0392b';
    msg.textContent = 'Проверьте поля и поставьте галочку согласия.';
    return;
  }

  const d = new Date(f.date.value).toLocaleDateString('ru-RU');
  const text = `Заявка с сайта ${CONFIG.studioName}\nИмя: ${f.name.value.trim()}\nТелефон: ${f.phone.value.trim()}\nУслуга: ${f.service.value}\nДата: ${d}`;

  /* Открывает Telegram с готовым сообщением. Для автоматической отправки владельцу
     подключите серверную функцию (токен бота храните только на сервере). */
  window.open(tgUrl(text), '_blank', 'noopener');
  msg.style.color = '#2e7d4f';
  msg.textContent = 'Спасибо! Осталось нажать «Отправить» в Telegram — мы подтвердим запись.';
  form.reset();
});
form.addEventListener('input', (e) => e.target.classList.remove('invalid'));
