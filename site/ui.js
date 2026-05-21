/* ═══════════════════════════════════════
   ui.js — Interactions panneau Studio 3D
═══════════════════════════════════════ */
(function () {

  /* ── Charger .glb (ÉTAPE 3) ── */
  const glbInput = document.getElementById('glbInput');
  glbInput && glbInput.addEventListener('change', e => {
    const f = e.target.files[0];
    if (f && window.loadGLBFile) window.loadGLBFile(f);
  });

  /* ── Bouton rotation (ÉTAPE 4) ── */
  const btnRot = document.getElementById('btnRotation');
  let rotating = true;
  btnRot && btnRot.addEventListener('click', () => {
    rotating = !rotating;
    if (window.setAutoRotate) window.setAutoRotate(rotating);
    btnRot.textContent = rotating ? '⏸ Arrêter' : '▶ Démarrer';
    btnRot.classList.toggle('active', rotating);
  });

  /* ── Réinitialiser caméra ── */
  const btnReset = document.getElementById('btnReset');
  btnReset && btnReset.addEventListener('click', () => {
    if (window.resetCamera) window.resetCamera();
  });

  /* ── Couleur d'accent ── */
  document.querySelectorAll('.cdot').forEach(dot => {
    dot.addEventListener('click', () => {
      document.querySelectorAll('.cdot').forEach(d => d.classList.remove('selected'));
      dot.classList.add('selected');
      if (window.setAccentColor) window.setAccentColor(dot.dataset.c);
    });
  });

  /* ── Scroll doux sur les ancres ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

})();
