import { Household3DScene } from './three-scene.js';

/**
 * ShrewdHQ — Main Narrative & Interaction Orchestrator
 * 
 * - Synchronizes the 3D Spatial Household Artifact Engine with the story
 * - "The Struggle 🔴" vs "Covered by ShrewdHQ 🟢" Interactive State Switcher
 * - Dynamic 3D Artifact Banner and Nav Scrubber updates
 * - Interactive Debt Prepayment Amortization Simulator
 * - Festive Sinking Fund & Calendar Milestones Planner
 * - Founding Household Reservation Enclave
 */

const STAGE_STORY_BANNERS = [
  {
    struggle: '⚠️ 14 Scattered Bills, Deadlines & Unverified Portfolios',
    covered: '🛡️ Unified Household Balance Sheet: Complete Clarity'
  },
  {
    struggle: '🚨 Tuition Fee Due Today &bull; Vehicle Toll Tag Negative Alert',
    covered: '✅ Tuition Auto-Scheduled &bull; Toll Tag Ready'
  },
  {
    struggle: '⚠️ Cook/Maid Salary Confusion &bull; Society Late Penalty Warning',
    covered: '✅ Staff Payroll AutoPay &bull; Zero Late Fees &bull; Shared View'
  },
  {
    struggle: '📈 Home Loan Floating Rate Shock &bull; Policy Expiry Spam',
    covered: '✅ Debt Freedom: 2033 &bull; All Policies Stored Safely'
  },
  {
    struggle: '⚠️ Festive Cash Crunch &bull; Jeweller 15% Making Charges Trap',
    covered: '✨ Diwali Buffer Ready &bull; Zero Credit Card Debt'
  },
  {
    struggle: '⚠️ 18 Scattered SIPs &bull; Missed PPF 5th-of-Month Compounding',
    covered: '🛡️ PPF & EPF Protected &bull; Zero Scrapers'
  },
  {
    struggle: '😓 Bedtime Financial Anxiety &bull; Unspoken Spouse Stress',
    covered: '🌙 Over 2 Years Runway &bull; Total Peace of Mind'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Three.js 3D Scene
  let scene3D = null;
  const canvasContainer = document.getElementById('three-canvas-container');
  if (canvasContainer) {
    try {
      scene3D = new Household3DScene('three-canvas-container');
    } catch (e) {
      console.warn('WebGL initialization fallback:', e);
    }
  }

  // 2. Struggle vs Covered Mode Switcher
  const btnToggleStruggle = document.getElementById('btn-mode-struggle');
  const btnToggleCovered = document.getElementById('btn-mode-covered');
  const canvasBanner = document.getElementById('canvas-story-banner');
  let currentMode = 'covered';
  let activeStageIndex = 0;

  function updateBanner() {
    if (!canvasBanner) return;
    const stageData = STAGE_STORY_BANNERS[activeStageIndex] || STAGE_STORY_BANNERS[0];
    if (currentMode === 'struggle') {
      canvasBanner.innerHTML = `<span class="status-dot-struggle"></span><span>${stageData.struggle}</span>`;
      canvasBanner.className = 'canvas-story-banner mode-struggle';
    } else {
      canvasBanner.innerHTML = `<span class="status-dot-covered"></span><span>${stageData.covered}</span>`;
      canvasBanner.className = 'canvas-story-banner mode-covered';
    }
  }

  function setMode(mode) {
    currentMode = mode;
    if (scene3D) {
      scene3D.setStateMode(mode);
    }

    if (btnToggleStruggle && btnToggleCovered) {
      btnToggleStruggle.classList.toggle('active', mode === 'struggle');
      btnToggleCovered.classList.toggle('active', mode === 'covered');
    }

    // Toggle cards highlight styling between struggle and covered
    document.querySelectorAll('.chapter-glass-card').forEach((card) => {
      card.classList.toggle('highlight-struggle', mode === 'struggle');
      card.classList.toggle('highlight-covered', mode === 'covered');
    });

    updateBanner();
  }

  if (btnToggleStruggle) {
    btnToggleStruggle.addEventListener('click', () => setMode('struggle'));
  }
  if (btnToggleCovered) {
    btnToggleCovered.addEventListener('click', () => setMode('covered'));
  }

  // 3. Scroll Progress Synchronization with 3D Scene
  const scrollWrapper = document.getElementById('scroll-narrative-stream');
  const clockIndicator = document.getElementById('top-bar-clock');
  const navBeats = document.querySelectorAll('.nav-beat-item');

  function handleScroll() {
    if (!scrollWrapper) return;

    const rect = scrollWrapper.getBoundingClientRect();
    const totalHeight = scrollWrapper.scrollHeight - window.innerHeight;
    const scrollY = Math.max(0, -rect.top);
    const progress = Math.min(1, Math.max(0, scrollY / totalHeight));

    if (scene3D) {
      scene3D.updateScrollProgress(progress);
    }

    // Determine current active chapter
    const stages = document.querySelectorAll('.scroll-chapter-stage');
    stages.forEach((stage, idx) => {
      const stageRect = stage.getBoundingClientRect();
      if (stageRect.top <= window.innerHeight * 0.45) {
        activeStageIndex = idx;
      }
    });

    // Update active nav indicators
    stages.forEach((stage, idx) => {
      stage.classList.toggle('active-chapter', idx === activeStageIndex);
    });

    navBeats.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === activeStageIndex);
    });

    // Update Clock in top indicator
    const currentActiveStage = stages[activeStageIndex];
    if (currentActiveStage && clockIndicator) {
      const timeStr = currentActiveStage.dataset.time;
      if (timeStr) clockIndicator.textContent = timeStr;
    }

    updateBanner();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 4. Navigation Beat Clicks
  navBeats.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 5. Interactive Debt Prepayment Simulator (Chapter 3)
  const prepaymentSlider = document.getElementById('slider-prepayment');
  const sliderValLabel = document.getElementById('slider-val-label');
  const yearsSavedLabel = document.getElementById('debt-years-saved');
  const interestSavedLabel = document.getElementById('debt-interest-saved');

  if (prepaymentSlider) {
    prepaymentSlider.addEventListener('input', (e) => {
      const extraPerYear = parseInt(e.target.value, 10);
      sliderValLabel.textContent = `₹${(extraPerYear / 1000).toLocaleString('en-IN')}k / year`;

      // Amortization impact for ₹50L loan at 8.5%
      const yearsSaved = (extraPerYear / 50000 * 3.4).toFixed(1);
      const interestSavedLakhs = (extraPerYear / 50000 * 14.6).toFixed(1);

      if (yearsSavedLabel) yearsSavedLabel.textContent = `${yearsSaved} Years Early`;
      if (interestSavedLabel) interestSavedLabel.textContent = `₹${interestSavedLakhs} Lakhs Saved`;
    });
  }

  // 6. Interactive Festive Sinking Fund Calculator (Chapter 4)
  const checkboxes = document.querySelectorAll('.festive-checkbox');
  const monthlySinkingFundLabel = document.getElementById('festive-monthly-reserve');
  const festiveAnnualTotalLabel = document.getElementById('festive-annual-total');

  function calculateFestiveFund() {
    let totalAnnualTarget = 0;
    checkboxes.forEach((cb) => {
      if (cb.checked) {
        totalAnnualTarget += parseInt(cb.dataset.amount, 10);
      }
    });

    const monthlyReserve = Math.round(totalAnnualTarget / 12);
    if (monthlySinkingFundLabel) {
      monthlySinkingFundLabel.textContent = `₹${monthlyReserve.toLocaleString('en-IN')} / month`;
    }
    if (festiveAnnualTotalLabel) {
      festiveAnnualTotalLabel.textContent = `₹${totalAnnualTarget.toLocaleString('en-IN')} Sinking Fund`;
    }
  }

  checkboxes.forEach((cb) => {
    cb.addEventListener('change', calculateFestiveFund);
  });

  // 7. Founding Household Waitlist Form
  const foundingForm = document.getElementById('founding-form');
  const foundingInput = document.getElementById('founding-email');
  const foundingConf = document.getElementById('founding-confirmation');
  const queueNumberEl = document.getElementById('founding-queue-num');

  if (foundingForm) {
    foundingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = foundingInput.value.trim();
      if (!email) return;

      const queueNum = Math.floor(180 + Math.random() * 95);
      if (queueNumberEl) queueNumberEl.textContent = `#${queueNum}`;

      foundingForm.style.display = 'none';
      if (foundingConf) foundingConf.classList.add('active');
    });
  }
});
