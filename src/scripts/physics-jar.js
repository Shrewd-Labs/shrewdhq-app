/**
 * ShrewdHQ Interactive 3D Glass Jar Physics Engine
 * 
 * High-performance 60fps HTML5 Canvas physics simulation:
 * - Multi-pass refractive glass rendering (back wall, coins, front specular sheen)
 * - Rigid-body circle collisions, restitution, friction, and angular spin
 * - Web Audio API synthesized metallic chime/clink on impacts
 * - Particle caustics and compounding sparkles
 */

export class PhysicsJar {
  constructor(canvas, onNetWorthChange) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.onNetWorthChange = onNetWorthChange || (() => {});

    // State
    this.coins = [];
    this.particles = [];
    this.audioEnabled = false;
    this.audioCtx = null;
    this.totalValue = 18450000; // Starting baseline ₹1,84,50,000 (Indian Household balance)
    this.coinCount = 0;
    this.breakdown = {
      cash: 0,
      sgb: 0,
      epf: 0,
      mf: 0
    };

    // Physics constants
    this.gravity = 0.42;
    this.dragCoin = null;

    // Viewport dimensions
    this.width = canvas.parentElement.clientWidth;
    this.height = canvas.parentElement.clientHeight || 480;

    // Jar geometry (centered in canvas)
    this.updateJarGeometry();

    // Event listeners
    this.setupListeners();
    this.resize();

    // Spawn initial pre-seeded coins
    this.seedInitialCoins();

