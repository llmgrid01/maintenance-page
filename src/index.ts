export default {
  async fetch(request): Promise<Response> {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>API Gateway - Maintenance Mode</title>
  <meta name="description" content="The LLMGrid API Gateway is currently undergoing scheduled maintenance. We'll be back shortly." />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Outfit:wght@500;700&display=swap" rel="stylesheet" />

  <style>
    :root {
      --bg-color: #030712;
      --text-primary: #ffffff;
      --text-secondary: #94a3b8;
      --accent-color: #6366f1;
      --accent-glow: #818cf8;
      --glass-bg: rgba(17, 24, 39, 0.7);
      --glass-border: rgba(255, 255, 255, 0.1);
      --font-main: 'Inter', sans-serif;
      --font-display: 'Outfit', sans-serif;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background-color: var(--bg-color);
      color: var(--text-primary);
      font-family: var(--font-main);
      height: 100vh;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }

    #bg-canvas {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      z-index: 0;
    }

    .overlay {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: radial-gradient(circle at center, transparent 0%, var(--bg-color) 100%);
      z-index: 1;
      pointer-events: none;
    }

    .container {
      position: relative;
      z-index: 10;
      padding: 2rem;
      width: 100%;
      max-width: 600px;
    }

    .glass-card {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 24px;
      padding: 3rem;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5),
                  0 0 100px -20px rgba(99, 102, 241, 0.1);
      animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      transform: translateY(20px);
      opacity: 0;
      position: relative;
      overflow: hidden;
    }

    .glass-card::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 24px;
      padding: 1px;
      background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05));
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }

    .status-indicator {
      position: relative;
      width: 16px;
      height: 16px;
      margin: 0 auto 2rem;
    }

    .status-dot {
      width: 12px;
      height: 12px;
      background-color: #fbbf24;
      border-radius: 50%;
      position: absolute;
      top: 2px;
      left: 2px;
      box-shadow: 0 0 10px #fbbf24;
    }

    .pulse-ring {
      position: absolute;
      top: -4px;
      left: -4px;
      width: 24px;
      height: 24px;
      border: 2px solid #fbbf24;
      border-radius: 50%;
      animation: pulse 2s infinite;
      opacity: 0;
    }

    header h1 {
      font-family: var(--font-display);
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      letter-spacing: -0.02em;
      background: linear-gradient(to right, #fff, #a5b4fc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      position: relative;
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: 1.125rem;
      margin-bottom: 2rem;
    }

    .content p {
      color: #cbd5e1;
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .progress-container {
      margin-bottom: 2.5rem;
      text-align: left;
    }

    .progress-bar {
      height: 6px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 0.75rem;
      position: relative;
    }

    .progress-fill {
      height: 100%;
      width: 60%;
      background: linear-gradient(90deg, var(--accent-color), #a5b4fc);
      border-radius: 3px;
      position: relative;
      animation: shimmer 2s linear infinite;
    }

    .progress-fill::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transform: translateX(-100%);
      animation: shimmer-slide 2s infinite;
    }

    .progress-text {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-family: var(--font-display);
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .action-area {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-bottom: 2.5rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      position: relative;
      overflow: hidden;
      border: none;
      font-family: var(--font-main);
    }

    .btn.secondary {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-primary);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .btn.secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }

    footer {
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    footer p { font-size: 0.875rem; color: var(--text-secondary); }

    .links {
      display: flex;
      justify-content: center;
      gap: 0.75rem;
      align-items: center;
    }

    .links a {
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.875rem;
      transition: color 0.2s;
    }

    .links a:hover { color: var(--text-primary); }

    .separator { color: rgba(255, 255, 255, 0.2); }

    @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
    @keyframes pulse { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(3); opacity: 0; } }
    @keyframes shimmer-slide { 100% { transform: translateX(100%); } }

    @media (max-width: 640px) {
      header h1 { font-size: 2rem; }
      .glass-card { padding: 2rem; }
      .action-area { flex-direction: column; }
      .btn { width: 100%; }
    }
  </style>
</head>

<body>
  <canvas id="bg-canvas"></canvas>
  <div class="overlay"></div>

  <main class="container">
    <div class="glass-card">
      <div class="status-indicator">
        <div class="pulse-ring"></div>
        <div class="status-dot"></div>
      </div>

      <header>
        <h1 class="glitch" data-text="System Maintenance">System Maintenance</h1>
        <p class="subtitle">API Gateway is currently offline for upgrades</p>
      </header>

      <div class="content">
        <p>
          We're optimizing the neural pathways of LLMGrid.
          Services will resume shortly. Thank you for your patience.
        </p>

        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
          <span class="progress-text">System optimization in progress...</span>
        </div>

        <div class="action-area">
          <a href="mailto:support@llmgrid.ai" class="btn secondary">Contact Support</a>
        </div>
      </div>

      <footer>
        <p>&copy; 2025 LLMGrid. All systems secure.</p>
        <div class="links">
          <a href="#">Status Page</a>
          <span class="separator">•</span>
          <a href="#">Twitter</a>
        </div>
      </footer>
    </div>
  </main>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const canvas = document.getElementById('bg-canvas');
      const ctx = canvas.getContext('2d');

      let width, height;
      let particles = [];

      const particleCount = 60;
      const connectionDistance = 150;
      const mouseDistance = 200;

      const mouse = { x: null, y: null };

      class Particle {
        constructor() {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.vx = (Math.random() - 0.5) * 0.5;
          this.vy = (Math.random() - 0.5) * 0.5;
          this.size = Math.random() * 2 + 1;
          this.color = \`rgba(99, 102, 241, \${Math.random() * 0.3 + 0.1})\`;
        }

        update() {
          this.x += this.vx;
          this.y += this.vy;

          if (this.x < 0 || this.x > width) this.vx *= -1;
          if (this.y < 0 || this.y > height) this.vy *= -1;

          if (mouse.x) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouseDistance) {
              const forceDirectionX = dx / distance;
              const forceDirectionY = dy / distance;
              const force = (mouseDistance - distance) / mouseDistance;
              const directionX = forceDirectionX * force * 0.05;
              const directionY = forceDirectionY * force * 0.05;

              this.vx += directionX;
              this.vy += directionY;
            }
          }
        }

        draw() {
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
      }

      function init() {
        resize();
        particles = [];
        for (let i = 0; i < particleCount; i++) particles.push(new Particle());
      }

      function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw();

          for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
              ctx.beginPath();
              ctx.strokeStyle = \`rgba(99, 102, 241, \${0.1 - (distance / connectionDistance) * 0.1})\`;
              ctx.lineWidth = 1;
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }

        requestAnimationFrame(animate);
      }

      window.addEventListener('resize', () => init());

      window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
      });

      window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
      });

      init();
      animate();
    });
  </script>
</body>
</html>`;

    return new Response(html, {
      headers: { "content-type": "text/html;charset=UTF-8" },
    });
  },
} satisfies ExportedHandler;
