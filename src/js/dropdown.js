const themeList = [
  'default-theme',
  'dracula-theme',
  'solarized-theme',
  'pcalc-theme',
];

const savedTheme = localStorage.getItem('selectedTheme');

if (savedTheme) {
  document.documentElement.classList.remove(...themeList);
  document.documentElement.classList.add(themeToClassName(savedTheme));
  document.querySelector('.dropdown__btn__text').textContent = savedTheme;
}

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
  item.addEventListener('click', (e) => {
    const item = e.currentTarget;
    const themeName = item.dataset.value;
    localStorage.setItem('selectedTheme', themeName);
    document.querySelector('.dropdown__btn__text').textContent = themeName;
    document.querySelector('.dropdown__list').classList.add('hidden');
    document.documentElement.classList.remove(...themeList);
    document.documentElement.classList.add(themeToClassName(themeName));
  });
});

function themeToClassName(theme) {
  return theme.toLowerCase() + '-theme';
}