    // Start render loop
    this.lastTime = performance.now();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  updateJarGeometry() {
    const jarWidth = Math.min(this.width * 0.72, 360);
    const jarHeight = Math.min(this.height * 0.76, 380);
    const neckWidth = jarWidth * 0.48;
    const neckHeight = 44;

    this.jar = {
      cx: this.width / 2,
      topY: this.height - jarHeight - 20,
      neckWidth: neckWidth,
      neckHeight: neckHeight,
      neckLeft: this.width / 2 - neckWidth / 2,
      neckRight: this.width / 2 + neckWidth / 2,
      neckTop: this.height - jarHeight - 20,
      neckBottom: this.height - jarHeight - 20 + neckHeight,
      bodyWidth: jarWidth,
      bodyHeight: jarHeight - neckHeight,
      bodyLeft: this.width / 2 - jarWidth / 2,
      bodyRight: this.width / 2 + jarWidth / 2,
      bodyBottom: this.height - 24,
      borderRadius: 40
    };
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = rect.height || 480;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.scale(dpr, dpr);
    this.updateJarGeometry();
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playClinkSound(freq = 1200, velocity = 1) {
    if (!this.audioEnabled || !this.audioCtx) return;
    try {
      const ctx = this.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Pitch variation based on coin impact
      const p = freq + (Math.random() * 200 - 100);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(p, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(p * 1.5, ctx.currentTime + 0.04);

      const volume = Math.min(Math.max(velocity * 0.08, 0.02), 0.25);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (_) {
      // Audio fallback silent
    }
  }

  setupListeners() {
    window.addEventListener('resize', () => this.resize());

    // Mouse / Touch Drop
    const handleDown = (e) => {
      this.initAudio();
      const rect = this.canvas.getBoundingClientRect();
      const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
      const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

      // Spawn on click/touch
      this.spawnCoin(x, Math.min(y, this.jar.topY - 20), this.randomCoinType());
    };

    this.canvas.addEventListener('mousedown', handleDown);
    this.canvas.addEventListener('touchstart', handleDown, { passive: true });
  }

  randomCoinType() {
    const types = ['inr20', 'inr10', 'inr5', 'sgb', 'epf', 'mf'];
    return types[Math.floor(Math.random() * types.length)];
  }

  getCoinDef(type) {
    switch (type) {
      case 'inr20':
        return {
          type: 'inr20',
          radius: 17,
          value: 20,
          label: '₹20',
          category: 'cash',
          color1: '#fbbf24',
          color2: '#d97706',
          textColor: '#78350f',
          soundFreq: 1400
        };
      case 'inr10':
        return {
          type: 'inr10',
          radius: 16,
          value: 10,
          label: '₹10',
          category: 'cash',
          color1: '#f3f4f6',
          color2: '#d97706',
          textColor: '#92400e',
          soundFreq: 1550
        };
      case 'inr5':
        return {
          type: 'inr5',
          radius: 14,
          value: 5,
          label: '₹5',
          category: 'cash',
          color1: '#ffffff',
          color2: '#9ca3af',
          textColor: '#374151',
          soundFreq: 1700
        };
      case 'sgb':
        return {
          type: 'sgb',
          radius: 20,
          value: 5000,
          label: 'SGB',
          category: 'sgb',
          color1: '#fef08a',
          color2: '#ca8a04',
          textColor: '#713f12',
          soundFreq: 900
        };
      case 'epf':
        return {
          type: 'epf',
          radius: 22,
          value: 10000,
          label: 'EPF',
          category: 'epf',
          color1: '#6ee7b7',
          color2: '#059669',
          textColor: '#064e3b',
          soundFreq: 750
        };
      case 'mf':
        return {
          type: 'mf',
          radius: 21,
          value: 25000,
          label: 'SIP',
          category: 'mf',
          color1: '#a5b4fc',
          color2: '#4338ca',
          textColor: '#ffffff',
          soundFreq: 600
        };
      default:
        return this.getCoinDef('inr20');
    }
  }

  seedInitialCoins() {
    // Seed 22 coins already nestled in the jar bottom
    const types = ['inr20', 'inr10', 'inr5', 'sgb', 'epf', 'mf'];
    for (let i = 0; i < 22; i++) {
      const type = types[i % types.length];
      const def = this.getCoinDef(type);
      const x = this.jar.bodyLeft + 40 + Math.random() * (this.jar.bodyWidth - 80);
      const y = this.jar.bodyBottom - 30 - Math.random() * 80;
      this.coins.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 2,
        vy: 0,
        radius: def.radius,
        angle: Math.random() * Math.PI * 2,
        angularVelocity: (Math.random() - 0.5) * 0.05,
        def: def
      });
      this.totalValue += def.value;
      this.coinCount++;
      this.breakdown[def.category] += def.value;
    }
    this.notifyUpdate();
  }

  spawnCoin(x, y, type) {
    const def = this.getCoinDef(type);
    // Ensure coin starts above the neck opening or wherever user clicked
    const spawnX = Math.max(Math.min(x, this.jar.neckRight - def.radius), this.jar.neckLeft + def.radius);
    const spawnY = Math.min(y, this.jar.neckTop - def.radius - 10);

    const coin = {
      x: spawnX,
      y: spawnY,
      vx: (Math.random() - 0.5) * 2.2,
      vy: 2 + Math.random() * 2,
      radius: def.radius,
      angle: Math.random() * Math.PI * 2,
      angularVelocity: (Math.random() - 0.5) * 0.12,
      def: def
    };

    this.coins.push(coin);
    this.totalValue += def.value;
    this.coinCount++;
    this.breakdown[def.category] += def.value;

    this.createSparks(coin.x, coin.y + coin.radius, def.color1);
    this.playClinkSound(def.soundFreq, 1.5);
    this.notifyUpdate();
  }

  shake() {
    this.initAudio();
    this.playClinkSound(800, 3);
    for (const coin of this.coins) {
      coin.vy -= 8 + Math.random() * 10;
      coin.vx += (Math.random() - 0.5) * 12;
      coin.angularVelocity += (Math.random() - 0.5) * 0.4;
    }
  }

  emptyJar() {
    this.coins = [];
    this.totalValue = 18450000;
    this.coinCount = 0;
    this.breakdown = { cash: 0, sgb: 0, epf: 0, mf: 0 };
    this.notifyUpdate();
  }

  createSparks(x, y, color) {
    for (let i = 0; i < 7; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3 - 1,
        radius: 2 + Math.random() * 2,
        color: color,
        life: 1.0,
        decay: 0.03 + Math.random() * 0.03
      });
    }
  }

  notifyUpdate() {
    this.onNetWorthChange({
      total: this.totalValue,
      count: this.coinCount,
      breakdown: this.breakdown
    });
  }

  updatePhysics() {
    const jar = this.jar;
    const padding = 10;

    // 1. Update positions & gravity
    for (let i = 0; i < this.coins.length; i++) {
      const c = this.coins[i];

      c.vy += this.gravity;
      c.vx *= 0.99;
      c.vy *= 0.99;
      c.x += c.vx;
      c.y += c.vy;
      c.angle += c.angularVelocity;
      c.angularVelocity *= 0.98;

      // Jar floor boundary
      const floor = jar.bodyBottom - c.radius;
      if (c.y > floor) {
        c.y = floor;
        if (Math.abs(c.vy) > 1.2) {
          this.playClinkSound(c.def.soundFreq, Math.abs(c.vy));
        }
        c.vy = -c.vy * 0.32;
        c.vx *= 0.88;
      }

      // Inside jar body vs neck
      if (c.y > jar.neckBottom) {
        // Main jar body walls
        const leftWall = jar.bodyLeft + padding + c.radius;
        const rightWall = jar.bodyRight - padding - c.radius;

        if (c.x < leftWall) {
          c.x = leftWall;
          c.vx = -c.vx * 0.38;
        } else if (c.x > rightWall) {
          c.x = rightWall;
          c.vx = -c.vx * 0.38;
        }
      } else if (c.y >= jar.neckTop && c.y <= jar.neckBottom) {
        // In the neck
        const leftNeck = jar.neckLeft + c.radius;
        const rightNeck = jar.neckRight - c.radius;

        if (c.x < leftNeck) {
          c.x = leftNeck;
          c.vx = -c.vx * 0.4;
        } else if (c.x > rightNeck) {
          c.x = rightNeck;
          c.vx = -c.vx * 0.4;
        }
      } else {
        // Above neck funneling into neck
        if (c.y > jar.neckTop - 30) {
          const funnelLeft = jar.neckLeft + c.radius;
          const funnelRight = jar.neckRight - c.radius;
          if (c.x < funnelLeft) c.vx += 0.3;
          if (c.x > funnelRight) c.vx -= 0.3;
        }
      }
    }

    // 2. Coin-to-coin circle collision
    for (let i = 0; i < this.coins.length; i++) {
      const c1 = this.coins[i];
      for (let j = i + 1; j < this.coins.length; j++) {
        const c2 = this.coins[j];
        const dx = c2.x - c1.x;
        const dy = c2.y - c1.y;
        const dist = Math.hypot(dx, dy);
        const minDist = c1.radius + c2.radius;

        if (dist < minDist && dist > 0.001) {
          const overlap = minDist - dist;
          const nx = dx / dist;
          const ny = dy / dist;

          // Separate
          c1.x -= nx * overlap * 0.5;
          c1.y -= ny * overlap * 0.5;
          c2.x += nx * overlap * 0.5;
          c2.y += ny * overlap * 0.5;

          // Velocity collision impulse
          const kx = c1.vx - c2.vx;
          const ky = c1.vy - c2.vy;
          const p = 2 * (nx * kx + ny * ky) / 2;

          c1.vx -= p * nx * 0.45;
          c1.vy -= p * ny * 0.45;
          c2.vx += p * nx * 0.45;
          c2.vy += p * ny * 0.45;

          // Clink sound on hard collision
          if (Math.abs(p) > 2.8) {
            this.playClinkSound(c1.def.soundFreq, Math.abs(p));
          }
        }
      }
    }

    // 3. Update particle sparks
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  drawJarBack() {
    const ctx = this.ctx;
    const j = this.jar;

    ctx.save();

    // Subtle drop shadow behind the jar
    ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
    ctx.shadowBlur = 32;
    ctx.shadowOffsetY = 14;

    // Jar body background (translucent frosted gradient)
    const bgGrad = ctx.createLinearGradient(j.bodyLeft, j.topY, j.bodyRight, j.bodyBottom);
    bgGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
    bgGrad.addColorStop(0.5, 'rgba(240, 248, 245, 0.45)');
    bgGrad.addColorStop(1, 'rgba(230, 245, 240, 0.65)');

    ctx.fillStyle = bgGrad;
    this.createJarPath(ctx, j);
    ctx.fill();

    ctx.restore();
  }

  drawCoins() {
    const ctx = this.ctx;

    for (const c of this.coins) {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.angle);

      // Coin drop shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;

      // Outer rim
      const grad = ctx.createLinearGradient(-c.radius, -c.radius, c.radius, c.radius);
      grad.addColorStop(0, c.def.color1);
      grad.addColorStop(1, c.def.color2);

      ctx.beginPath();
      ctx.arc(0, 0, c.radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Milled rim ring
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Inner circular bevel
      ctx.beginPath();
      ctx.arc(0, 0, c.radius * 0.75, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Coin currency label text
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = c.def.textColor;
      ctx.font = `bold ${Math.round(c.radius * 0.68)}px -apple-system, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(c.def.label, 0, 0.5);

      ctx.restore();
    }
  }

  drawJarFront() {
    const ctx = this.ctx;
    const j = this.jar;

    ctx.save();

    // 1. Jar Outer Glass Wall Outline with Caustics
    ctx.strokeStyle = 'rgba(5, 150, 105, 0.35)';
    ctx.lineWidth = 4;
    this.createJarPath(ctx, j);
    ctx.stroke();

    // 2. Thick Glass Base Refraction
    ctx.fillStyle = 'rgba(5, 150, 105, 0.08)';
    ctx.beginPath();
    ctx.ellipse(j.cx, j.bodyBottom - 6, j.bodyWidth * 0.44, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Specular Glass Highlight Curvature (Left curve reflection)
    const leftGloss = ctx.createLinearGradient(j.bodyLeft, j.neckBottom, j.bodyLeft + 35, j.bodyBottom);
    leftGloss.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
    leftGloss.addColorStop(0.4, 'rgba(255, 255, 255, 0.3)');
    leftGloss.addColorStop(1, 'rgba(255, 255, 255, 0.05)');

    ctx.fillStyle = leftGloss;
    ctx.beginPath();
    ctx.roundRect(j.bodyLeft + 8, j.neckBottom + 20, 16, j.bodyHeight - 60, [10]);
    ctx.fill();

    // 4. Subtle Right Rim Rim-Light Reflection
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.roundRect(j.bodyRight - 18, j.neckBottom + 40, 6, j.bodyHeight - 90, [4]);
    ctx.fill();

    // 5. Wooden / Frosted Cork Rim on top neck
    const rimGrad = ctx.createLinearGradient(j.neckLeft, j.neckTop, j.neckRight, j.neckTop);
    rimGrad.addColorStop(0, '#f3f4f6');
    rimGrad.addColorStop(0.5, '#ffffff');
    rimGrad.addColorStop(1, '#e5e7eb');

    ctx.fillStyle = rimGrad;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(j.cx, j.neckTop, j.neckWidth * 0.5, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Open Coin Slot on Top of Cork/Rim
    ctx.fillStyle = '#1d1d1f';
    ctx.beginPath();
    ctx.ellipse(j.cx, j.neckTop, j.neckWidth * 0.32, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 6. Draw Particle Sparks
    for (const p of this.particles) {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    ctx.restore();
  }

  createJarPath(ctx, j) {
    ctx.beginPath();
    // Start at top-left neck
    ctx.moveTo(j.neckLeft, j.neckTop);
    ctx.lineTo(j.neckLeft, j.neckBottom);
    // Left shoulder curve
    ctx.bezierCurveTo(
      j.neckLeft, j.neckBottom + 20,
      j.bodyLeft, j.neckBottom + 10,
      j.bodyLeft, j.neckBottom + 35
    );
    // Left wall down
    ctx.lineTo(j.bodyLeft, j.bodyBottom - j.borderRadius);
    // Bottom-left corner
    ctx.quadraticCurveTo(j.bodyLeft, j.bodyBottom, j.bodyLeft + j.borderRadius, j.bodyBottom);
    // Bottom base
    ctx.lineTo(j.bodyRight - j.borderRadius, j.bodyBottom);
    // Bottom-right corner
    ctx.quadraticCurveTo(j.bodyRight, j.bodyBottom, j.bodyRight, j.bodyBottom - j.borderRadius);
    // Right wall up
    ctx.lineTo(j.bodyRight, j.neckBottom + 35);
    // Right shoulder curve
    ctx.bezierCurveTo(
      j.bodyRight, j.neckBottom + 10,
      j.neckRight, j.neckBottom + 20,
      j.neckRight, j.neckBottom
    );
    // Right neck up
    ctx.lineTo(j.neckRight, j.neckTop);
    // Top neck ellipse back to start
    ctx.ellipse(j.cx, j.neckTop, j.neckWidth * 0.5, 9, 0, 0, Math.PI, true);
    ctx.closePath();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.updatePhysics();
    this.drawJarBack();
    this.drawCoins();
    this.drawJarFront();

    requestAnimationFrame(this.animate);
  }
}
