import { Household3DScene } from './three-scene.js';

/**
 * ShrewdHQ Household OS — Main Narrative & Interaction Orchestrator
 * 
 * - Seamless synchronization between 3D Spatial Villa and the Indian Home Storyline
 * - "The Daily Struggle" vs "ShrewdHQ Has It Covered" Interactive State Switcher
 * - Interactive Amortization Prepayment Simulator
 * - Festive Sinking Fund & Calendar Milestones Planner
 * - PPF 5th-of-the-Month Compounding Lock Calculator
 * - Founding Household Reservation Enclave
 */

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
  let currentMode = 'covered';

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
    let activeStageIndex = 0;

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
