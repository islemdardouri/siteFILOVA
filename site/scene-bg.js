/* ═══════════════════════════════════════
   scene-bg.js  —  ÉTAPE 1
   Fond Three.js : particules + lignes de
   connexion flottantes (thème Filova)
═══════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 200);
  camera.position.z = 45;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  /* ── Particules ── */
  const N = 200;
  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);

  const palette = [
    new THREE.Color('#7F77DD'),
    new THREE.Color('#AFA9EC'),
    new THREE.Color('#D4537E'),
    new THREE.Color('#534AB7'),
    new THREE.Color('#C9A84C'),
  ];

  for (let i = 0; i < N; i++) {
    pos[i*3]   = (Math.random() - .5) * 110;
    pos[i*3+1] = (Math.random() - .5) * 70;
    pos[i*3+2] = (Math.random() - .5) * 70;
    const c = palette[i % palette.length];
    col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  pGeo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
  const pMat = new THREE.PointsMaterial({ size: .45, vertexColors: true, transparent: true, opacity: .85, sizeAttenuation: true });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  /* ── Lignes de connexion ── */
  const pairs = [];
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N && pairs.length < 160; j++) {
      const dx = pos[i*3]-pos[j*3], dy = pos[i*3+1]-pos[j*3+1], dz = pos[i*3+2]-pos[j*3+2];
      if (dx*dx + dy*dy + dz*dz < 110) pairs.push(i, j);
    }
  }
  const lPos = new Float32Array(pairs.length * 3);
  for (let k = 0; k < pairs.length; k++) {
    const idx = pairs[k];
    lPos[k*3] = pos[idx*3]; lPos[k*3+1] = pos[idx*3+1]; lPos[k*3+2] = pos[idx*3+2];
  }
  const lGeo = new THREE.BufferGeometry();
  lGeo.setAttribute('position', new THREE.BufferAttribute(lPos, 3));
  const lMat = new THREE.LineBasicMaterial({ color: 0x7f77dd, transparent: true, opacity: .1 });
  const lines = new THREE.LineSegments(lGeo, lMat);
  scene.add(lines);

  /* ── Animation ── */
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += .003;
    particles.rotation.y = t * .07;
    particles.rotation.x = Math.sin(t * .04) * .08;
    lines.rotation.y = particles.rotation.y;
    lines.rotation.x = particles.rotation.x;
    pMat.opacity = .6 + Math.sin(t) * .15;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
})();
