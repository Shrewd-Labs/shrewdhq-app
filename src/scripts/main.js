/**
 * ShrewdHQ Household OS Interactive 3D Spatial Engine
 * 
 * - 3D Perspective Gyroscope / Mouse Tracker
 * - 24-Hour Time Choreography & Interactive Household Scrubber
 * - Family Role-Based Permission Filtering
 * - Founding Household Reservation Enclave
 */

// Timeline Beats Configuration
const TIMELINE_BEATS = {
  '07:30': {
    time: '07:30 AM',
    title: 'Morning Briefing & School Fees',
    copilotText: 'DPS Bangalore Term 2 Tuition (₹78,500) due in 4 days. Auto-matched to DPS invoice PDF. Bus Fastag auto-topped up.',
    highlightModule: 'school',
    metrics: {
      activeSchedule: 'Term 2 Fee Due',
      familyRunway: '24.2 Months',
      todayCashFlow: '-₹78,500'
    },
    modules: {
      school: {
        title: 'DPS Bangalore — Term 2 Tuition',
        desc: 'Class 7 & Class 3 tuition fees auto-parsed from school portal. Bus Fastag auto-replenished at ₹1,000 threshold.',
        label: 'Payment Due',
        value: '₹78,500 (Due Nov 5)'
      },
      utilities: {
        title: 'Domestic Staff & Morning Utilities',
        desc: 'Cook, housekeeper, and society maintenance scheduled via UPI AutoPay for the 1st of next month.',
        label: 'Scheduled UPI Payouts',
        value: '₹32,500 / month'
      },
      loans: {
        title: 'SBI Green Home Loan',
        desc: '₹64,200 monthly EMI auto-debited on the 5th. Current interest rate: 8.50%. Principal prepayment simulator active.',
        label: 'Next EMI Auto-Debit',
        value: '₹64,200 (Nov 5)'
      },
      statutory: {
        title: 'Statutory Compounding Accrual',
        desc: 'Combined EPF passbook balance: ₹42.6L at 8.25%. PPF deadline in 5 days to maximize November interest.',
        label: 'Sovereign Balance',
        value: '₹68,20,000'
      },
      vault: {
        title: 'Private Document Vault',
        desc: 'School fee receipt PDF dropped into vault. Auto-categorized and indexed in AWS Mumbai private enclave.',
        label: 'Vault Status',
        value: '42 Encrypted Records'
      },
      copilot: {
        title: 'Household AI Question of the Day',
        desc: '"Can we upgrade the family SUV without compromising the child’s 2036 BITS/Ivy League college fund?"',
        label: 'AI Modeling',
        value: 'Safe (Surplus: ₹14.8L)'
      }
    }
  },
  '11:00': {
    time: '11:00 AM',
    title: 'Banking, EMIs & Domestic Staff',
    copilotText: 'HDFC & ICICI salary credits verified. SBI Home Loan EMI auto-debited. Kia EV6 car loan principal preview generated.',
    highlightModule: 'loans',
    metrics: {
      activeSchedule: 'Salary Credits Reconciled',
      familyRunway: '24.2 Months',
      todayCashFlow: '+₹3,40,000'
    },
    modules: {
      school: {
        title: 'Education Milestone Tracker',
        desc: 'Quarterly robotics academy and classical music fees scheduled. Annual school cost tracking on target.',
        label: 'School Budget YTD',
        value: '₹1,42,000 / ₹2,10,000'
      },
      utilities: {
        title: 'Society Maintenance & Power Grid',
        desc: 'Tata Power / Bescom smart meter auto-reconciled. Piped gas (IGL) utility bill auto-cleared.',
        label: 'Electricity & Gas',
        value: '₹4,820 (Paid)'
      },
      loans: {
        title: 'SBI Home Loan & Kia EV6 EMI',
        desc: 'Home Loan: ₹64,200. Kia EV6 Car Loan: ₹34,500. Extra ₹50K annual prepayment cuts loan tenure by 3.4 years.',
        label: 'Combined Monthly Debt',
        value: '₹98,700 / month'
      },
      statutory: {
        title: 'Corporate NPS Contribution',
        desc: 'Employer Section 80CCD(2) 14% basic salary allocation verified. Direct monthly income tax savings: ₹15,600.',
        label: 'Tax Shield Active',
        value: '₹18,200 / month'
      },
      vault: {
        title: 'Salary Slips & Form 16 Ingestion',
        desc: 'Monthly salary PDF parsed via client-side SHA256 hashed parser. PF deductions verified against passbook.',
        label: 'Audit Status',
        value: '100% Reconciled'
      },
      copilot: {
        title: 'Debt Prepayment Optimizer',
        desc: '"Should we prepay ₹5L into the car loan or home loan?" AI models 8.5% home loan tax break vs 9.1% car loan.',
        label: 'Recommendation',
        value: 'Prepay Car Loan First'
      }
    }
  },
  '15:30': {
    time: '03:30 PM',
    title: 'Car, Insurance & Document Vault',
    copilotText: 'Parents’ Senior Citizen health insurance renewal due next week. Maximize ₹50,000 Section 80D medical deduction.',
    highlightModule: 'vault',
    metrics: {
      activeSchedule: 'Health Policy Verified',
      familyRunway: '24.2 Months',
      todayCashFlow: '₹0 (Audit Phase)'
    },
    modules: {
      school: {
        title: 'Child Sports & Activity Schedule',
        desc: 'Swimming coaching and after-school tennis academy dues reconciled for next quarter.',
        label: 'Activities Funded',
        value: '₹18,000'
      },
      utilities: {
        title: 'Fastag & Vehicle Maintenance',
        desc: 'Kia EV6 scheduled 20,000 km battery inspection. Fastag auto-refilled via UPI mandate for upcoming weekend drive.',
        label: 'Fastag Balance',
        value: '₹2,500'
      },
      loans: {
        title: 'Auto Insurance Policy Vault',
        desc: 'HDFC ERGO Comprehensive Zero-Dep car policy renewal matched against market quotes. Zero broker spam.',
        label: 'Policy Premium',
        value: '₹28,400 (Active)'
      },
      statutory: {
        title: 'Parents’ Senior Citizen Mediclaim',
        desc: 'Star Health Senior Citizen policy renewal auto-verified. Qualifies for full ₹50,000 Section 80D deduction.',
        label: 'Tax Benefit',
        value: '₹15,600 Direct Tax Saved'
      },
      vault: {
        title: 'Private Document Intelligence',
        desc: 'Car RC book, insurance endorsement, and parents’ medical test reports encrypted with AWS KMS 256-bit envelope.',
        label: 'Enclave Security',
        value: 'AWS Mumbai (ap-south-1)'
      },
      copilot: {
        title: 'Insurance Buffer Check',
        desc: '"Do we have adequate catastrophic family health cover?" Evaluates ₹1 Cr Super Top-Up vs current employer group cover.',
        label: 'Coverage Analysis',
        value: 'Optimal (₹1 Cr Top-Up)'
      }
    }
  },
  '20:00': {
    time: '08:00 PM',
    title: 'Statutory Compounding & Investments',
    copilotText: 'PPF 5th of month deposit alert triggered. Mutual Fund step-up SIPs executed across Nifty 50 and Midcap indices.',
    highlightModule: 'statutory',
    metrics: {
      activeSchedule: 'SIP & PPF Allocations',
      familyRunway: '24.2 Months',
      todayCashFlow: '-₹85,000'
    },
    modules: {
      school: {
        title: 'Higher Education 2036 Fund',
        desc: 'Child Higher Education Goal: ₹1.8 Cr target by 2036. Dedicated equity step-up SIP auto-invested.',
        label: 'Goal Progress',
        value: '38.4% Funded'
      },
      utilities: {
        title: 'Discretionary Dining & Family Outings',
        desc: 'Weekly family weekend dinner and domestic groceries grouped into shared household discretionary budget.',
        label: 'Discretionary Left',
        value: '₹24,800'
      },
      loans: {
        title: 'Loan Prepayment vs Equity Math',
        desc: 'Mathematical model comparing 8.5% debt prepayments vs 12% equity mutual fund CAGR over a 15-year horizon.',
        label: 'Arbitrage Delta',
        value: '+3.5% Net Alpha'
      },
      statutory: {
        title: 'PPF 5th-of-Month Rule Engine',
        desc: 'Reminder: Deposit ₹1.5L before 5th November to capture full month interest at 7.10% sovereign accrual.',
        label: 'Deposit Action',
        value: 'Action Required (₹1.5L)'
      },
      vault: {
        title: 'CAS Mutual Fund Statement Sync',
        desc: 'Monthly CAMS/KFintech Consolidated Account Statement (CAS) PDF parsed with zero OTP or scraping.',
        label: 'Holdings Verified',
        value: '14 Schemes Auto-Linked'
      },
      copilot: {
        title: 'Gold Sovereignty Audit',
        desc: '"Should we buy physical gold jewellery for festive season or SGB?" AI reveals 15% wastage vs 2.5% RBI coupon.',
        label: 'Savings Delta',
        value: '₹42,000 Protected'
      }
    }
  },
  '22:30': {
    time: '10:30 PM',
    title: 'The Consolidated Family Horizon',
    copilotText: 'Husband and wife quiet evening check-in: Total Household Runway is 24.2 months. Zero debt anxiety. Sovereign clarity.',
    highlightModule: 'copilot',
    metrics: {
      activeSchedule: 'Household Reconciled',
      familyRunway: '24.2 Months',
      todayCashFlow: 'Quiet Night'
    },
    modules: {
      school: {
        title: 'School & Term Schedules Locked',
        desc: 'All Term 2 tuition, books, and sports academy payments locked and funded with zero last-minute rush.',
        label: 'Status',
        value: 'Completely Peaceful'
      },
      utilities: {
        title: 'Monthly Domestic Payroll Scheduled',
        desc: 'Salary payouts to driver, cook, and maid queued for 1st of month with automated receipt logs.',
        label: 'Staff Trust',
        value: '100% On-Time'
      },
      loans: {
        title: 'Debt Free Horizon Clock',
        desc: 'Accelerated debt-paydown clock: Home loan scheduled to extinguish in Year 2033 (7 years ahead of bank tenure).',
        label: 'Freedom Year',
        value: '2033 (7 Yrs Early)'
      },
      statutory: {
        title: 'Compounding While You Sleep',
        desc: 'EPF (8.25%), PPF (7.10%), SGB (2.5%), and Corporate NPS silently compounding over sovereign horizons.',
        label: 'Annual Sovereign Accrual',
        value: '+₹5.42L / year'
      },
      vault: {
        title: 'Zero-Knowledge Security Sleep',
        desc: 'Family financial records safely encrypted under KMS 256-bit envelope keys in AWS Mumbai. Zero third-party brokers.',
        label: 'Cloud Residency',
        value: '100% Sovereign'
      },
      copilot: {
        title: 'The Silent Family Operating System',
        desc: 'No arguments over who spent what on groceries. Full multi-member privacy with unified household clarity.',
        label: 'Household State',
        value: 'Complete Harmony'
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. 3D Spatial Mouse Tilt Physics
  const spatialBoard = document.getElementById('spatial-board');
  const spatialViewport = document.getElementById('spatial-viewport');

  if (spatialBoard && spatialViewport) {
    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;

    spatialViewport.addEventListener('mousemove', (e) => {
      const rect = spatialViewport.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Max 6-degree subtle luxury 3D tilt
      targetRotateY = (x / (rect.width / 2)) * 5;
      targetRotateX = -(y / (rect.height / 2)) * 4;
    });

    spatialViewport.addEventListener('mouseleave', () => {
      targetRotateX = 0;
      targetRotateY = 0;
    });

    // Smooth lerp loop
    function lerp3DTilt() {
      currentRotateX += (targetRotateX - currentRotateX) * 0.08;
      currentRotateY += (targetRotateY - currentRotateY) * 0.08;

      spatialBoard.style.transform = `perspective(1200px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
      requestAnimationFrame(lerp3DTilt);
    }
    requestAnimationFrame(lerp3DTilt);
  }

  // 2. 24-Hour Time Scrubber Orchestration
  const beatButtons = document.querySelectorAll('.btn-beat');
  const clockDisplay = document.getElementById('timeline-clock');
  const copilotText = document.getElementById('copilot-text');
  const metricSchedule = document.getElementById('metric-schedule');
  const metricRunway = document.getElementById('metric-runway');

  function applyBeat(beatKey) {
    const data = TIMELINE_BEATS[beatKey];
    if (!data) return;

    // Update active button
    beatButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.beat === beatKey);
    });

    // Update Clock & Kicker
    if (clockDisplay) clockDisplay.textContent = data.time;
    if (copilotText) copilotText.textContent = data.copilotText;
    if (metricSchedule) metricSchedule.textContent = data.metrics.activeSchedule;
    if (metricRunway) metricRunway.textContent = data.metrics.familyRunway;

    // Update Module Cards
    Object.keys(data.modules).forEach((modKey) => {
      const modData = data.modules[modKey];
      const card = document.getElementById(`module-${modKey}`);
      if (card) {
        const titleEl = card.querySelector('.module-title');
        const descEl = card.querySelector('.module-desc');
        const labelEl = card.querySelector('.data-label');
        const valEl = card.querySelector('.data-value');

        if (titleEl) titleEl.textContent = modData.title;
        if (descEl) descEl.textContent = modData.desc;
        if (labelEl) labelEl.textContent = modData.label;
        if (valEl) valEl.textContent = modData.value;

        // Highlight active module for this chapter
        card.classList.toggle('highlighted', modKey === data.highlightModule);
      }
    });
  }

  beatButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      applyBeat(btn.dataset.beat);
    });
  });

  // 3. Family Role Selector Tabs
  const roleTabs = document.querySelectorAll('.tab-pill');
  roleTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      roleTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const role = tab.dataset.role;
      filterRoleView(role);
    });
  });

  function filterRoleView(role) {
    const cards = document.querySelectorAll('.module-card');
    cards.forEach((card) => {
      if (role === 'all') {
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      } else {
        const matches = card.dataset.roles && card.dataset.roles.includes(role);
        card.style.opacity = matches ? '1' : '0.45';
        card.style.transform = matches ? 'scale(1.02)' : 'scale(0.98)';
      }
    });
  }

  // 4. Founding Household Waitlist Form
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
