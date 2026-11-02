/**
 * HAWKINS FAMILY VIDEO - VHS RACK & VCR PLAYER
 * Manages 3D VHS tape shelf, tape pull-off animation,
 * VCR insertion sequence, sound FX, and CRT TV project showcase modal.
 */

class FamilyVideoStore {
  constructor() {
    this.tapes = document.querySelectorAll('.vhs-tape');
    this.vcrSlot = document.getElementById('vcr-slot');
    this.vcrStatus = document.getElementById('vcr-display-status');
    this.crtModal = document.getElementById('crt-tv-modal');
    this.crtCloseBtn = document.getElementById('crt-close-btn');
    this.crtTitle = document.getElementById('crt-project-title');
    this.crtCategory = document.getElementById('crt-project-category');
    this.crtDescription = document.getElementById('crt-project-desc');
    this.crtTechList = document.getElementById('crt-tech-stack');
    this.crtGithubBtn = document.getElementById('crt-github-link');
    this.crtLiveBtn = document.getElementById('crt-live-link');
    this.crtScreenContent = document.getElementById('crt-screen-demo');

    this.activeTape = null;

    this.projectsData = {
      'neural-cipher': {
        title: "NEURAL CIPHER: Computer Vision & Classifier",
        category: "Deep Learning • Convolutional Neural Networks",
        tagline: "High-accuracy real-time feature extraction and image classification on complex noisy sensory data.",
        description: "Built using PyTorch and OpenCV, Neural Cipher processes real-time image feeds to identify multi-class visual objects under severe noise, lighting changes, and distortions. Implements custom residual blocks and spatial attention layers, achieving 98.7% test accuracy.",
        tech: ["Python", "PyTorch", "OpenCV", "NumPy", "FastAPI", "Docker"],
        github: "https://github.com/AdityaJinu11",
        live: "https://github.com/AdityaJinu11",
        demoType: "cv-matrix",
        badge: "★ TOP RATED TAPE"
      },
      'hawkins-predictor': {
        title: "HAWKINS PREDICTOR: Time-Series Anomaly Engine",
        category: "Machine Learning • Predictive Analytics",
        tagline: "Turning volatile multidimensional data streams into reliable predictive trends.",
        description: "An end-to-end intelligent data analytics engine designed to forecast trends and flag anomalous spikes in dynamic datasets. Utilizes ensemble regression models, automated feature engineering, and robust time-series decomposition to provide actionable forecasts.",
        tech: ["Python", "Scikit-Learn", "Pandas", "Matplotlib", "Streamlit"],
        github: "https://github.com/AdityaJinu11",
        live: "https://github.com/AdityaJinu11",
        demoType: "graph-stream",
        badge: "NEW RELEASE"
      },
      'algo-arcade': {
        title: "ALGO-ARCADE: Interactive Algorithm Visualizer",
        category: "Core CSE • Systems & Algorithms",
        tagline: "Visual simulation of graph traversals, pathfinding heuristics, and sorting mechanics.",
        description: "An interactive educational playground breaking down complex Data Structures and Algorithms into intuitive visual steps. Features Dijkstra, A* search, quicksort, and binary tree balancing with adjustable playback speed and step-by-step state inspection.",
        tech: ["JavaScript (ES6+)", "Canvas 2D", "CSS3 3D", "Algorithms"],
        github: "https://github.com/AdityaJinu11",
        live: "https://github.com/AdityaJinu11",
        demoType: "algorithm-canvas",
        badge: "STAFF PICK"
      },
      'synth-mind': {
        title: "SYNTH-MIND: Multimodal AI & Agent Orchestrator",
        category: "Generative AI • LLM Pipelines",
        tagline: "Intelligent agent pipeline combining LLM reasoning, structured tools, and knowledge retrieval.",
        description: "A generative AI pipeline exploring autonomous task execution and retrieval-augmented generation (RAG). Synthesizes natural language instructions into concrete Python code execution, API calls, and structured JSON schemas with safety guardrails.",
        tech: ["Python", "LangChain", "Vector DB", "Transformers", "REST APIs"],
        github: "https://github.com/AdityaJinu11",
        live: "https://github.com/AdityaJinu11",
        demoType: "agent-terminal",
        badge: "HAWKINS LAB CLASSIFIED"
      }
    };

    this.init();
  }

