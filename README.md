# shrewdhq-app (`https://shrewdhq.app`)

> **The Living 3D Spatial Application & Founding Household Hub for [ShrewdHQ](https://shrewdhq.app)**  
> Built for the AI Era • The Intelligence System for Modern Indian Households • Private by Design • Three.js WebGL2 Spatial Engine • GitOps Continuous Delivery.

---

## 1. Overview & Vision

`shrewdhq.app` is the interactive flagship application experience for **ShrewdHQ**. Unlike single-user personal finance apps that simply track expenses, ShrewdHQ treats the Indian household as an **economic sovereign**—unifying joint balance sheets, domestic staff payroll, school fee deadlines, home loan prepayments, appliance warranties, credit card rewards, and statutory compounding (EPF 8.25%, PPF 7.10%, NPS) in one calm, private intelligence view.

The application features a living, scroll-driven **3D Spatial Household Artifact Engine** that visualizes the daily rhythm and wealth of an urban Indian family over a 24-hour cycle.

---

## 2. 9-Stage Domestic Scrollytelling Architecture

Instead of abstract charts or generic rotating 3D buildings, the canvas renders tangible, physical-digital wealth artifacts that morph and react as the user scrolls through the day:

| Beat & Time | Chapter Focus | 3D Spatial Artifact (`three-scene.js`) | Interactive Engine on Canvas |
|---|---|---|---|
| **Core &bull; 07:00 AM** | **Family Hub & Privacy** | Floating Glass & Titanium Sovereign Vault Shield with golden "S" emblem & orbital data rings | Toggle mode between **The Struggle 🔴** and **Covered by ShrewdHQ 🟢** |
| **01 &bull; 07:15 AM** | **School Fees & Commute** | Floating Tuition Fee Challan with dynamic emerald seal + Smart Toll NFC Card with pulsing radar | Proactive 48-hr due date queue; auto-replenished toll balances |
| **02 &bull; 10:30 AM** | **Domestic Staff & Grid** | 3D Metallic Rupee (`₹`) Medallion + Verified Digital Mandate Envelope | Automated UPI 1st-of-month payroll; zero late fee tracker |
| **03 &bull; 12:30 PM** | **The Silent Leak & Warranties** | Brushed Titanium Appliance Warranty Capsule + Concentric Subscription Toggle Rings | **Interactive Household Leakage Audit**: Checklist recovering ₹3,599/mo (₹43,188/yr) in dormant autopays |
| **04 &bull; 02:00 PM** | **Home Loan & Prepayment** | 3D Debt Freedom Balance Scale & Golden Prepayment Ingot (tilts dynamically) | **Interactive Prepayment Simulator**: Extra ₹50k/yr cuts 3.4 years off mortgage & saves ₹14.6L bank interest |
| **05 &bull; 04:30 PM** | **Smart Cards & Rewards** | 3D Titanium Credit Card with golden EMV chip + Holographic Floating Reward Gem & Radar | **Interactive Smart Card Optimizer**: Category picker (Groceries, Flights, Dining, Fuel) + Points Rescuer |
| **06 &bull; 06:30 PM** | **Special Days & Gold** | Traditional Indian Brass Celebration Diya with dynamic flame light + 24k Gold Ingot | **Interactive Festive Sinking Fund Planner**: Pre-funding ₹18,333/mo eliminating credit card borrowing |
| **07 &bull; 09:00 PM** | **Investments & Compounding** | 3D Sovereign Triad Gyroscope (EPF 8.25%, PPF 7.10%, Mutual Funds) with 5th-of-month lock core | Proactive 3-day reminder locking monthly interest without scraping |
| **08 &bull; 11:00 PM** | **Bedtime Equanimity** | Sovereign Emerald Monolith crowned with golden halo & protective geodesic dome aura | Real-time family runway monitoring (24.2 months emergency buffer) |

---

## 3. Product Positioning & Copy Standards

### 3.1 Apple-Style Consumer Copy (Zero Infrastructure Jargon)
All public-facing messaging follows an Apple-grade standard of clarity, warmth, and consumer trust:
- **No Cloud Plumbing Jargon**: Never expose low-level cloud concepts like `AWS ap-south-1 (Mumbai)`, `KMS 256-bit AES envelope keys`, `Private VPC Enclave`, or `client-side parsers` on marketing or application homepages.
- **Human Benefits First**:
  - *Instead of:* "AWS Mumbai ap-south-1 Dedicated Cloud Enclave" &rarr; **"Stored Safely in India"**
  - *Instead of:* "AES-256 Client-Side KMS Envelope Encryption" &rarr; **"Bank-Grade Encryption &bull; Private by Design"**
  - *Instead of:* "Zero-telemetry enclaves" &rarr; **"Zero Ads. Never Sold. No Telecallers."**
  - *Instead of:* "Deterministic Debt Acceleration Engine" &rarr; **"See the exact math to pay off your home loan sooner."**

### 3.2 Trademark & Copyright Safety
In compliance with the Indian Trademark Act (1999) and brand protection guidelines:
- Never use registered trademarked names of private banks, institutions, fintechs, car manufacturers, or schools (e.g. DPS, SBI, HDFC, Kia, Groww, Zerodha, Fastag).
- Use clear, generic institutional descriptions:
  - *"CBSE / ICSE School Term 2 Tuition"*
  - *"Primary Home Loan (Floating 8.50%)"*
  - *"Highway Toll Tag"*
  - *"Family Electric Vehicle"*
  - *"Scattered broker apps and mutual fund portals"*

---

## 4. Frontend Architecture & Technology Stack

```
shrewdhq-app/
├── index.html                        # Scrollytelling HTML with 9 chapters & interactive tools
├── vite.config.js                    # Vite bundler configuration
├── package.json                      # Dependencies (Three.js, Vite)
├── src/
│   ├── scripts/
│   │   ├── main.js                   # Application orchestrator, scroll observer, and calculators
│   │   └── three-scene.js            # Living 3D Spatial Household Artifact Engine (Three.js WebGL2)
│   └── styles/
│       └── app.css                   # Glassmorphic ceramic styling, HUD, sliders, and bento cards
└── .github/
    └── workflows/
        └── deploy.yml                # Automated GitHub Actions GitOps CI/CD deployment
```

### Key Libraries
- **Three.js (`^0.170.0`)**: WebGL2 rendering with soft shadow maps (`PCFSoftShadowMap`), ACES Filmic tone mapping, custom extrusions, procedural materials, and mouse parallax gyro-controls.
- **Vite (`^8.3.5`)**: High-performance static bundler with lightning-fast builds (<250ms).

---

## 5. GitOps CI/CD Deployment Pipeline

All changes to `shrewdhq.app` are managed strictly via **GitOps**:
1. Code changes are tested locally with `npm run build`.
2. Committed to `master` and pushed to GitHub:
   ```bash
   git add .
   git commit -m "feat: description of change"
   git push origin master
   ```
3. GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically executes:
   - Sets up Node.js 22 and runs `npm ci`.
   - Runs `npm run build` to generate `dist/`.
   - Assumes AWS IAM Role `arn:aws:iam::515832766332:role/shrewdhq-app-deploy-prod` via GitHub OIDC (zero stored AWS secrets).
   - Syncs static assets to S3: `s3://shrewdhq-app-prod-ap-south-1/`.
   - Resolves the CloudFront Distribution ID and invalidates the edge cache (`/*`).

> **Rule:** Never execute local `aws s3 sync` or `aws cloudfront create-invalidation` commands manually. Always let GitOps maintain the single source of truth and cryptographic deployment trail.

---

## 6. Live Infrastructure Endpoints

| Resource | Value |
|---|---|
| **Live Web Endpoint** | [https://shrewdhq.app](https://shrewdhq.app) |
| **AWS Region** | Primary data residency in `ap-south-1` (Mumbai); CloudFront Edge SSL in `us-east-1` |
| **AWS Workload Account** | `515832766332` (`shrewdhq-prod`) |
| **Route53 Hosted Zone** | `Z07670801EVIGFT4ZTCPO` (`shrewdhq.app`) |
| **S3 Origin Bucket** | `shrewdhq-app-prod-ap-south-1` |
| **CloudFront Distribution** | `E2S4DE2LXZI7GZ` |
| **Edge SSL Certificate** | `arn:aws:acm:us-east-1:515832766332:certificate/414705e0-d862-4ddf-ad9f-6fa6b3d7c689` |
