/* ═══════════════════════════════════════
   scene-model.js
   ÉTAPE 2 : Scène de base (TorusKnot démo)
   ÉTAPE 3 : Chargement .glb (GLTFLoader)
   ÉTAPE 4 : Bouton rotation
   ÉTAPE 5 : Zoom molette  ┐ via
   ÉTAPE 6 : OrbitControls ┘ OrbitControls
═══════════════════════════════════════ */
(function () {
  const canvas      = document.getElementById('model-canvas');
  const loadingText = document.getElementById('loadingText');
  if (!canvas) return;

  /* ── ÉTAPE 2 : Scène / Caméra / Rendu ── */
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x181630);

  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / (canvas.clientHeight || 460), 0.1, 1000);
  camera.position.set(0, 1.2, 4);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight || 460);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
  renderer.outputEncoding    = THREE.sRGBEncoding;
  renderer.toneMapping       = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  /* ── Lumières ── */
  scene.add(new THREE.AmbientLight(0xAFA9EC, 0.5));

  const dir = new THREE.DirectionalLight(0xffffff, 1.2);
  dir.position.set(4, 6, 4);
  dir.castShadow = true;
  scene.add(dir);

  const accent = new THREE.PointLight(0x7f77dd, 2.2, 12);
  accent.position.set(-3, 2, 2);
  scene.add(accent);

  const roseL = new THREE.PointLight(0xd4537e, 1.8, 9);
  roseL.position.set(3, -1, 1);
  scene.add(roseL);

  /* ── Objet de démo (ÉTAPE 2) ── */
  const demoGeo = new THREE.TorusKnotGeometry(0.85, 0.28, 128, 16);
  const demoMat = new THREE.MeshStandardMaterial({
    color: 0x7f77dd, roughness: 0.25, metalness: 0.65,
    emissive: 0x3c3489, emissiveIntensity: 0.25,
  });
  const demo = new THREE.Mesh(demoGeo, demoMat);
  demo.castShadow = true;
  scene.add(demo);

  /* Sol grille */
  scene.add(new THREE.GridHelper(10, 20, 0x3c3489, 0x1e1c38));

  /* ── ÉTAPE 6 : OrbitControls (contient aussi le zoom molette = ÉTAPE 5) ── */
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping  = true;
  controls.dampingFactor  = 0.06;
  controls.minDistance    = 1.5;
  controls.maxDistance    = 22;
  controls.maxPolarAngle  = Math.PI * 0.85;
  controls.autoRotate     = true;
  controls.autoRotateSpeed = 1.4;
  controls.target.set(0, 0, 0);
  controls.update();

  /* ── ÉTAPE 3 : GLTFLoader ── */
  let loadedModel = null;
  const loader = new THREE.GLTFLoader();

  window.loadGLBFile = function (file) {
    const url = URL.createObjectURL(file);
    if (loadingText) loadingText.textContent = 'Chargement…';

    loader.load(url,
      function (gltf) {
        if (loadedModel) scene.remove(loadedModel);
        demo.visible = false;
        loadedModel  = gltf.scene;

        /* Centrer + normaliser */
        const box    = new THREE.Box3().setFromObject(loadedModel);
        const center = box.getCenter(new THREE.Vector3());
        const size   = box.getSize(new THREE.Vector3());
        const scale  = 2.5 / Math.max(size.x, size.y, size.z);
        loadedModel.scale.setScalar(scale);
        loadedModel.position.sub(center.multiplyScalar(scale));
        loadedModel.castShadow = loadedModel.receiveShadow = true;

        scene.add(loadedModel);
        controls.target.set(0, 0, 0);
        controls.update();
        URL.revokeObjectURL(url);
        if (loadingText) loadingText.textContent = 'Modèle chargé ✓';
      },
      xhr => {
        if (loadingText && xhr.total)
          loadingText.textContent = 'Chargement… ' + Math.round(xhr.loaded / xhr.total * 100) + '%';
      },
      err => {
        console.error('GLTFLoader :', err);
        if (loadingText) loadingText.textContent = '❌ Erreur de chargement';
      }
    );
  };

  /* ── ÉTAPE 4 : Contrôle rotation ── */
  window.setAutoRotate = function (on) {
    controls.autoRotate = on;
  };

  window.resetCamera = function () {
    camera.position.set(0, 1.2, 4);
    controls.target.set(0, 0, 0);
    controls.update();
  };

  /* Couleur accent */
  window.setAccentColor = function (hex) {
    const c = new THREE.Color(hex);
    accent.color = c;
    demoMat.color.set(c);
    demoMat.emissive.set(c);
    demoMat.needsUpdate = true;
  };

  /* ── Boucle d'animation ── */
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.01;
    if (!loadedModel && demo.visible) {
      demo.rotation.x = Math.sin(t * .38) * .12;
    }
    accent.intensity = 2.0 + Math.sin(t * .7) * .5;
    roseL.intensity  = 1.6 + Math.cos(t * .55) * .4;
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  /* Redimensionnement */
  new ResizeObserver(() => {
    const w = canvas.clientWidth, h = canvas.clientHeight || 460;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }).observe(canvas.parentElement);
})();
