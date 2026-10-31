import { Household3DScene } from './three-scene.js';

/**
 * ShrewdHQ Household OS — Main Interaction Orchestrator
 * 
 * - Three.js 3D Architectural Spatial Engine binding
 * - Scroll-Driven Camera and Chapter Transitions
 * - Interactive Debt Prepayment Acceleration Calculator
 * - Role Switcher Filtering
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

  // 2. Scroll Progress Synchronization with 3D Scene
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
      if (stageRect.top <= window.innerHeight * 0.5) {
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

  // 3. Navigation Beat Clicks
  navBeats.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 4. Interactive Debt Prepayment Simulator (Chapter 3)
  const prepaymentSlider = document.getElementById('slider-prepayment');
  const sliderValLabel = document.getElementById('slider-val-label');
  const yearsSavedLabel = document.getElementById('debt-years-saved');
  const interestSavedLabel = document.getElementById('debt-interest-saved');

  if (prepaymentSlider) {
    prepaymentSlider.addEventListener('input', (e) => {
      const extraPerYear = parseInt(e.target.value, 10);
      sliderValLabel.textContent = `₹${(extraPerYear / 1000).toLocaleString('en-IN')}k / year`;

      // Simplified prepayment amortization model for ₹50L loan at 8.5%
      const yearsSaved = (extraPerYear / 50000 * 3.4).toFixed(1);
      const interestSavedLakhs = (extraPerYear / 50000 * 14.6).toFixed(1);

      if (yearsSavedLabel) yearsSavedLabel.textContent = `${yearsSaved} Years Early`;
      if (interestSavedLabel) interestSavedLabel.textContent = `₹${interestSavedLakhs} Lakhs Saved`;
    });
  }

  // 5. Founding Household Waitlist Form
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
