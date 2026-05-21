/* ═══════════════════════════════════════
   bubbles.js
   Déclenche les bulles quand le hero
   entre dans le viewport, puis boucle.
═══════════════════════════════════════ */
(function () {
  const wrap = document.getElementById('bubblesWrap');
  if (!wrap) return;

  function start() {
    wrap.classList.remove('running');
    void wrap.offsetWidth; /* force reflow */
    wrap.classList.add('running');
  }

  /* Démarrage au scroll */
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) start();
  }, { threshold: 0.25 }).observe(wrap);

  /* Boucle toutes les 9 secondes */
  setInterval(start, 9000);
})();
