import * as THREE from 'three';

/**
 * ShrewdHQ — Living 3D Spatial Household Artifact Engine
 * 
 * Instead of a generic building, the 3D canvas renders tangible, high-fidelity
 * artifacts representing the real daily life and wealth of an Indian home:
 * 
 * - Stage 0: The Sovereign Household Hub & Shield (Master Balance Sheet)
 * - Stage 1: The Fee Challan & Smart Toll Tag (School Fees & Highway Tolls)
 * - Stage 2: The UPI Rupee Token & Verified Receipt (Domestic Staff & Utilities)
 * - Stage 3: The Debt Freedom Scale & Prepayment Block (Home Loans & EMIs)
 * - Stage 4: The Celebration Diya & Sovereign Gold Coin (Festive Sinking Funds)
 * - Stage 5: The Sovereign Triad Compounding Rings (EPF 8.25%, PPF 7.10%, CAS Funds)
 * - Stage 6: The Master Protected Enclave (24.2 Months Family Runway)
 */

export class Household3DScene {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container) return;

    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.gyroMouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    this.scrollProgress = 0;
    this.stateMode = 'covered'; // 'struggle' or 'covered'
    this.stageGroups = [];

    this.init();
  }

  init() {
    // 1. Scene & Environment
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xfbfbfd);
    this.scene.fog = new THREE.FogExp2(0xfbfbfd, 0.022);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(36, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 0, 14);

    // 3. Renderer with High-DPI & Soft Shadows
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // 4. Studio Lighting
    this.setupLighting();

    // 5. Build the 7 Narrative Artifact Stages
    this.buildStageArtifacts();

    // 6. Bind User Interaction Events
    this.bindEvents();

    // 7. Start Render Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupLighting() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    this.scene.add(this.ambientLight);

    // Key Light
    this.keyLight = new THREE.DirectionalLight(0xfffaed, 2.5);
    this.keyLight.position.set(8, 12, 10);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 1024;
    this.keyLight.shadow.mapSize.height = 1024;
    this.keyLight.shadow.bias = -0.001;
    this.scene.add(this.keyLight);

    // Fill Light
    this.fillLight = new THREE.DirectionalLight(0xdbeafe, 1.2);
    this.fillLight.position.set(-10, 6, 8);
    this.scene.add(this.fillLight);

    // Rim/Accent Light (Emerald glow)
    this.rimLight = new THREE.PointLight(0x059669, 2.5, 16);
    this.rimLight.position.set(0, -4, 6);
    this.scene.add(this.rimLight);
  }

  buildStageArtifacts() {
    // ── Shared Materials ─────────────────────────────────────────────────────
    const obsidianMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.2,
      metalness: 0.8
    });

    const brushedGoldMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.3,
      metalness: 0.85
    });

    const emeraldGlowMat = new THREE.MeshStandardMaterial({
      color: 0x059669,
      emissive: 0x10b981,
      emissiveIntensity: 0.5,
      roughness: 0.2
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      opacity: 1,
      transparent: true,
      roughness: 0.1,
      ior: 1.52,
      thickness: 0.8
    });

    const paperMat = new THREE.MeshStandardMaterial({
      color: 0xfdfdfd,
      roughness: 0.6,
      metalness: 0.05
    });

    // ── STAGE 0: The Sovereign Household Hub & Shield ───────────────────────
    const stage0 = new THREE.Group();
    stage0.name = 'stage-0-hub';

    // Central Glass Shield
    const shieldShape = new THREE.Shape();
    shieldShape.moveTo(0, 2.8);
    shieldShape.quadraticCurveTo(2.4, 2.4, 2.2, 0.4);
    shieldShape.quadraticCurveTo(2.0, -1.8, 0, -3.0);
    shieldShape.quadraticCurveTo(-2.0, -1.8, -2.2, 0.4);
    shieldShape.quadraticCurveTo(-2.4, 2.4, 0, 2.8);

    const extrudeSettings = { depth: 0.25, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: 0.08, bevelThickness: 0.08 };
    const shieldGeo = new THREE.ExtrudeGeometry(shieldShape, extrudeSettings);
    shieldGeo.center();
    const shieldMesh = new THREE.Mesh(shieldGeo, glassMat);
    stage0.add(shieldMesh);

    // Golden "S" Emblem in Center of Shield
    const emblemGeo = new THREE.TorusGeometry(0.9, 0.12, 16, 48);
    const emblemMesh = new THREE.Mesh(emblemGeo, brushedGoldMat);
    emblemMesh.position.z = 0.2;
    stage0.add(emblemMesh);

    // Orbiting Household Data Rings
    const ringGeo = new THREE.RingGeometry(3.6, 3.65, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
    const orbitRing1 = new THREE.Mesh(ringGeo, ringMat);
    orbitRing1.rotation.x = Math.PI / 3;
    stage0.add(orbitRing1);
    this.stage0OrbitRing = orbitRing1;

    this.scene.add(stage0);
    this.stageGroups.push(stage0);

    // ── STAGE 1: School Fee Challan & Smart Toll Card (Fastag) ──────────────
    const stage1 = new THREE.Group();
    stage1.name = 'stage-1-school';

    // Floating School Challan Document
    const docGeo = new THREE.BoxGeometry(3.6, 4.6, 0.06);
    const docMesh = new THREE.Mesh(docGeo, paperMat);
    docMesh.position.set(-0.8, 0.4, 0);
    docMesh.rotation.z = 0.08;
    stage1.add(docMesh);

    // Printed Text Line Skeletons on Challan
    for (let i = 0; i < 5; i++) {
      const lineGeo = new THREE.BoxGeometry(2.4, 0.1, 0.01);
      const lineMat = new THREE.MeshBasicMaterial({ color: 0xd1d5db });
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.position.set(-0.8, 1.4 - i * 0.4, 0.04);
      line.rotation.z = 0.08;
      stage1.add(line);
    }

    // Dynamic Verification Seal / Stamp on Challan
    const stampGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.08, 32);
    this.challanStampMat = new THREE.MeshStandardMaterial({
      color: 0x059669,
      emissive: 0x10b981,
      emissiveIntensity: 0.4,
      roughness: 0.3
    });
    const stampMesh = new THREE.Mesh(stampGeo, this.challanStampMat);
    stampMesh.position.set(-0.2, -0.6, 0.08);
    stampMesh.rotation.x = Math.PI / 2;
    stage1.add(stampMesh);
    this.stage1Stamp = stampMesh;

    // Smart Toll NFC Card (Fastag)
    const cardGeo = new THREE.BoxGeometry(3.2, 2.0, 0.08);
    const cardMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.5, roughness: 0.3 });
    const fastagCard = new THREE.Mesh(cardGeo, cardMat);
    fastagCard.position.set(1.4, -0.8, 0.8);
    fastagCard.rotation.y = -0.25;
    fastagCard.rotation.z = -0.12;
    stage1.add(fastagCard);

    // Smart Card Chip
    const chipGeo = new THREE.BoxGeometry(0.6, 0.45, 0.02);
    const chipMesh = new THREE.Mesh(chipGeo, brushedGoldMat);
    chipMesh.position.set(0.6, -0.8, 0.86);
    chipMesh.rotation.y = -0.25;
    chipMesh.rotation.z = -0.12;
    stage1.add(chipMesh);

    // NFC Radio Wave Rings
    const nfcRingGeo = new THREE.RingGeometry(0.5, 0.58, 32);
    this.nfcRingMat = new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
    const nfcRing = new THREE.Mesh(nfcRingGeo, this.nfcRingMat);
    nfcRing.position.set(1.4, -0.8, 0.9);
    stage1.add(nfcRing);
    this.stage1NfcRing = nfcRing;

    stage1.visible = false;
    this.scene.add(stage1);
    this.stageGroups.push(stage1);

    // ── STAGE 2: The UPI Rupee Token & Verified Receipt ─────────────────────
    const stage2 = new THREE.Group();
    stage2.name = 'stage-2-staff';

    // 3D Rupee Token / Medallion
    const coinGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.22, 48);
    const coinMat = new THREE.MeshStandardMaterial({
      color: 0x059669,
      emissive: 0x047857,
      emissiveIntensity: 0.2,
      metalness: 0.7,
      roughness: 0.2
    });
    const coinMesh = new THREE.Mesh(coinGeo, coinMat);
    coinMesh.rotation.x = Math.PI / 2.5;
    coinMesh.position.set(-1.2, 0.2, 0.5);
    stage2.add(coinMesh);
    this.stage2Coin = coinMesh;

    // Outer coin golden rim
    const coinRimGeo = new THREE.TorusGeometry(1.5, 0.08, 16, 48);
    const coinRim = new THREE.Mesh(coinRimGeo, brushedGoldMat);
    coinRim.rotation.x = Math.PI / 2.5;
    coinRim.position.set(-1.2, 0.2, 0.5);
    stage2.add(coinRim);

    // Verified Digital Mandate Envelope / Receipt
    const envGeo = new THREE.BoxGeometry(4.2, 2.8, 0.15);
    const envMesh = new THREE.Mesh(envGeo, paperMat);
    envMesh.position.set(1.0, -0.4, 0);
    envMesh.rotation.y = -0.15;
    stage2.add(envMesh);

    // Checkmark Badge on Envelope
    const checkBadgeGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 24);
    this.stage2BadgeMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3 });
    const checkBadge = new THREE.Mesh(checkBadgeGeo, this.stage2BadgeMat);
    checkBadge.position.set(2.4, 0.6, 0.15);
    checkBadge.rotation.x = Math.PI / 2;
    stage2.add(checkBadge);

    stage2.visible = false;
    this.scene.add(stage2);
    this.stageGroups.push(stage2);

    // ── STAGE 3: The Debt Freedom Scale & Prepayment Block ──────────────────
    const stage3 = new THREE.Group();
    stage3.name = 'stage-3-debt';

    // Balance Scale Base & Pillar
    const baseGeo = new THREE.CylinderGeometry(1.4, 1.6, 0.3, 32);
    const baseMesh = new THREE.Mesh(baseGeo, obsidianMat);
    baseMesh.position.set(0, -2.5, 0);
    stage3.add(baseMesh);

    const pillarGeo = new THREE.CylinderGeometry(0.14, 0.14, 4.2, 16);
    const pillarMesh = new THREE.Mesh(pillarGeo, brushedGoldMat);
    pillarMesh.position.set(0, -0.5, 0);
    stage3.add(pillarMesh);

    // Balance Scale Beam (Tilts dynamically based on prepayments)
    const beamGeo = new THREE.BoxGeometry(5.4, 0.16, 0.25);
    this.stage3Beam = new THREE.Mesh(beamGeo, brushedGoldMat);
    this.stage3Beam.position.set(0, 1.4, 0);
    stage3.add(this.stage3Beam);

    // Left Pan: Bank Interest Weight (Struggle)
    const panGeo = new THREE.CylinderGeometry(1.0, 0.8, 0.2, 24);
    const leftPan = new THREE.Mesh(panGeo, obsidianMat);
    leftPan.position.set(-2.2, 0.4, 0);
    this.stage3LeftPan = leftPan;
    stage3.add(leftPan);

    // Right Pan: Prepayment Freedom Gold Block (Covered)
    const rightPan = new THREE.Mesh(panGeo, obsidianMat);
    rightPan.position.set(2.2, 0.4, 0);
    this.stage3RightPan = rightPan;
    stage3.add(rightPan);

    // Gold Ingot Block sitting on right pan
    const goldIngotGeo = new THREE.BoxGeometry(1.2, 0.6, 0.8);
    const goldIngot = new THREE.Mesh(goldIngotGeo, brushedGoldMat);
    goldIngot.position.set(2.2, 0.8, 0);
    this.stage3Ingot = goldIngot;
    stage3.add(goldIngot);

    stage3.visible = false;
    this.scene.add(stage3);
    this.stageGroups.push(stage3);

    // ── STAGE 4: The Celebration Diya & Sovereign Gold Coin ─────────────────
    const stage4 = new THREE.Group();
    stage4.name = 'stage-4-festive';

    // Traditional Brass Diya Base
    const diyaBaseGeo = new THREE.CylinderGeometry(1.8, 0.6, 0.6, 32);
    const diyaMesh = new THREE.Mesh(diyaBaseGeo, brushedGoldMat);
    diyaMesh.position.set(-1.2, -0.6, 0);
    stage4.add(diyaMesh);

    // Diya Oil Bowl Interior
    const bowlGeo = new THREE.CylinderGeometry(1.6, 1.4, 0.3, 32);
    const bowlMesh = new THREE.Mesh(bowlGeo, obsidianMat);
    bowlMesh.position.set(-1.2, -0.35, 0);
    stage4.add(bowlMesh);

    // Glowing Flame (Pulsates in animation loop)
    const flameGeo = new THREE.ConeGeometry(0.35, 0.9, 16);
    this.flameMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });
    const flameMesh = new THREE.Mesh(flameGeo, this.flameMat);
    flameMesh.position.set(-1.2, 0.25, 0);
    stage4.add(flameMesh);
    this.stage4Flame = flameMesh;

    // Warm Ambient Flame Light
    this.flameLight = new THREE.PointLight(0xf59e0b, 3.5, 8);
    this.flameLight.position.set(-1.2, 0.4, 0);
    stage4.add(this.flameLight);

    // Sovereign Gold Coin (24 Karat Hallmark Coin)
    const goldCoinGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.2, 48);
    const goldCoin = new THREE.Mesh(goldCoinGeo, brushedGoldMat);
    goldCoin.position.set(1.4, 0.2, 0.4);
    goldCoin.rotation.x = Math.PI / 3;
    stage4.add(goldCoin);
    this.stage4GoldCoin = goldCoin;

    // Sinking Fund Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(1.8, 2.0, 0.5, 32);
    const pedestalMesh = new THREE.Mesh(pedestalGeo, obsidianMat);
    pedestalMesh.position.set(1.4, -0.8, 0.4);
    stage4.add(pedestalMesh);

    stage4.visible = false;
    this.scene.add(stage4);
    this.stageGroups.push(stage4);

    // ── STAGE 5: The Sovereign Triad Compounding Rings ───────────────────────
    const stage5 = new THREE.Group();
    stage5.name = 'stage-5-invest';

    // Ring 1: EPF 8.25% Sovereign Yield (Outer Brass Ring)
    const epfRingGeo = new THREE.TorusGeometry(2.8, 0.12, 16, 64);
    const epfRing = new THREE.Mesh(epfRingGeo, brushedGoldMat);
    stage5.add(epfRing);
    this.stage5EpfRing = epfRing;

    // Ring 2: PPF 7.10% Sovereign Tax-Free (Middle Emerald Ring)
    const ppfRingGeo = new THREE.TorusGeometry(2.1, 0.12, 16, 64);
    const ppfRing = new THREE.Mesh(ppfRingGeo, emeraldGlowMat);
    ppfRing.rotation.x = Math.PI / 4;
    stage5.add(ppfRing);
    this.stage5PpfRing = ppfRing;

    // Ring 3: Mutual Funds & Equity (Inner Titanium Ring)
    const mfRingGeo = new THREE.TorusGeometry(1.4, 0.12, 16, 64);
    const mfRing = new THREE.Mesh(mfRingGeo, obsidianMat);
    mfRing.rotation.y = Math.PI / 3;
    stage5.add(mfRing);
    this.stage5MfRing = mfRing;

    // Central 5th-of-the-Month Lock Core (Clicks shut when interest is locked)
    const lockCoreGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 32);
    this.stage5LockMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.6,
      roughness: 0.2
    });
    const lockCore = new THREE.Mesh(lockCoreGeo, this.stage5LockMat);
    lockCore.rotation.x = Math.PI / 2;
    stage5.add(lockCore);
    this.stage5LockCore = lockCore;

    stage5.visible = false;
    this.scene.add(stage5);
    this.stageGroups.push(stage5);

    // ── STAGE 6: The Master Protected Enclave (24.2 Mo Runway) ──────────────
    const stage6 = new THREE.Group();
    stage6.name = 'stage-6-protected';

    // Central Emerald Monolith
    const monolithGeo = new THREE.BoxGeometry(2.4, 4.4, 0.8);
    const monolithMat = new THREE.MeshPhysicalMaterial({
      color: 0x047857,
      transmission: 0.6,
      opacity: 0.95,
      transparent: true,
      roughness: 0.15,
      metalness: 0.2
    });
    const monolith = new THREE.Mesh(monolithGeo, monolithMat);
    stage6.add(monolith);

    // Golden Halo Ring crowning the monolith
    const haloGeo = new THREE.TorusGeometry(2.0, 0.08, 16, 64);
    const halo = new THREE.Mesh(haloGeo, brushedGoldMat);
    halo.position.set(0, 2.4, 0);
    halo.rotation.x = Math.PI / 2;
    stage6.add(halo);

    // Protective Sovereign Geodesic Sphere Aura
    const domeGeo = new THREE.IcosahedronGeometry(4.2, 2);
    const domeMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    stage6.add(dome);
    this.stage6Dome = dome;

    stage6.visible = false;
    this.scene.add(stage6);
    this.stageGroups.push(stage6);
  }

  setStateMode(mode) {
    this.stateMode = mode; // 'struggle' or 'covered'

    // Update Stage 1 Stamp & NFC Color
    if (this.challanStampMat) {
      this.challanStampMat.color.setHex(mode === 'struggle' ? 0xef4444 : 0x059669);
      this.challanStampMat.emissive.setHex(mode === 'struggle' ? 0xb91c1c : 0x10b981);
    }
    if (this.nfcRingMat) {
      this.nfcRingMat.color.setHex(mode === 'struggle' ? 0xef4444 : 0x10b981);
    }

    // Update Stage 2 Badge Color
    if (this.stage2BadgeMat) {
      this.stage2BadgeMat.color.setHex(mode === 'struggle' ? 0xf59e0b : 0x10b981);
    }

    // Update Stage 3 Scale Tilt: Struggle tilts toward heavy interest; Covered tips toward gold freedom!
    if (this.stage3Beam) {
      const targetTilt = mode === 'struggle' ? 0.22 : -0.22;
      this.stage3Beam.rotation.z = targetTilt;
      if (this.stage3LeftPan) this.stage3LeftPan.position.y = 0.4 - targetTilt * 2.2;
      if (this.stage3RightPan) this.stage3RightPan.position.y = 0.4 + targetTilt * 2.2;
      if (this.stage3Ingot) this.stage3Ingot.position.y = 0.8 + targetTilt * 2.2;
    }

    // Update Stage 5 Lock Core
    if (this.stage5LockMat) {
      this.stage5LockMat.color.setHex(mode === 'struggle' ? 0xef4444 : 0x10b981);
      this.stage5LockMat.emissive.setHex(mode === 'struggle' ? 0xb91c1c : 0x059669);
    }

    // Update Rim Light atmosphere
    if (this.rimLight) {
      this.rimLight.color.setHex(mode === 'struggle' ? 0xf87171 : 0x059669);
    }
  }

  updateScrollProgress(progress) {
    this.scrollProgress = Math.max(0, Math.min(progress, 1));
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      if (!this.container) return;
      this.width = this.container.clientWidth;
      this.height = this.container.clientHeight;

      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    window.addEventListener('mousemove', (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;

      this.gyroMouse.targetX = nx * 0.8;
      this.gyroMouse.targetY = ny * 0.5;
    });
  }

  animate(time) {
    requestAnimationFrame(this.animate);

    const t = time * 0.001;

    // 1. Mouse Gyro Parallax Lerp
    this.gyroMouse.x += (this.gyroMouse.targetX - this.gyroMouse.x) * 0.08;
    this.gyroMouse.y += (this.gyroMouse.targetY - this.gyroMouse.y) * 0.08;

    this.camera.position.x = this.gyroMouse.x;
    this.camera.position.y = this.gyroMouse.y;
    this.camera.lookAt(0, 0, 0);

    // 2. Stage Interpolation & Visibility Blending based on Scroll Progress
    // We have 7 stages (0 to 6).
    const numStages = this.stageGroups.length;
    const stageIndexFloat = this.scrollProgress * (numStages - 1);
    const activeIndex = Math.min(Math.floor(stageIndexFloat), numStages - 1);
    const nextIndex = Math.min(activeIndex + 1, numStages - 1);
    const stageAlpha = stageIndexFloat - activeIndex;

    this.stageGroups.forEach((grp, idx) => {
      if (idx === activeIndex) {
        grp.visible = true;
        grp.scale.setScalar(1 - stageAlpha * 0.3);
        grp.position.y = -stageAlpha * 3.0;
        grp.rotation.y = this.gyroMouse.x * 0.4 + (1 - stageAlpha) * 0.1;
      } else if (idx === nextIndex && stageAlpha > 0.01) {
        grp.visible = true;
        grp.scale.setScalar(0.7 + stageAlpha * 0.3);
        grp.position.y = (1 - stageAlpha) * 3.0;
        grp.rotation.y = this.gyroMouse.x * 0.4 - (1 - stageAlpha) * 0.1;
      } else {
        grp.visible = false;
      }
    });

    // 3. Artifact Specific Animations
    // Stage 0: Ring rotation
    if (this.stage0OrbitRing) {
      this.stage0OrbitRing.rotation.z = t * 0.5;
    }

    // Stage 1: Fastag NFC wave pulsing
    if (this.stage1NfcRing) {
      const pulse = (Math.sin(t * 4.0) + 1) * 0.5;
      this.stage1NfcRing.scale.setScalar(1 + pulse * 0.6);
      this.stage1NfcRing.material.opacity = Math.max(0, 0.8 - pulse * 0.6);
    }

    // Stage 2: Rupee Coin gentle spin
    if (this.stage2Coin) {
      this.stage2Coin.rotation.z = Math.sin(t * 1.5) * 0.2;
    }

    // Stage 4: Diya Flame flicker
    if (this.stage4Flame && this.flameLight) {
      const flicker = Math.sin(t * 12.0) * 0.06 + Math.cos(t * 7.0) * 0.04;
      this.stage4Flame.scale.set(1 + flicker, 1 + flicker * 1.5, 1 + flicker);
      this.flameLight.intensity = 3.5 + flicker * 5.0;
    }
    if (this.stage4GoldCoin) {
      this.stage4GoldCoin.rotation.z = t * 0.4;
    }

    // Stage 5: Sovereign Compounding Gyroscope Rotations
    if (this.stage5EpfRing) this.stage5EpfRing.rotation.z = t * 0.3;
    if (this.stage5PpfRing) this.stage5PpfRing.rotation.x = t * 0.4;
    if (this.stage5MfRing) this.stage5MfRing.rotation.y = t * 0.5;

    // Stage 6: Geodesic Protective Dome rotation
    if (this.stage6Dome) {
      this.stage6Dome.rotation.y = t * 0.2;
      this.stage6Dome.rotation.x = Math.sin(t * 0.15) * 0.1;
    }

    // Render Scene
    this.renderer.render(this.scene, this.camera);
  }
}
