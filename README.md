# Fly & Flourish Overseas — Premium Admissions Portal

An ultra-premium, interactive WebGL-powered portal for **Fly & Flourish Overseas Admissions & Consultancy**. Designed to break away from traditional boring consultancies, this platform showcases elite 3D application profiling, direct Ivy League shorts, and direct-to-visa success records.

Developed as a modern single-page experience featuring glassmorphic UI components, rich animations, and high-performance WebGL features.

---

## 🌟 Key Features

* **3D Interactive WebGL Globe**: A custom Three.js visualization allowing candidates to view orbit-targeted study coordinates.
* **Interactive Destination Profiles**: Visual overviews of premier destinations (USA, UK, Canada, Australia, Germany) outlining top universities, intakes, and visa success statistics.
* **4-Stage Admissions Roadmap**: An interactive timeline (Elite Profiling, Precision Applications, Holographic Visa Clearance, and Pre-Departure Orbit) to guide applicants through their global journey.
* **Dynamic Consultation Calibration**: A bespoke onboarding form designed to capture candidate profiles and route them directly to specialized advisors.
* **Liquid Bubble Testimonial Carousel**: Physics-based floating bubbles detailing feedback from scholars successfully deployed at Stanford, LBS, Waterloo, and TUM.
* **World Grid Clock**: Live-ticking UTC tracker showing global synchronization status.

---

## 📊 Performance Metrics

* **98.4%** Visa Approval Rate
* **500+** Scholars Deployed Globally
* **$1.5M+** Academic Grants Secured

---

## 🛠️ Technology Stack

* **Core Framework**: React 19 (TypeScript) & Vite
* **Styling & Aesthetics**: Tailwind CSS v4 (Glassmorphic layers, custom gradients, responsive flex grids)
* **Animation & Motion**: Motion (formerly Framer Motion) for physics-based springs and micro-interactions
* **3D Visuals**: Three.js (WebGL rendering for the interactive globe)
* **Icons**: Lucide React

---

## 💻 Local Setup & Development

### Prerequisites
Ensure you have **Node.js (v18+)** installed.

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
The application will spin up locally at `http://localhost:3000`.

### 3. Build & Preview
To verify production builds:
```bash
npm run build
npm run preview
```

---

## 🚀 Automated Deployment

This project is configured with an automated GitHub Actions workflow to deploy directly to **GitHub Pages**:

* **Configuration**: Defined in `.github/workflows/deploy.yaml`
* **Trigger**: Triggers automatically on every push to the `main` branch.
* **Base Path**: The application automatically handles the subpath `/FFoverseas/` when built in production mode.

> [!NOTE]
> Ensure **Settings > Pages > Build and deployment > Source** in your GitHub repository settings is set to **GitHub Actions** to allow the workflow to perform the deployment.