  init() {
    this.tapes.forEach((tape) => {
      tape.addEventListener('click', (e) => {
        const projectId = tape.getAttribute('data-project');
        this.loadTapeIntoVcr(tape, projectId);
      });
    });

    if (this.crtCloseBtn) {
      this.crtCloseBtn.addEventListener('click', () => this.ejectTape());
    }

    // Close on backdrop or Escape key
    if (this.crtModal) {
      this.crtModal.addEventListener('click', (e) => {
        if (e.target === this.crtModal) this.ejectTape();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.crtModal && this.crtModal.classList.contains('active')) {
        this.ejectTape();
      }
    });

    // Tracking toggle button inside CRT
    const trackingBtn = document.getElementById('crt-tracking-btn');
    if (trackingBtn) {
      trackingBtn.addEventListener('click', () => {
        const crtScreen = document.querySelector('.crt-screen-frame');
        if (crtScreen) {
          crtScreen.classList.toggle('tracking-glitch');
          if (window.hawkinsAudio) window.hawkinsAudio.playCoinSound();
        }
      });
    }
  }

  loadTapeIntoVcr(tapeElement, projectId) {
    if (this.activeTape) return;
    this.activeTape = tapeElement;

    const data = this.projectsData[projectId];
    if (!data) return;

    // 1. Tape pull-off animation
    tapeElement.classList.add('tape-ejected');

    // 2. Play mechanical VCR sound
    if (window.hawkinsAudio) {
      window.hawkinsAudio.playVcrInsert();
    }

    // 3. Update VCR status display
    if (this.vcrStatus) {
      this.vcrStatus.textContent = 'LOADING TAPE...';
      this.vcrStatus.classList.add('blink-text');
    }

    // 4. Reveal CRT TV Modal after insertion
    setTimeout(() => {
      this.renderCrtContent(data);
      if (this.crtModal) {
        this.crtModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      if (this.vcrStatus) {
        this.vcrStatus.textContent = 'PLAY ▶ 00:00:01';
        this.vcrStatus.classList.remove('blink-text');
      }
    }, 600);
  }

  renderCrtContent(data) {
    if (this.crtTitle) this.crtTitle.textContent = data.title;
    if (this.crtCategory) this.crtCategory.textContent = `${data.category} • [${data.badge}]`;
    if (this.crtDescription) {
      this.crtDescription.innerHTML = `<p class="crt-tagline">"${data.tagline}"</p><p class="crt-body">${data.description}</p>`;
    }

    if (this.crtTechList) {
      this.crtTechList.innerHTML = data.tech
        .map((t) => `<span class="crt-chip">${t}</span>`)
        .join('');
    }

    if (this.crtGithubBtn) this.crtGithubBtn.href = data.github;
    if (this.crtLiveBtn) this.crtLiveBtn.href = data.live;

    // Render interactive simulation demo in CRT display
    if (this.crtScreenContent) {
      this.renderDemoVisual(data.demoType);
    }
  }

  renderDemoVisual(type) {
    if (!this.crtScreenContent) return;

    if (type === 'cv-matrix') {
      this.crtScreenContent.innerHTML = `
        <div class="crt-sim-box">
          <div class="cv-radar-header">
            <span class="radar-dot"></span> NEURAL VISION TENSOR FEED • ADITYA JINU
          </div>
          <div class="cv-bounding-container">
            <div class="cv-grid-lines"></div>
            <div class="cv-target-box">
              <span class="cv-target-label">OBJECT DETECTED: FEATURE_VECTOR_98 [98.7% CONFIDENCE]</span>
            </div>
            <div class="cv-telemetry-row">
              <span>INPUT: [3, 224, 224]</span>
              <span>LATENCY: 14.2ms</span>
              <span>LOSS: 0.0124</span>
              <span>EPOCH: 120/120</span>
            </div>
          </div>
        </div>
      `;
    } else if (type === 'graph-stream') {
      this.crtScreenContent.innerHTML = `
        <div class="crt-sim-box">
          <div class="cv-radar-header">
            <span class="radar-dot"></span> TIME-SERIES PREDICTOR STREAM • REAL-TIME TELEMETRY
          </div>
          <div class="predictor-chart-mock">
            <div class="chart-bars">
              <div class="bar" style="height: 45%;"></div>
              <div class="bar" style="height: 62%;"></div>
              <div class="bar" style="height: 55%;"></div>
              <div class="bar" style="height: 78%;"></div>
              <div class="bar alert-bar" style="height: 94%;"><span class="bar-pulse">ANOMALY</span></div>
              <div class="bar" style="height: 80%;"></div>
              <div class="bar" style="height: 68%;"></div>
              <div class="bar" style="height: 85%;"></div>
              <div class="bar forecast-bar" style="height: 90%;"><span>FORECAST</span></div>
            </div>
            <div class="chart-legend">
              <span>HISTORICAL SIGNALS</span> • <span class="highlight-warn">HAWKINS ANOMALY DETECTED</span> • <span class="highlight-cyan">PREDICTIVE CONVERGENCE</span>
            </div>
          </div>
        </div>
      `;
    } else if (type === 'algorithm-canvas') {
      this.crtScreenContent.innerHTML = `
        <div class="crt-sim-box">
          <div class="cv-radar-header">
            <span class="radar-dot"></span> GRAPH PATHFINDING & HEURISTIC ENGINE (A* SEARCH)
          </div>
          <div class="algo-nodes-network">
            <div class="algo-node start-node">START (S)</div>
            <div class="algo-connector active"></div>
            <div class="algo-node visited-node">NODE A</div>
            <div class="algo-connector active"></div>
            <div class="algo-node visited-node">NODE B</div>
            <div class="algo-connector active"></div>
            <div class="algo-node target-node">TARGET (T)</div>
          </div>
          <div class="algo-stats-row">
            <span>COST f(n) = g(n) + h(n): 14.8</span>
            <span>SHORTEST PATH FOUND IN 4 STEPS</span>
          </div>
        </div>
      `;
    } else {
      this.crtScreenContent.innerHTML = `
        <div class="crt-sim-box">
          <div class="cv-radar-header">
            <span class="radar-dot"></span> MULTIMODAL AGENT REASONING CORE
          </div>
          <div class="agent-terminal-logs">
            <p><span class="log-prompt">&gt; USER QUERY:</span> Analyze anomalous Hawkins energy flux.</p>
            <p><span class="log-info">[PLANNING]</span> Initializing semantic retrieval across 12,000 vector records...</p>
            <p><span class="log-info">[TOOL CALL]</span> Executing HawkinsLabAPI.fetch_sensor_matrix(id="H-11")</p>
            <p><span class="log-success">[SUCCESS]</span> Anomaly localized at coordinates (41.8781, -87.6298). Pipeline executed safely.</p>
          </div>
        </div>
      `;
    }
  }

  ejectTape() {
    if (this.crtModal) {
      this.crtModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (this.activeTape) {
      this.activeTape.classList.remove('tape-ejected');
      this.activeTape = null;
    }

    if (this.vcrStatus) {
      this.vcrStatus.textContent = 'READY • SELECT TAPE';
      this.vcrStatus.classList.remove('blink-text');
    }

    if (window.hawkinsAudio) {
      window.hawkinsAudio.playCoinSound();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.familyVideo = new FamilyVideoStore();
});
