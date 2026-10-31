import * as THREE from 'three';

/**
 * ShrewdHQ Household OS — 3D Architectural Spatial Engine
 * 
 * Inspired by luxury custom 3D scroll architectural showcases.
 * Renders an interactive 3D modern household villa in Three.js with:
 * - Dynamic diurnal sunlight and interior room glow
 * - 6 Architectural zones mapped to daily household operations
 * - Smooth scroll-driven camera choreography
 * - Interactive raycasting on spatial room beacons
 * - Mouse gyro perspective tilt
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
    this.activeZoneIndex = 0;
    this.scrollProgress = 0;

    // 6 Choreographed Camera Waypoints for the Scroll Stages
    this.waypoints = [
      // Stage 0: Overview / Frontal Perspective
      {
        cam: new THREE.Vector3(18, 14, 22),
        target: new THREE.Vector3(0, 3, 0),
        sunPos: new THREE.Vector3(15, 25, 20),
        sunColor: 0xfffaed,
        sunIntensity: 2.2,
        ambientColor: 0xe0e7ff,
        skyBg: '#f8fafc',
        zone: 'overview'
      },
      // Stage 1: Front Entrance & School Bus (07:30 AM)
      {
        cam: new THREE.Vector3(10, 6, 12),
        target: new THREE.Vector3(2, 2, 4),
        sunPos: new THREE.Vector3(12, 18, 15),
        sunColor: 0xfff1dc,
        sunIntensity: 2.5,
        ambientColor: 0xfef3c7,
        skyBg: '#fffbeb',
        zone: 'school'
      },
      // Stage 2: Living & Domestic Staff Pavilion (09:00 AM)
      {
        cam: new THREE.Vector3(6, 7, 9),
        target: new THREE.Vector3(-1, 3, 1),
        sunPos: new THREE.Vector3(8, 22, 10),
        sunColor: 0xfffae6,
        sunIntensity: 2.8,
        ambientColor: 0xecfdf5,
        skyBg: '#f0fdf4',
        zone: 'utilities'
      },
      // Stage 3: Financial Study & Debt Engine (11:00 AM)
      {
        cam: new THREE.Vector3(-8, 9, 10),
        target: new THREE.Vector3(-1, 5, 0),
        sunPos: new THREE.Vector3(0, 28, 5),
        sunColor: 0xffffff,
        sunIntensity: 3.0,
        ambientColor: 0xf5f3ff,
        skyBg: '#fbfbfe',
        zone: 'loans'
      },
      // Stage 4: Garage & Fleet Bay (15:30 PM)
      {
        cam: new THREE.Vector3(14, 5, 4),
        target: new THREE.Vector3(6, 1.5, -1),
        sunPos: new THREE.Vector3(-14, 16, -6),
        sunColor: 0xfef08a,
        sunIntensity: 2.4,
        ambientColor: 0xeff6ff,
        skyBg: '#eff6ff',
        zone: 'vault'
      },
      // Stage 5: Sovereign Penthouse & Compounding Core (20:00 PM)
      {
        cam: new THREE.Vector3(-7, 12, 8),
        target: new THREE.Vector3(0, 6, 0),
        sunPos: new THREE.Vector3(-16, 8, -12),
        sunColor: 0xfb923c,
        sunIntensity: 1.8,
        ambientColor: 0x312e81,
        skyBg: '#f8fafc',
        zone: 'statutory'
      },
      // Stage 6: AI Roof Deck & Night Horizon (22:30 PM)
      {
        cam: new THREE.Vector3(12, 15, 18),
        target: new THREE.Vector3(0, 4.5, 0),
        sunPos: new THREE.Vector3(2, 20, -10),
        sunColor: 0xa5b4fc,
        sunIntensity: 1.4,
        ambientColor: 0x1e1b4b,
        skyBg: '#0f172a',
        zone: 'copilot'
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

    // 5. Build Architectural Model
    this.buildModernVilla();

    // 6. Build Interactive Spatial Beacons
    this.buildBeacons();

    // 7. Event Listeners
    this.bindEvents();

    // 8. Start Animation Loop
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

    // Interior glow lights
    this.studyPointLight = new THREE.PointLight(0x38bdf8, 2, 8);
    this.studyPointLight.position.set(-1, 5.5, 0);
    this.scene.add(this.studyPointLight);

    this.livingPointLight = new THREE.PointLight(0xfef08a, 1.8, 10);
    this.livingPointLight.position.set(0, 2.2, 1);
    this.scene.add(this.livingPointLight);

    this.vaultPointLight = new THREE.PointLight(0x10b981, 2.5, 6);
    this.vaultPointLight.position.set(0, 6.8, 0);
    this.scene.add(this.vaultPointLight);
  }

  buildModernVilla() {
    this.villaGroup = new THREE.Group();

    // Materials
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

    // Subtle lawn strip
    const lawnGeo = new THREE.BoxGeometry(26, 0.05, 7);
    const lawnMat = new THREE.MeshStandardMaterial({
      color: 0xdcfce7,
      roughness: 0.8
    });
    const lawn = new THREE.Mesh(lawnGeo, lawnMat);
    lawn.position.set(0, 0.03, 7.5);
    lawn.receiveShadow = true;
    this.villaGroup.add(lawn);

    // 2. Driveway & Entrance Walkway
    const pathGeo = new THREE.BoxGeometry(4, 0.08, 10);
    const pathMat = new THREE.MeshStandardMaterial({
      color: 0xcfd8dc,
      roughness: 0.4
    });
    const path = new THREE.Mesh(pathGeo, pathMat);
    path.position.set(3, 0.05, 6);
    path.receiveShadow = true;
    this.villaGroup.add(path);

    // 3. Ground Level: Living & Domestic Staff Pavilion
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

    // 4. Level 1: Slab & Financial Study (Home Workspace)
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

    // Glowing Study Workstations (Debt Prepayment Simulators)
    const deskGeo = new THREE.BoxGeometry(3, 0.1, 1.2);
    const desk = new THREE.Mesh(deskGeo, warmWoodMat);
    desk.position.set(-3.5, 4.2, 2.5);
    this.villaGroup.add(desk);

    const screenGeo = new THREE.BoxGeometry(1.2, 0.6, 0.05);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(-3.5, 4.7, 2.5);
    this.villaGroup.add(screen);

    // 5. Level 2: Penthouse & Sovereign KMS Vault Core
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

    // 6. Modern Solar Pergola (AI Clean Energy & Roof Deck)
    const pergolaBeamGeo = new THREE.BoxGeometry(10, 0.12, 0.2);
    for (let i = -3; i <= 3; i += 1) {
      const beam = new THREE.Mesh(pergolaBeamGeo, obsidianMat);
      beam.position.set(-2, 8.8, i * 0.9);
      beam.castShadow = true;
      this.villaGroup.add(beam);
    }

    // 7. Right Wing: Modern Carport & Fleet Garage
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

    // Miniature DPS Bangalore School Van at Entrance Gate
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

    this.scene.add(this.villaGroup);
  }

  buildBeacons() {
    this.beaconDefs = [
      {
        id: 'beacon-school',
        zone: 'school',
        pos: new THREE.Vector3(3, 2.2, 8.5),
        color: 0x2563eb,
        label: 'DPS School & Fastag',
        time: '07:30 AM'
      },
      {
        id: 'beacon-utilities',
        zone: 'utilities',
        pos: new THREE.Vector3(-1, 3.5, 2),
        color: 0xd97706,
        label: 'Staff UPI Mandates',
        time: '09:00 AM'
      },
      {
        id: 'beacon-loans',
        zone: 'loans',
        pos: new THREE.Vector3(-3.5, 6.2, 3.5),
        color: 0x7c3aed,
        label: 'Home Loan & Debt',
        time: '11:00 AM'
      },
      {
        id: 'beacon-vault',
        zone: 'vault',
        pos: new THREE.Vector3(7.5, 3.2, 0),
        color: 0x0284c7,
        label: 'Fleet & Policy Vault',
        time: '15:30 PM'
      },
      {
        id: 'beacon-statutory',
        zone: 'statutory',
        pos: new THREE.Vector3(-0.5, 9, -0.5),
        color: 0x059669,
        label: 'Sovereign EPF/PPF',
        time: '20:00 PM'
      },
      {
        id: 'beacon-copilot',
        zone: 'copilot',
        pos: new THREE.Vector3(-2, 10.2, 0),
        color: 0x10b981,
        label: 'AI Household Copilot',
        time: '22:30 PM'
      }
    ];

    const ringGeo = new THREE.RingGeometry(0.35, 0.48, 32);
    ringGeo.rotateX(-Math.PI / 2);

    this.beaconDefs.forEach((def, index) => {
      const beaconGroup = new THREE.Group();
      beaconGroup.position.copy(def.pos);
      beaconGroup.userData = { ...def, index };

      // Core pulsing sphere
      const sphereGeo = new THREE.SphereGeometry(0.22, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({ color: def.color });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      beaconGroup.add(sphere);

      // Expanding pulse ring
      const ringMat = new THREE.MeshBasicMaterial({
        color: def.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      beaconGroup.add(ring);

      this.scene.add(beaconGroup);
      this.beacons.push({ group: beaconGroup, sphere, ring, initialScale: 1 });
    });
  }

  bindEvents() {
    // Window Resize
    window.addEventListener('resize', () => {
      if (!this.container) return;
      this.width = this.container.clientWidth;
      this.height = this.container.clientHeight;

      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // Mouse Gyro / Parallax Move
    window.addEventListener('mousemove', (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;

      this.mouse.x = nx;
      this.mouse.y = ny;

      this.gyroMouse.targetX = nx * 1.5;
      this.gyroMouse.targetY = ny * 1.0;
    });

    // Raycast Click on 3D Beacons
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

    // 2. Animate 3D Beacons Pulse
    this.beacons.forEach((b, i) => {
      const wave = Math.sin(t * 3.5 + i * 1.2);
      b.sphere.scale.setScalar(1 + wave * 0.15);
      b.ring.scale.setScalar(1 + (wave + 1) * 0.45);
      b.ring.material.opacity = Math.max(0, 0.8 - (wave + 1) * 0.35);
    });

    // 3. Interpolate Camera along Scroll Waypoints
    // Waypoints array length: 7 points (stages 0 to 6)
    const totalSegments = this.waypoints.length - 1;
    const scaledProgress = this.scrollProgress * totalSegments;
    const segmentIndex = Math.floor(scaledProgress);
    const nextIndex = Math.min(segmentIndex + 1, totalSegments);
    const segmentAlpha = scaledProgress - segmentIndex;

    const currentWp = this.waypoints[segmentIndex];
    const nextWp = this.waypoints[nextIndex];

    if (currentWp && nextWp) {
      // Interpolate Camera Position
      const targetCam = new THREE.Vector3().lerpVectors(currentWp.cam, nextWp.cam, segmentAlpha);
      targetCam.x += this.gyroMouse.x;
      targetCam.y += this.gyroMouse.y;
      this.currentCamPos.lerp(targetCam, 0.08);
      this.camera.position.copy(this.currentCamPos);

      // Interpolate LookAt Target
      const targetLook = new THREE.Vector3().lerpVectors(currentWp.target, nextWp.target, segmentAlpha);
      this.currentTarget.lerp(targetLook, 0.08);
      this.camera.lookAt(this.currentTarget);

      // Interpolate Sunlight Position and Color
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

      // Interpolate Ambient Light
      const curAmbCol = new THREE.Color(currentWp.ambientColor);
      const nextAmbCol = new THREE.Color(nextWp.ambientColor);
      this.ambientLight.color.lerpColors(curAmbCol, nextAmbCol, segmentAlpha);
    }

    // Gentle subtle float rotation
    if (this.villaGroup) {
      this.villaGroup.rotation.y = Math.sin(t * 0.15) * 0.03;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
