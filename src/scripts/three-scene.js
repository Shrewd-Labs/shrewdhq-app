import * as THREE from 'three';

/**
 * ShrewdHQ Household OS — 3D Architectural Spatial Story Engine
 * 
 * Visually illustrates the real day-to-day struggles of an Indian home:
 * - Tracking due dates for school, utilities, and EMIs
 * - Evaluating investments (EPF, PPF 5th of month rule, CAS mutual funds)
 * - Personal finance & budgeting (domestic staff, power grid, loan amortization)
 * - Special days in the calendar (Diwali festive sinking funds, vacations, gold)
 * - Transforming from chaos & mental overload into sovereign calm: "ShrewdHQ Has It Covered"
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
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-1000, -1000);
    this.gyroMouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    this.beacons = [];
    this.scrollProgress = 0;
    this.stateMode = 'covered'; // 'struggle' or 'covered'
    this.currentChapterIndex = 0;

    // 7 Storyline Camera Waypoints matching the human Indian home journey
    this.waypoints = [
      // 0. The Master Overview (The Invisible Mental Load)
      {
        cam: new THREE.Vector3(18, 14, 22),
        target: new THREE.Vector3(0, 3, 0),
        sunPos: new THREE.Vector3(15, 25, 20),
        sunColor: 0xfffaed,
        sunIntensity: 2.2,
        ambientColor: 0xe0e7ff,
        skyBg: '#f8fafc',
        zone: 'overview',
        struggleAlert: '⚠️ 14 Scattered Bills, Deadlines & Unverified Portfolios',
        coveredText: '🛡️ ShrewdHQ Household OS: Unified Sovereign Clarity'
      },
      // 1. 07:15 AM: School Fees, Bus Fastag & WhatsApp Challans
      {
        cam: new THREE.Vector3(9, 5.5, 12.5),
        target: new THREE.Vector3(2.5, 2, 5),
        sunPos: new THREE.Vector3(14, 18, 16),
        sunColor: 0xffedd5,
        sunIntensity: 2.4,
        ambientColor: 0xfef3c7,
        skyBg: '#fffbeb',
        zone: 'school',
        struggleAlert: '🚨 DPS Fee Due Today &bull; Bus Fastag Negative Alert',
        coveredText: '✅ Challan Auto-Matched &bull; Fastag Replenished'
      },
      // 2. 10:30 AM: Domestic Staff Payroll, Society Maintenance & Due Date Anxiety
      {
        cam: new THREE.Vector3(6, 6.5, 8.5),
        target: new THREE.Vector3(-0.5, 2.5, 1.5),
        sunPos: new THREE.Vector3(6, 24, 10),
        sunColor: 0xfffae6,
        sunIntensity: 2.8,
        ambientColor: 0xecfdf5,
        skyBg: '#f0fdf4',
        zone: 'utilities',
        struggleAlert: '⚠️ Cook/Maid Salary Confusion &bull; Society Late Penalty Warning',
        coveredText: '✅ UPI AutoPay Active &bull; Zero Late Fees &bull; Shared Ledger'
      },
      // 3. 02:00 PM: The Loan EMI Rate Hike & Expiring Insurance Spam
      {
        cam: new THREE.Vector3(-8.5, 8.5, 9.5),
        target: new THREE.Vector3(-1.2, 4.5, 0.5),
        sunPos: new THREE.Vector3(0, 28, 4),
        sunColor: 0xffffff,
        sunIntensity: 3.0,
        ambientColor: 0xf5f3ff,
        skyBg: '#fbfbfe',
        zone: 'loans',
        struggleAlert: '📈 Home Loan Interest Shock &bull; Car Insurance Expired',
        coveredText: '✅ Debt Freedom: 2033 &bull; Zero-Broker Policy Renewed'
      },
      // 4. 06:30 PM: Special Days in the Calendar & Festive Budgeting
      {
        cam: new THREE.Vector3(8.5, 7.5, 13.5),
        target: new THREE.Vector3(1, 2.2, 3),
        sunPos: new THREE.Vector3(-12, 14, 8),
        sunColor: 0xfbbf24,
        sunIntensity: 2.2,
        ambientColor: 0xfef08a,
        skyBg: '#fefce8',
        zone: 'festive',
        struggleAlert: '⚠️ Festive Cash Crunch &bull; Jewellery Making Charges Trap',
        coveredText: '✨ Diwali Sinking Fund Ready &bull; Zero Credit Card Debt'
      },
      // 5. 09:00 PM: Evaluating Investments, EPF & The PPF 5th Rule
      {
        cam: new THREE.Vector3(-7, 12, 7.5),
        target: new THREE.Vector3(0, 6, 0),
        sunPos: new THREE.Vector3(-16, 8, -10),
        sunColor: 0xf97316,
        sunIntensity: 1.8,
        ambientColor: 0x312e81,
        skyBg: '#f8fafc',
        zone: 'statutory',
        struggleAlert: '⚠️ 18 Scattered SIPs &bull; Missed PPF 5th-of-Month Interest',
        coveredText: '🛡️ EPF 8.25% + PPF Protected &bull; Zero-Scraping CAS Sync'
      },
      // 6. 11:00 PM: The Bedtime Resolution: ShrewdHQ Has It All Covered
      {
        cam: new THREE.Vector3(13, 14, 18),
        target: new THREE.Vector3(0, 4.5, 0),
        sunPos: new THREE.Vector3(2, 20, -12),
        sunColor: 0xa5b4fc,
        sunIntensity: 1.5,
        ambientColor: 0x1e1b4b,
        skyBg: '#0f172a',
        zone: 'copilot',
        struggleAlert: '😓 Bedtime Financial Anxiety &bull; Unspoken Spouse Stress',
        coveredText: '🌙 24.2 Months Runway &bull; Total Sovereign Harmony'
      }
    ];

    this.currentCamPos = this.waypoints[0].cam.clone();
    this.currentTarget = this.waypoints[0].target.clone();

    this.init();
  }

  init() {
    // 1. Scene & Fog
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xfbfbfd);
    this.scene.fog = new THREE.FogExp2(0xfbfbfd, 0.018);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(
      38,
      this.width / this.height,
      0.1,
      100
    );
    this.camera.position.copy(this.currentCamPos);
    this.camera.lookAt(this.currentTarget);

    // 3. Renderer
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
    this.renderer.toneMappingExposure = 1.1;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // 4. Lights
    this.setupLighting();

    // 5. Build Architectural Model with Indian Household Details
    this.buildModernVilla();

    // 6. Build Interactive Spatial Beacons
    this.buildBeacons();

    // 7. Event Listeners
    this.bindEvents();

    // 8. Animation Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupLighting() {
    this.ambientLight = new THREE.AmbientLight(0xe2e8f0, 1.2);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    this.dirLight.position.set(15, 25, 20);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 60;
    this.dirLight.shadow.camera.left = -16;
    this.dirLight.shadow.camera.right = 16;
    this.dirLight.shadow.camera.top = 16;
    this.dirLight.shadow.camera.bottom = -16;
    this.dirLight.shadow.bias = -0.0005;
    this.scene.add(this.dirLight);

    // Soft ground bounce light
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xd1d5db, 0.6);
    this.scene.add(this.hemiLight);

    // Study financial monitor point light
    this.studyPointLight = new THREE.PointLight(0x38bdf8, 2, 8);
    this.studyPointLight.position.set(-1, 5.5, 0);
    this.scene.add(this.studyPointLight);

    // Living/kitchen warm domestic light
    this.livingPointLight = new THREE.PointLight(0xfef08a, 1.8, 10);
    this.livingPointLight.position.set(0, 2.2, 1);
    this.scene.add(this.livingPointLight);

    // Rooftop Sovereign KMS Vault Emerald Light
    this.vaultPointLight = new THREE.PointLight(0x10b981, 2.5, 8);
    this.vaultPointLight.position.set(0, 6.8, 0);
    this.scene.add(this.vaultPointLight);

    // Festive Diya warm lantern point light
    this.festivePointLight = new THREE.PointLight(0xf59e0b, 2.0, 9);
    this.festivePointLight.position.set(2, 2.4, 3.5);
    this.scene.add(this.festivePointLight);
  }

  buildModernVilla() {
    this.villaGroup = new THREE.Group();

    // Standard high-end architectural materials
    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.35,
      metalness: 0.05
    });

    const obsidianMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.25,
      metalness: 0.2
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transmission: 0.85,
      opacity: 1,
      transparent: true,
      roughness: 0.1,
      ior: 1.5,
      thickness: 0.5
    });

    const warmWoodMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.5
    });

    const emeraldGlowMat = new THREE.MeshStandardMaterial({
      color: 0x059669,
      emissive: 0x10b981,
      emissiveIntensity: 0.6,
      roughness: 0.2
    });

    // 1. Ground Podium & Landscaped Terrace
    const groundGeo = new THREE.BoxGeometry(28, 0.4, 24);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.6
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.2;
    ground.receiveShadow = true;
    this.villaGroup.add(ground);

    // Lawn area
    const lawnGeo = new THREE.BoxGeometry(26, 0.05, 7);
    const lawnMat = new THREE.MeshStandardMaterial({
      color: 0xdcfce7,
      roughness: 0.8
    });
    const lawn = new THREE.Mesh(lawnGeo, lawnMat);
    lawn.position.set(0, 0.03, 7.5);
    lawn.receiveShadow = true;
    this.villaGroup.add(lawn);

    // Driveway & Entrance Walkway
    const pathGeo = new THREE.BoxGeometry(4, 0.08, 10);
    const pathMat = new THREE.MeshStandardMaterial({
      color: 0xcfd8dc,
      roughness: 0.4
    });
    const path = new THREE.Mesh(pathGeo, pathMat);
    path.position.set(3, 0.05, 6);
    path.receiveShadow = true;
    this.villaGroup.add(path);

    // 2. Ground Level: Living & Domestic Staff Pavilion
    const gFloorGeo = new THREE.BoxGeometry(14, 0.3, 10);
    const gFloor = new THREE.Mesh(gFloorGeo, concreteMat);
    gFloor.position.set(-1, 0.15, 0);
    gFloor.receiveShadow = true;
    this.villaGroup.add(gFloor);

    // Glass walls for Ground Floor
    const gGlassGeo = new THREE.BoxGeometry(13.6, 2.8, 9.6);
    const gGlass = new THREE.Mesh(gGlassGeo, glassMat);
    gGlass.position.set(-1, 1.6, 0);
    this.villaGroup.add(gGlass);

    // Architectural Support Columns
    const colGeo = new THREE.CylinderGeometry(0.18, 0.18, 3, 16);
    const colPositions = [
      [-7.5, 1.5, 4.5], [-7.5, 1.5, -4.5],
      [5.5, 1.5, 4.5], [5.5, 1.5, -4.5],
      [-1, 1.5, 4.8]
    ];
    colPositions.forEach(([x, y, z]) => {
      const col = new THREE.Mesh(colGeo, obsidianMat);
      col.position.set(x, y, z);
      col.castShadow = true;
      col.receiveShadow = true;
      this.villaGroup.add(col);
    });

    // 3. Level 1: Slab & Financial Study (Home Workspace)
    const midSlabGeo = new THREE.BoxGeometry(16, 0.4, 11);
    const midSlab = new THREE.Mesh(midSlabGeo, concreteMat);
    midSlab.position.set(-0.5, 3.2, 0);
    midSlab.castShadow = true;
    midSlab.receiveShadow = true;
    this.villaGroup.add(midSlab);

    // Level 1 Cantilever Study Room
    const studyGeo = new THREE.BoxGeometry(9, 2.6, 8);
    const study = new THREE.Mesh(studyGeo, concreteMat);
    study.position.set(-3.5, 4.7, 0.5);
    study.castShadow = true;
    study.receiveShadow = true;
    this.villaGroup.add(study);

    // Study Glass Front
    const studyGlassGeo = new THREE.BoxGeometry(8.6, 2.3, 0.1);
    const studyGlass = new THREE.Mesh(studyGlassGeo, glassMat);
    studyGlass.position.set(-3.5, 4.7, 4.55);
    this.villaGroup.add(studyGlass);

    // Glowing Study Workstations (Home Loan & Investment Terminal)
    const deskGeo = new THREE.BoxGeometry(3, 0.1, 1.2);
    const desk = new THREE.Mesh(deskGeo, warmWoodMat);
    desk.position.set(-3.5, 4.2, 2.5);
    this.villaGroup.add(desk);

    const screenGeo = new THREE.BoxGeometry(1.4, 0.7, 0.05);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(-3.5, 4.7, 2.5);
    this.villaGroup.add(screen);

    // 4. Level 2: Rooftop Sanctuary & Sovereign KMS Vault Core
    const roofSlabGeo = new THREE.BoxGeometry(12, 0.35, 9);
    const roofSlab = new THREE.Mesh(roofSlabGeo, concreteMat);
    roofSlab.position.set(-1.5, 6.2, 0);
    roofSlab.castShadow = true;
    roofSlab.receiveShadow = true;
    this.villaGroup.add(roofSlab);

    // Sovereign Encrypted Core Tower
    const vaultCoreGeo = new THREE.BoxGeometry(3.5, 2.2, 3.5);
    const vaultCore = new THREE.Mesh(vaultCoreGeo, obsidianMat);
    vaultCore.position.set(-0.5, 7.5, -0.5);
    vaultCore.castShadow = true;
    this.villaGroup.add(vaultCore);

    // Emerald Vault Core Indicator Band
    const bandGeo = new THREE.BoxGeometry(3.6, 0.3, 3.6);
    const band = new THREE.Mesh(bandGeo, emeraldGlowMat);
    band.position.set(-0.5, 7.5, -0.5);
    this.villaGroup.add(band);

    // Modern Solar Pergola (Clean Energy & Roof Deck)
    const pergolaBeamGeo = new THREE.BoxGeometry(10, 0.12, 0.2);
    for (let i = -3; i <= 3; i += 1) {
      const beam = new THREE.Mesh(pergolaBeamGeo, obsidianMat);
      beam.position.set(-2, 8.8, i * 0.9);
      beam.castShadow = true;
      this.villaGroup.add(beam);
    }

    // 5. Right Wing: Modern Carport & Fleet Garage
    const carportRoofGeo = new THREE.BoxGeometry(7, 0.3, 8);
    const carportRoof = new THREE.Mesh(carportRoofGeo, concreteMat);
    carportRoof.position.set(7.5, 2.8, -0.5);
    carportRoof.castShadow = true;
    carportRoof.receiveShadow = true;
    this.villaGroup.add(carportRoof);

    // Carport Pillar
    const cpPillarGeo = new THREE.BoxGeometry(0.3, 2.8, 0.3);
    const cpPillar = new THREE.Mesh(cpPillarGeo, obsidianMat);
    cpPillar.position.set(10.5, 1.4, 3);
    cpPillar.castShadow = true;
    this.villaGroup.add(cpPillar);

    // Miniature Modern EV Car
    const carGroup = new THREE.Group();
    const carBodyGeo = new THREE.BoxGeometry(3.6, 0.9, 1.8);
    const carBodyMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.15,
      metalness: 0.8
    });
    const carBody = new THREE.Mesh(carBodyGeo, carBodyMat);
    carBody.position.set(0, 0.6, 0);
    carBody.castShadow = true;
    carGroup.add(carBody);

    const carCabinGeo = new THREE.BoxGeometry(2, 0.65, 1.5);
    const carCabin = new THREE.Mesh(carCabinGeo, glassMat);
    carCabin.position.set(-0.2, 1.25, 0);
    carGroup.add(carCabin);

    // Headlights
    const lightGeo = new THREE.BoxGeometry(0.1, 0.15, 0.4);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9 });
    const hlLeft = new THREE.Mesh(lightGeo, lightMat);
    hlLeft.position.set(1.8, 0.6, 0.6);
    const hlRight = new THREE.Mesh(lightGeo, lightMat);
    hlRight.position.set(1.8, 0.6, -0.6);
    carGroup.add(hlLeft, hlRight);

    carGroup.position.set(7.5, 0, 0);
    this.villaGroup.add(carGroup);

    // Miniature School Van at Entrance Gate
    const schoolVanGroup = new THREE.Group();
    const vanBodyGeo = new THREE.BoxGeometry(2.8, 1.2, 1.4);
    const vanBodyMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Indian school bus yellow
      roughness: 0.3
    });
    const vanBody = new THREE.Mesh(vanBodyGeo, vanBodyMat);
    vanBody.position.set(0, 0.7, 0);
    vanBody.castShadow = true;
    schoolVanGroup.add(vanBody);

    const vanGlassGeo = new THREE.BoxGeometry(1.6, 0.4, 1.42);
    const vanGlass = new THREE.Mesh(vanGlassGeo, glassMat);
    vanGlass.position.set(0.2, 0.9, 0);
    schoolVanGroup.add(vanGlass);

    schoolVanGroup.position.set(3, 0, 8.5);
    schoolVanGroup.rotation.y = -Math.PI / 4;
    this.villaGroup.add(schoolVanGroup);

    // 6. Festive Courtyard / Veranda with Celebration Diyas
    const verandaGeo = new THREE.BoxGeometry(6, 0.15, 4);
    const veranda = new THREE.Mesh(verandaGeo, warmWoodMat);
    veranda.position.set(1.5, 0.25, 3.5);
    veranda.receiveShadow = true;
    this.villaGroup.add(veranda);

    // Diya golden lights on veranda edge
    const diyaGeo = new THREE.CylinderGeometry(0.15, 0.1, 0.1, 12);
    const diyaMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 });
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });

    [[-0.8, 0.35, 4.8], [1.2, 0.35, 4.8], [3.2, 0.35, 4.8]].forEach(([x, y, z]) => {
      const diya = new THREE.Mesh(diyaGeo, diyaMat);
      diya.position.set(x, y, z);
      const flame = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), flameMat);
      flame.position.set(x, y + 0.12, z);
      this.villaGroup.add(diya);
      this.villaGroup.add(flame);
    });

    // 7. Protective Sovereign Household Shield Aura (activated in Chapter 6)
    const shieldGeo = new THREE.SphereGeometry(18, 32, 24);
    const shieldMat = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.04,
      roughness: 0.2,
      transmission: 0.9,
      side: THREE.BackSide
    });
    this.shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    this.shieldMesh.position.set(0, 5, 0);
    this.villaGroup.add(this.shieldMesh);

    this.scene.add(this.villaGroup);
  }

  buildBeacons() {
    this.beaconDefs = [
      {
        id: 'beacon-school',
        zone: 'school',
        pos: new THREE.Vector3(3, 2.2, 8.5),
        colorStruggle: 0xef4444, // Red struggle
        colorCovered: 0x10b981,  // Emerald covered
        label: 'DPS School & Fastag',
        struggleDesc: 'Due Date Passed / Fastag Low',
        coveredDesc: 'Auto-Matched & Replenished'
      },
      {
        id: 'beacon-utilities',
        zone: 'utilities',
        pos: new THREE.Vector3(-0.5, 3.2, 1.5),
        colorStruggle: 0xf59e0b, // Amber struggle
        colorCovered: 0x059669,  // Emerald covered
        label: 'Domestic Staff & Society',
        struggleDesc: 'Whose Turn to Pay? Late Penalty Risk',
        coveredDesc: 'UPI AutoPay 1st of Month'
      },
      {
        id: 'beacon-loans',
        zone: 'loans',
        pos: new THREE.Vector3(-3.5, 6.2, 3.5),
        colorStruggle: 0xef4444, // Red struggle
        colorCovered: 0x7c3aed,  // Purple alpha covered
        label: 'SBI Home Loan & EMI',
        struggleDesc: 'Rate Hike Added 4 Yrs to Loan',
        coveredDesc: 'Prepayment Slashes 3.4 Yrs (2033)'
      },
      {
        id: 'beacon-festive',
        zone: 'festive',
        pos: new THREE.Vector3(1.5, 2.6, 3.5),
        colorStruggle: 0xf59e0b, // Amber struggle
        colorCovered: 0xd97706,  // Gold covered
        label: 'Festive & Calendar Milestones',
        struggleDesc: 'Lump-Sum Squeeze on Savings',
        coveredDesc: 'Monthly Sinking Fund: 100% Ready'
      },
      {
        id: 'beacon-statutory',
        zone: 'statutory',
        pos: new THREE.Vector3(-0.5, 9, -0.5),
        colorStruggle: 0xef4444, // Red struggle
        colorCovered: 0x059669,  // Emerald covered
        label: 'Sovereign EPF & PPF 5th Rule',
        struggleDesc: 'Missed 5th-of-Month Compounding',
        coveredDesc: 'Compounding Alert: Full Interest Locked'
      },
      {
        id: 'beacon-copilot',
        zone: 'copilot',
        pos: new THREE.Vector3(-2, 10.2, 0),
        colorStruggle: 0x64748b, // Slate struggle
        colorCovered: 0x10b981,  // Emerald covered
        label: 'AI Household Copilot',
        struggleDesc: 'Spouse Financial Arguments',
        coveredDesc: '24.2 Months Runway & Harmony'
      }
    ];

    const ringGeo = new THREE.RingGeometry(0.35, 0.48, 32);
    ringGeo.rotateX(-Math.PI / 2);

    this.beaconDefs.forEach((def, index) => {
      const beaconGroup = new THREE.Group();
      beaconGroup.position.copy(def.pos);
      beaconGroup.userData = { ...def, index };

      const activeColor = this.stateMode === 'struggle' ? def.colorStruggle : def.colorCovered;

      // Core pulsing sphere
      const sphereGeo = new THREE.SphereGeometry(0.24, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({ color: activeColor });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      beaconGroup.add(sphere);

      // Expanding pulse ring
      const ringMat = new THREE.MeshBasicMaterial({
        color: activeColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      beaconGroup.add(ring);

      this.scene.add(beaconGroup);
      this.beacons.push({ def, group: beaconGroup, sphere, ring });
    });
  }

  setStateMode(mode) {
    this.stateMode = mode; // 'struggle' or 'covered'

    // Update beacon colors
    this.beacons.forEach((b) => {
      const targetColor = mode === 'struggle' ? b.def.colorStruggle : b.def.colorCovered;
      b.sphere.material.color.setHex(targetColor);
      b.ring.material.color.setHex(targetColor);
    });

    // Update shield intensity
    if (this.shieldMesh) {
      this.shieldMesh.material.opacity = mode === 'covered' ? 0.08 : 0.01;
      this.shieldMesh.material.color.setHex(mode === 'covered' ? 0x10b981 : 0xf87171);
    }
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

      this.mouse.x = nx;
      this.mouse.y = ny;

      this.gyroMouse.targetX = nx * 1.5;
      this.gyroMouse.targetY = ny * 1.0;
    });

    // Click on 3D beacons
    this.container.addEventListener('click', (e) => {
      const rect = this.container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const clickMouse = new THREE.Vector2(x, y);
      this.raycaster.setFromCamera(clickMouse, this.camera);

      const beaconSpheres = this.beacons.map((b) => b.sphere);
      const intersects = this.raycaster.intersectObjects(beaconSpheres);

      if (intersects.length > 0) {
        const clickedBeacon = intersects[0].object.parent;
        const targetZone = clickedBeacon.userData.zone;
        this.scrollToZone(targetZone);
      }
    });
  }

  scrollToZone(zoneId) {
    const targetElement = document.getElementById(`scroll-stage-${zoneId}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  updateScrollProgress(progress) {
    this.scrollProgress = Math.max(0, Math.min(progress, 1));
  }

  animate(time) {
    requestAnimationFrame(this.animate);

    const t = time * 0.001;

    // 1. Lerp Mouse Gyro Parallax
    this.gyroMouse.x += (this.gyroMouse.targetX - this.gyroMouse.x) * 0.06;
    this.gyroMouse.y += (this.gyroMouse.targetY - this.gyroMouse.y) * 0.06;

    // 2. Animate Beacons Pulse
    this.beacons.forEach((b, i) => {
      const speed = this.stateMode === 'struggle' ? 5.0 : 3.0; // faster urgent pulse in struggle mode
      const wave = Math.sin(t * speed + i * 1.2);
      b.sphere.scale.setScalar(1 + wave * 0.16);
      b.ring.scale.setScalar(1 + (wave + 1) * 0.45);
      b.ring.material.opacity = Math.max(0, 0.8 - (wave + 1) * 0.35);
    });

    // 3. Interpolate Camera along Storyline Waypoints
    const totalSegments = this.waypoints.length - 1;
    const scaledProgress = this.scrollProgress * totalSegments;
    const segmentIndex = Math.floor(scaledProgress);
    const nextIndex = Math.min(segmentIndex + 1, totalSegments);
    const segmentAlpha = scaledProgress - segmentIndex;

    const currentWp = this.waypoints[segmentIndex];
    const nextWp = this.waypoints[nextIndex];

    if (currentWp && nextWp) {
      this.currentChapterIndex = segmentIndex;

      // Camera position
      const targetCam = new THREE.Vector3().lerpVectors(currentWp.cam, nextWp.cam, segmentAlpha);
      targetCam.x += this.gyroMouse.x;
      targetCam.y += this.gyroMouse.y;
      this.currentCamPos.lerp(targetCam, 0.08);
      this.camera.position.copy(this.currentCamPos);

      // Camera target
      const targetLook = new THREE.Vector3().lerpVectors(currentWp.target, nextWp.target, segmentAlpha);
      this.currentTarget.lerp(targetLook, 0.08);
      this.camera.lookAt(this.currentTarget);

      // Sunlight position & color
      const targetSunPos = new THREE.Vector3().lerpVectors(currentWp.sunPos, nextWp.sunPos, segmentAlpha);
      this.dirLight.position.copy(targetSunPos);

      const curSunCol = new THREE.Color(currentWp.sunColor);
      const nextSunCol = new THREE.Color(nextWp.sunColor);
      this.dirLight.color.lerpColors(curSunCol, nextSunCol, segmentAlpha);

      this.dirLight.intensity = THREE.MathUtils.lerp(
        currentWp.sunIntensity,
        nextWp.sunIntensity,
        segmentAlpha
      );

      // Ambient light
      const curAmbCol = new THREE.Color(currentWp.ambientColor);
      const nextAmbCol = new THREE.Color(nextWp.ambientColor);
      this.ambientLight.color.lerpColors(curAmbCol, nextAmbCol, segmentAlpha);

      // Update HUD banner on canvas
      this.updateHudBanner(currentWp, nextWp, segmentAlpha);
    }

    // Subtle gentle villa rotation
    if (this.villaGroup) {
      this.villaGroup.rotation.y = Math.sin(t * 0.15) * 0.025;
    }

    this.renderer.render(this.scene, this.camera);
  }

  updateHudBanner(curWp, nextWp, alpha) {
    const bannerEl = document.getElementById('canvas-story-banner');
    if (!bannerEl) return;

    const activeWp = alpha < 0.5 ? curWp : nextWp;
    if (this.stateMode === 'struggle') {
      bannerEl.innerHTML = `<span class="status-dot-struggle"></span>${activeWp.struggleAlert}`;
      bannerEl.className = 'canvas-story-banner mode-struggle';
    } else {
      bannerEl.innerHTML = `<span class="status-dot-covered"></span>${activeWp.coveredText}`;
      bannerEl.className = 'canvas-story-banner mode-covered';
    }
  }
}
