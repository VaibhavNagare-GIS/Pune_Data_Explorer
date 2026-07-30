const PUNE_REPOSITORY_URL = 'https://github.com/VaibhavNagare-GIS/Pune_Data_Explorer';

function enhancePuneNavigation() {
  const links = [...document.querySelectorAll('.section-nav a')];
  const targets = links.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const observer = new IntersectionObserver((entries) => {
    entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio).slice(0, 1).forEach((entry) => {
      links.forEach((link) => link.toggleAttribute('aria-current', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-20% 0px -65% 0px', threshold: [0.1, 0.5] });
  targets.forEach((target) => observer.observe(target));
}

function initTabs() {
  document.querySelectorAll('.tab-row').forEach((row) => {
    const buttons = [...row.querySelectorAll('.tab-button')];
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        buttons.forEach((other) => {
          const active = other === button;
          other.setAttribute('aria-selected', String(active));
          const panel = document.getElementById(other.getAttribute('aria-controls'));
          if (panel) panel.hidden = !active;
        });
        window.dispatchEvent(new Event('resize'));
      });
    });
  });
}

window.addEventListener('load', () => {
  const repositoryLink = document.querySelector('#repository-link');
  if (repositoryLink) {
    repositoryLink.href = PUNE_REPOSITORY_URL;
    document.querySelector('#repository-slot').hidden = false;
    document.querySelector('.repo-placeholder').hidden = true;
  }
  document.querySelectorAll('video[autoplay]').forEach((video) => video.play().catch(() => {}));
  enhancePuneNavigation();
});

initTabs();
