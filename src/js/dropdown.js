document.body.addEventListener('click', (e) => {
  const target = e.target;
  if (!target.closest('.dropdown')) {
    document.querySelector('.dropdown__list').classList.add('hidden');
  }
});

document.querySelector('.dropdown__btn').addEventListener('click', () => {
  document.querySelector('.dropdown__list').classList.toggle('hidden');
});

document.querySelectorAll('.dropdown__listItem').forEach((item) => {
  item.addEventListener('click', () => {
    document.querySelector('.dropdown__btn').textContent = item.textContent;
    document.querySelector('.dropdown__list').classList.add('hidden');
  });
});
