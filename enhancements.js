const PUNE_REPOSITORY_URL = 'https://github.com/VaibhavNagare-GIS/Pune_Data_Explorer';

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

function syncVideos() {
  const videos = [...document.querySelectorAll('.video-card video')];
  if (videos.length < 2) return;
  const [master, ...followers] = videos;
  master.addEventListener('timeupdate', () => {
    followers.forEach((video) => {
      if (Math.abs(video.currentTime - master.currentTime) > 0.15) {
        video.currentTime = master.currentTime;
      }
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
});

initTabs();
syncVideos();
