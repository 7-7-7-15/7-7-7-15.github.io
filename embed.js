document.addEventListener("DOMContentLoaded", () => {
  const link = new URLSearchParams(window.location.search).get('p');
  if (link) {
    window.location.href = `/explore/web/${__us5$config.encodeUrl(link)}`;
  }
});
