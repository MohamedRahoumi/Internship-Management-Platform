import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const OcpLogo = () => (
  <img src="/ocp.svg" alt="OCP Group" style={{ height: 32, width: 'auto' }} />
);

const Welcome = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.fade');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const d = parseInt(el.getAttribute('data-delay') || '0', 10);
            setTimeout(() => el.classList.add('visible'), d);
            observer.unobserve(el);
          }
        });
      },
      { rootMargin: '-60px', threshold: 0.01 }
    );
    els.forEach((el) => {
      if (!el.hasAttribute('data-immediate')) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll('.fade[data-immediate]');
    els.forEach((el) => {
      const d = parseInt(el.getAttribute('data-delay') || '0', 10);
      setTimeout(() => el.classList.add('visible'), 80 + d);
    });
  }, []);

  useEffect(() => {
    const wrap = document.getElementById('bar-others');
    if (wrap) {
      for (let i = 0; i < 12; i++) {
        const bar = document.createElement('span');
        const h = 25 + Math.round((Math.sin(i * 1.3) * 0.5 + 0.5) * 65);
        bar.style.height = h + '%';
        bar.style.background = i === 4 ? 'var(--ocp-green)' : '#d1d5db';
        wrap.appendChild(bar);
      }
    }
    const wrap2 = document.getElementById('bar-bills');
    if (wrap2) {
      for (let i = 0; i < 12; i++) {
        const bar = document.createElement('span');
        const h = 25 + Math.round((Math.sin(i * 1.3) * 0.5 + 0.5) * 65);
        bar.style.height = h + '%';
        bar.style.background = i === 6 ? 'var(--dark-green)' : 'rgba(0,132,61,0.15)';
        wrap2.appendChild(bar);
      }
    }
  }, []);

  useEffect(() => {
    const video = document.getElementById('bm-video');
    const canvas = document.getElementById('bm-canvas');
    if (!video || !canvas) return;
    const ctx = canvas.getContext('2d');
    const frames = [];
    const MAX_W = 960;
    let capturing = true;
    let cw = 0, ch = 0;

    const setSize = () => {
      if (!video.videoWidth) return;
      const scale = Math.min(1, MAX_W / video.videoWidth);
      cw = Math.round(video.videoWidth * scale);
      ch = Math.round(video.videoHeight * scale);
    };

    const captureFrame = () => {
      if (!capturing || !cw) return;
      const off = document.createElement('canvas');
      off.width = cw; off.height = ch;
      try {
        off.getContext('2d').drawImage(video, 0, 0, cw, ch);
        frames.push(off);
      } catch (e) {}
    };

    const onFrame = () => {
      captureFrame();
      if (capturing && 'requestVideoFrameCallback' in video) {
        video.requestVideoFrameCallback(onFrame);
      }
    };

    video.addEventListener('loadedmetadata', () => {
      setSize();
      canvas.width = cw;
      canvas.height = ch;
    });

    video.addEventListener('play', () => {
      if ('requestVideoFrameCallback' in video) {
        video.videoWidth && setSize();
        video.requestVideoFrameCallback(onFrame);
      } else {
        (function rafLoop() {
          if (!capturing) return;
          captureFrame();
          requestAnimationFrame(rafLoop);
        })();
      }
    });

    video.addEventListener('ended', () => {
      capturing = false;
      if (frames.length < 2) return;
      video.style.display = 'none';
      canvas.style.display = 'block';
      let idx = 0, dir = 1, last = 0;
      const interval = 1000 / 30;
      function loop(ts) {
        if (ts - last >= interval) {
          last = ts;
          ctx.drawImage(frames[idx], 0, 0);
          idx += dir;
          if (idx >= frames.length - 1) { idx = frames.length - 1; dir = -1; }
          else if (idx <= 0) { idx = 0; dir = 1; }
        }
        requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);
    });

    const p = video.play();
    if (p && p.catch) p.catch(() => {});

    return () => { capturing = false; };
  }, []);

  return (
    <>
      <style>{`
        :root {
          --dark-green: #02421D;
          --ocp-green: #00843D;
          --hover-green: #015F2A;
          --mint-light: #F4F9F5;
          --cream: #FFFFFF;
          --beige-card: #EAF3EE;
          --beige-inner: #F1F8F4;
          --stone-500: #6b7280;
          --stone-600: #4b5563;
          --stone-700: #374151;
          --stone-800: #1f2937;
          --stone-200: #e5e7eb;
          --gold-accent: #D29F13;
          --ease: cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { overflow-x: hidden; }
        body {
          font-family: 'Inter', -apple-system, system-ui, sans-serif;
          color: var(--stone-800);
          background: #fff;
        }
        .font-cooper { font-family: 'Cooper BT W01 Light', 'Georgia', serif; }
        .font-cooper-medium {
          font-family: 'Cooper BT W01 Medium', 'Cooper BT W01 Light', 'Georgia', serif;
          font-weight: 500;
        }
        img, svg, canvas, video { display: block; }
        button { font: inherit; cursor: pointer; border: none; background: none; color: inherit; }
        a { text-decoration: none; color: inherit; }
        .fade {
          opacity: 0;
          transform: translateY(24px);
          filter: blur(8px);
          transition: opacity 0.7s var(--ease), transform 0.7s var(--ease), filter 0.7s var(--ease);
        }
        .fade.visible {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0px);
        }
        .btn-dark {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--dark-green); color: #fff;
          font-size: 0.875rem; font-weight: 500;
          padding: 12px 24px; border-radius: 12px;
          transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-dark:hover { 
          background: var(--hover-green); 
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(2, 66, 29, 0.15);
        }
        .btn-ocp {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--ocp-green); color: #fff;
          font-size: 0.875rem; font-weight: 500;
          padding: 12px 24px; border-radius: 12px;
          transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-ocp:hover { 
          background: var(--hover-green); 
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 132, 61, 0.2);
        }
        .btn-light {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.85); backdrop-filter: blur(8px);
          color: var(--stone-800); border: 1px solid rgba(0, 132, 61, 0.15);
          font-size: 0.875rem; font-weight: 500;
          padding: 12px 24px; border-radius: 12px;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .btn-light:hover { 
          background: rgba(255,255,255,0.98); 
          transform: translateY(-1px);
          border-color: var(--ocp-green);
        }
        .hero {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          display: flex; flex-direction: column;
          background: #fff;
        }
        .boomerang-wrap {
          position: absolute; inset: 0; width: 100%; height: 100%;
          transform: scale(1.08); transform-origin: center;
          z-index: 0;
        }
        .boomerang-wrap video, .boomerang-wrap canvas {
          width: 100%; height: 100%; object-fit: cover;
        }
        .boomerang-wrap canvas { display: none; }
        .hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.65) 40%, rgba(244,249,245,0.9) 100%);
          z-index: 1;
        }
        .hero-inner {
          position: relative; z-index: 2;
          flex: 1; display: flex; flex-direction: column; justify-content: space-between;
        }
        .navbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 24px 20px;
        }
        .brand-container {
          display: flex; align-items: center; gap: 10px;
        }
        .nav-links { display: none; gap: 32px; align-items: center; }
        .nav-links a {
          position: relative; font-size: 0.9rem; color: var(--stone-700); font-weight: 500;
          transition: color 0.2s ease;
        }
        .nav-links a:hover { color: var(--ocp-green); }
        .nav-cta { display: none; }
        .hamburger { display: inline-flex; }
        .mobile-menu {
          position: absolute; top: 76px; left: 16px; right: 16px; z-index: 30;
          background: rgba(255,255,255,0.98); backdrop-filter: blur(12px);
          border-radius: 16px; box-shadow: 0 12px 40px rgba(0, 132, 61, 0.12);
          border: 1px solid rgba(0, 132, 61, 0.08);
          padding: 20px; flex-direction: column; gap: 14px; display: none;
        }
        .mobile-menu.open { display: flex; }
        .mobile-menu a { font-size: 1rem; color: var(--stone-700); padding: 8px 4px; font-weight: 500; }
        .mobile-menu a:hover { color: var(--ocp-green); }
        .hero-content {
          display: flex; flex-direction: column; align-items: center; text-align: center;
          padding: 40px 20px;
          max-width: 1200px; margin: 0 auto;
        }
        .hero-badge {
          background: rgba(0, 132, 61, 0.08); color: var(--ocp-green);
          font-size: 0.8rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.12em; padding: 6px 14px; border-radius: 99px;
          margin-bottom: 20px; display: inline-flex; align-items: center; gap: 6px;
        }
        .hero-title {
          font-size: 2.3rem; line-height: 1.15; letter-spacing: -0.03em;
          color: var(--dark-green); max-width: 58rem;
        }
        .hero-sub {
          margin-top: 18px; font-size: 0.95rem; color: var(--stone-700);
          max-width: 32rem; line-height: 1.65;
        }
        .hero-ctas { display: flex; flex-direction: column; gap: 14px; margin-top: 28px; width: 100%; max-width: 400px; justify-content: center; }
        .cards-row {
          display: flex; align-items: flex-end; justify-content: center; gap: 12px;
          padding: 0 16px 48px;
        }
        .dash-card {
          background: rgba(255,255,255,0.96); backdrop-filter: blur(12px);
          border-radius: 18px; box-shadow: 0 20px 60px rgba(2,66,29,0.08);
          border: 1px solid rgba(0, 132, 61, 0.06);
          padding: 20px;
        }
        .card-outer { display: none; }
        .card-savings { width: 12rem; }
        .card-others { width: 12rem; }
        .card-bills { width: 12rem; }
        .pill-dd {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 0.72rem; color: var(--ocp-green); font-weight: 600;
          background: rgba(0, 132, 61, 0.06); border-radius: 9999px; padding: 4px 10px;
        }
        .badge-green {
          font-size: 0.72rem; font-weight: 600; color: #059669;
          background: #e6fbf2; border-radius: 9999px; padding: 4px 10px;
        }
        .badge-red {
          font-size: 0.72rem; font-weight: 600; color: var(--ocp-green);
          background: rgba(0, 132, 61, 0.08); border-radius: 9999px; padding: 4px 10px;
        }
        .card-label { font-size: 0.85rem; font-weight: 700; color: var(--dark-green); }
        .card-main-val { font-size: 1.5rem; font-weight: 800; color: var(--dark-green); margin: 6px 0 2px; }
        .stat-row { display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--stone-600); margin: 6px 0; }
        .stat-row b { color: var(--dark-green); }
        .barchart { display: flex; align-items: flex-end; gap: 4px; height: 50px; margin-top: 12px; }
        .barchart span { flex: 1; border-radius: 3px 3px 0 0; transition: height 1s ease; }
        .months { display: flex; justify-content: space-between; font-size: 0.65rem; color: var(--stone-500); margin-top: 8px; }
        .section-white { background: #FFFFFF; padding: 72px 20px; }
        .section-cream { background: var(--mint-light); padding: 72px 20px; }
        .container { max-width: 80rem; margin: 0 auto; }
        .sec-badge {
          display: inline-block; background: rgba(0,132,61,0.08); color: var(--ocp-green);
          font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.1em; padding: 5px 12px; border-radius: 6px; margin-bottom: 16px;
        }
        .testimonial-grid {
          display: grid; grid-template-columns: 1fr; gap: 48px; align-items: center;
        }
        .t-heading {
          font-size: 1.85rem; line-height: 1.25; color: var(--dark-green); margin-bottom: 24px;
        }
        .quote {
          color: var(--stone-700); font-size: 1.1rem; line-height: 1.7; margin-bottom: 24px;
        }
        .about-points {
          display: grid; grid-template-columns: 1fr; gap: 20px; margin-bottom: 30px;
        }
        .about-point {
          display: flex; gap: 14px; align-items: flex-start;
        }
        .about-point-icon {
          width: 40px; height: 40px; border-radius: 10px; background: rgba(0, 132, 61, 0.08);
          display: flex; align-items: center; justify-content: center; color: var(--ocp-green); flex-shrink: 0;
        }
        .about-point-title { font-size: 0.95rem; font-weight: 700; color: var(--dark-green); margin-bottom: 4px; }
        .about-point-desc { font-size: 0.85rem; color: var(--stone-600); line-height: 1.5; }
        .t-video-wrap { position: relative; width: 100%; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(2,66,29,0.12); }
        .t-video-wrap video { width: 100%; border-radius: 20px; object-fit: cover; aspect-ratio: 1 / 1; }
        .features-header {
          display: flex; flex-direction: column; gap: 16px; align-items: flex-start;
          justify-content: space-between; margin-bottom: 44px;
        }
        .f-heading { font-size: 1.85rem; line-height: 1.25; color: var(--dark-green); }
        .cards-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        .feature-card {
          position: relative; aspect-ratio: 3 / 4; border-radius: 20px; overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(2,66,29,0.12);
        }
        .feature-card .bg-img {
          position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.5s ease;
        }
        .feature-card:hover .bg-img { transform: scale(1.05); }
        .feature-card .overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(2,42,19,0.92) 0%, rgba(2,42,19,0.4) 50%, rgba(2,42,19,0.1) 100%);
          z-index: 1;
        }
        .feature-card .top-label {
          position: absolute; top: 24px; left: 24px; right: 24px; z-index: 2;
          display: flex; align-items: center; gap: 10px;
          color: #fff; font-size: 0.95rem; font-weight: 600;
        }
        .feature-card .top-label-badge {
          background: var(--ocp-green); color: white; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700;
        }
        .feature-card .bottom-text {
          position: absolute; bottom: 24px; left: 24px; right: 24px; z-index: 2;
          color: rgba(255,255,255,0.95);
        }
        .feature-card .bottom-text h3 { font-size: 1.2rem; font-weight: 700; margin-bottom: 8px; color: #fff; }
        .feature-card .bottom-text p { font-size: 0.85rem; line-height: 1.5; color: rgba(255,255,255,0.75); }
        .insight-card {
          position: relative; aspect-ratio: 3 / 4; border-radius: 20px; overflow: hidden;
          background: var(--beige-card); padding: 24px;
          display: flex; flex-direction: column; justify-content: space-between;
          border: 1px solid rgba(0, 132, 61, 0.08);
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .insight-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(2,66,29,0.08);
        }
        .insight-card .top-label {
          display: flex; align-items: center; justify-content: space-between;
          color: var(--dark-green); font-size: 0.95rem; font-weight: 700;
        }
        .insight-inner {
          background: var(--beige-inner); border-radius: 18px; padding: 20px;
          flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
          margin: 16px 0 0;
        }
        .insight-inner .ititle { font-size: 0.95rem; font-weight: 700; color: var(--dark-green); }
        .insight-inner .isub { font-size: 0.75rem; color: var(--stone-500); margin-bottom: 14px; }
        .donut-wrap { position: relative; width: 130px; height: 130px; }
        .donut-wrap svg { transform: rotate(-90deg); width: 100%; height: 100%; }
        .donut-center {
          position: absolute; inset: 0; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
        }
        .donut-center .pct { font-size: 1.4rem; font-weight: 800; color: var(--dark-green); }
        .donut-center .lbl { font-size: 0.7rem; color: var(--stone-500); font-weight: 500; }
        .custom-tutor-list {
          width: 100%; display: flex; flex-direction: column; gap: 8px; margin-top: 10px;
        }
        .tutor-item {
          display: flex; align-items: center; justify-content: space-between;
          background: white; padding: 8px 12px; border-radius: 10px; font-size: 0.75rem;
          border: 1px solid rgba(0,132,61,0.05);
        }
        .tutor-name { font-weight: 600; color: var(--dark-green); }
        .tutor-tag { background: #e6fbf2; color: #059669; font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; font-weight: bold; }
        .step-track-list {
          width: 100%; display: flex; flex-direction: column; gap: 10px; margin-top: 12px;
        }
        .step-track-item {
          display: flex; align-items: center; gap: 10px; font-size: 0.8rem;
        }
        .step-track-dot {
          width: 20px; height: 20px; border-radius: 50%; background: var(--stone-200);
          display: flex; align-items: center; justify-content: center; color: white; font-size: 0.65rem; font-weight: bold;
        }
        .step-track-dot.active { background: var(--ocp-green); }
        .step-track-dot.completed { background: var(--dark-green); }
        .step-track-text { color: var(--stone-600); }
        .step-track-text.active { color: var(--dark-green); font-weight: 600; }
        .stats-container {
          display: grid; grid-template-columns: 1fr; gap: 32px; margin-top: 32px;
        }
        .stats-nav {
          display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; justify-content: center;
        }
        .stats-tab-btn {
          padding: 10px 20px; border-radius: 10px; border: 1px solid rgba(0, 132, 61, 0.15);
          font-size: 0.9rem; font-weight: 600; color: var(--stone-700); background: white;
          transition: all 0.2s ease;
        }
        .stats-tab-btn.active {
          background: var(--dark-green); color: white; border-color: var(--dark-green);
          box-shadow: 0 4px 12px rgba(2, 66, 29, 0.15);
        }
        .stats-tab-btn:hover:not(.active) {
          background: var(--mint-light); border-color: var(--ocp-green);
        }
        .stats-display {
          background: white; border-radius: 24px; border: 1px solid rgba(0, 132, 61, 0.08);
          box-shadow: 0 15px 45px rgba(2,66,29,0.04); padding: 24px; min-height: 380px;
          display: flex; flex-direction: column; justify-content: center;
        }
        .stats-content { display: none; width: 100%; height: 100%; }
        .stats-content.active { display: block; animation: fadeIn 0.4s ease forwards; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .chart-layout-split {
          display: grid; grid-template-columns: 1fr; gap: 24px; align-items: center;
        }
        .chart-panel-text h4 { font-size: 1.35rem; color: var(--dark-green); margin-bottom: 12px; font-weight: 700; }
        .chart-panel-text p { font-size: 0.9rem; color: var(--stone-600); line-height: 1.6; margin-bottom: 20px; }
        .chart-legend-list { display: flex; flex-direction: column; gap: 12px; }
        .chart-legend-item { display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; color: var(--stone-700); }
        .chart-legend-label { display: flex; align-items: center; gap: 8px; }
        .chart-legend-color { width: 12px; height: 12px; border-radius: 3px; }
        .chart-legend-item b { color: var(--dark-green); }
        .svg-chart-wrap {
          display: flex; justify-content: center; align-items: center; width: 100%; max-width: 320px; margin: 0 auto;
        }
        .bar-chart-v {
          display: flex; align-items: flex-end; justify-content: space-around; height: 220px; width: 100%; padding-top: 20px;
        }
        .bar-col-v {
          display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 1;
        }
        .bar-v-container {
          height: 180px; width: 28px; background: #eaf3ee; border-radius: 6px; display: flex; align-items: flex-end; overflow: hidden;
          position: relative;
        }
        .bar-v-fill {
          width: 100%; background: var(--ocp-green); border-radius: 4px; transition: height 1s var(--ease);
          position: relative; cursor: pointer;
        }
        .bar-v-fill:hover { background: var(--dark-green); }
        .bar-v-fill::after {
          content: attr(data-val); position: absolute; top: -28px; left: 50%; transform: translateX(-50%);
          background: var(--stone-800); color: white; font-size: 0.65rem; padding: 2px 5px; border-radius: 4px;
          opacity: 0; pointer-events: none; transition: opacity 0.2s ease; font-weight: bold; white-space: nowrap;
        }
        .bar-v-fill:hover::after { opacity: 1; }
        .bar-v-label { font-size: 0.72rem; font-weight: 600; color: var(--stone-700); }
        .proc-grid {
          display: grid; grid-template-columns: 1fr; gap: 24px; position: relative; margin-top: 32px;
        }
        .proc-step-card {
          background: white; border-radius: 20px; padding: 28px; border: 1px solid rgba(0, 132, 61, 0.08);
          box-shadow: 0 10px 30px rgba(0,0,0,0.02); position: relative;
          transition: all 0.3s ease;
        }
        .proc-step-card:hover {
          transform: translateY(-3px); border-color: var(--ocp-green);
          box-shadow: 0 15px 45px rgba(0,132,61,0.06);
        }
        .proc-badge {
          position: absolute; top: 24px; right: 28px; font-size: 2rem; font-weight: 800; color: rgba(0, 132, 61, 0.08);
          font-family: 'Cooper BT W01 Medium', serif; line-height: 1;
        }
        .proc-step-card:hover .proc-badge { color: rgba(0, 132, 61, 0.16); }
        .proc-icon-wrap {
          width: 52px; height: 52px; border-radius: 14px; background: rgba(0,132,61,0.08);
          display: flex; align-items: center; justify-content: center; color: var(--ocp-green); margin-bottom: 20px;
        }
        .proc-step-card:hover .proc-icon-wrap { background: var(--ocp-green); color: white; }
        .proc-title { font-size: 1.15rem; font-weight: 700; color: var(--dark-green); margin-bottom: 10px; }
        .proc-desc { font-size: 0.88rem; color: var(--stone-600); line-height: 1.55; }
        .t-cards-grid {
          display: grid; grid-template-columns: 1fr; gap: 24px; margin-top: 32px;
        }
        .t-card {
          background: white; border-radius: 20px; padding: 28px; border: 1px solid rgba(0, 132, 61, 0.06);
          box-shadow: 0 12px 35px rgba(2,66,29,0.03); display: flex; flex-direction: column; justify-content: space-between;
          transition: transform 0.3s ease;
        }
        .t-card:hover { transform: translateY(-3px); }
        .t-card-quote {
          font-size: 0.95rem; line-height: 1.65; color: var(--stone-700); font-style: italic; margin-bottom: 24px;
        }
        .t-card-footer {
          display: flex; align-items: center; gap: 14px;
        }
        .t-card-avatar {
          width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, var(--ocp-green) 0%, var(--dark-green) 100%);
          display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 1rem;
          border: 2px solid white; box-shadow: 0 4px 10px rgba(0,132,61,0.15);
        }
        .t-card-info h5 { font-size: 0.9rem; font-weight: 700; color: var(--dark-green); }
        .t-card-info p { font-size: 0.75rem; color: var(--stone-500); font-weight: 500; }
        .rating-stars { display: flex; gap: 4px; color: var(--gold-accent); margin-bottom: 12px; }
        .cta-section {
          background: linear-gradient(135deg, var(--dark-green) 0%, #013115 100%);
          color: white; padding: 80px 20px; border-radius: 0; position: relative; overflow: hidden;
        }
        .cta-pattern {
          position: absolute; inset: 0; opacity: 0.05; pointer-events: none;
          background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0);
          background-size: 24px 24px;
        }
        .cta-inner {
          max-width: 54rem; margin: 0 auto; text-align: center; position: relative; z-index: 2;
        }
        .cta-title { font-size: 2rem; line-height: 1.15; color: white; margin-bottom: 16px; }
        .cta-desc { font-size: 1rem; color: rgba(255,255,255,0.8); max-width: 32rem; margin: 0 auto 36px; line-height: 1.6; }
        .cta-btns { display: flex; flex-direction: column; gap: 14px; justify-content: center; align-items: center; }
        .btn-cta {
          display: inline-flex; align-items: center; justify-content: center; gap: 10px; width: 100%; max-width: 280px;
          padding: 14px 28px; border-radius: 12px; font-weight: 600; font-size: 0.95rem; transition: all 0.2s ease;
        }
        .btn-cta-primary { background: white; color: var(--dark-green); }
        .btn-cta-primary:hover { background: var(--mint-light); transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0,0,0,0.15); }
        .btn-cta-secondary { background: rgba(255,255,255,0.08); color: white; border: 1px solid rgba(255,255,255,0.2); }
        .btn-cta-secondary:hover { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.4); transform: translateY(-2px); }
        .footer {
          background: #01220e; color: rgba(255,255,255,0.6); padding: 48px 20px 24px; font-size: 0.85rem;
        }
        .footer-grid {
          max-width: 80rem; margin: 0 auto 32px; display: grid; grid-template-columns: 1fr; gap: 32px;
        }
        .footer-col h6 { color: white; font-size: 0.9rem; font-weight: 700; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.05em; }
        .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .footer-col a { transition: color 0.2s ease; }
        .footer-col a:hover { color: white; }
        .footer-bottom {
          max-width: 80rem; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; align-items: center; justify-content: space-between;
          border-top: 1px solid rgba(255,255,255,0.08); padding-top: 24px;
        }
        @media (min-width: 640px) {
          .navbar { padding: 24px 40px; }
          .hero-content { padding: 56px 40px; }
          .hero-title { font-size: 3.2rem; }
          .hero-sub { font-size: 1.05rem; max-width: 32rem; }
          .hero-ctas { flex-direction: row; width: auto; max-width: none; }
          .cards-row { gap: 16px; }
          .card-outer { display: block; }
          .card-savings { width: 15rem; }
          .card-others { width: 17rem; }
          .card-bills { width: 15rem; }
          .barchart { height: 60px; }
          .section-white { padding: 88px 40px; }
          .section-cream { padding: 88px 40px; }
          .t-heading { font-size: 2.25rem; }
          .quote { font-size: 1.25rem; }
          .about-points { grid-template-columns: 1fr 1fr; }
          .t-video-wrap { max-width: 100%; }
          .f-heading { font-size: 2.25rem; }
          .features-header { flex-direction: row; align-items: center; }
          .cards-grid { grid-template-columns: 1fr 1fr; }
          .stats-nav { gap: 16px; }
          .stats-display { padding: 32px; }
          .chart-layout-split { grid-template-columns: 1.2fr 1fr; gap: 32px; }
          .proc-grid { grid-template-columns: 1fr 1fr; }
          .t-cards-grid { grid-template-columns: 1fr 1fr; }
          .cta-title { font-size: 2.6rem; }
          .cta-btns { flex-direction: row; }
          .footer-grid { grid-template-columns: 2fr 1fr 1fr 1fr; }
        }
        @media (min-width: 768px) {
          .nav-links { display: flex; }
          .nav-cta { display: inline-flex; }
          .hamburger { display: none; }
          .hero-title { font-size: 3.8rem; }
          .testimonial-grid { grid-template-columns: 1.1fr 0.9fr; gap: 64px; }
          .f-heading { font-size: 2.5rem; }
          .stats-container { margin-top: 40px; }
          .proc-grid { grid-template-columns: repeat(4, 1fr); }
          .proc-grid::after {
            content: ''; position: absolute; top: 125px; left: 52px; right: 52px; height: 2px;
            background: rgba(0,132,61,0.06); z-index: 0;
          }
          .proc-step-card { z-index: 1; }
          .footer-bottom { flex-direction: row; }
        }
        @media (min-width: 1024px) {
          .navbar { padding: 24px 64px; }
          .section-white { padding: 96px 80px; }
          .section-cream { padding: 96px 80px; }
          .hero-title { font-size: 4.4rem; }
          .cards-grid { grid-template-columns: repeat(3, 1fr); }
          .t-cards-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>

      <section className="hero">
        <div className="boomerang-wrap">
          <video id="bm-video" muted playsInline crossOrigin="anonymous"
            src="https://plugin-assets.open-design.ai/plugins/evergreen-finance/hf_20260517_070729_32a7eb4e-d6e2-4571-badc-91b4dab1ecbe-2db9b1.mp4" />
          <canvas id="bm-canvas" />
        </div>
        <div className="hero-overlay" />
        <div className="hero-inner">
          <nav className="navbar fade" data-immediate>
            <div className="brand-container">
              <OcpLogo />
            </div>
            <div className="nav-links">
              <a href="#about">À propos</a>
              <a href="#features">Fonctionnalités</a>
              <a href="#stats">Statistiques</a>
              <a href="#process">Processus</a>
              <a href="#testimonials">Témoignages</a>
            </div>
            <Link to="/login" className="btn-dark nav-cta">Accéder au Portail</Link>
            <button className="hamburger" id="hamburger" aria-label="Menu"
              onClick={() => document.getElementById('mobile-menu')?.classList.toggle('open')}>
              <svg id="ic-menu" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#02421D" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div className="mobile-menu" id="mobile-menu">
              <a href="#about">À propos</a>
              <a href="#features">Fonctionnalités</a>
              <a href="#stats">Statistiques</a>
              <a href="#process">Processus</a>
              <a href="#testimonials">Témoignages</a>
              <Link to="/login" className="btn-dark" style={{ justifyContent: 'center', width: '100%' }}>Accéder au Portail</Link>
            </div>
          </nav>

          <div className="hero-content">
            <div className="hero-badge fade" data-immediate data-delay="50">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              Portail Officiel OCP Group
            </div>
            <h1 className="hero-title font-cooper fade" data-immediate data-delay="120">
              Propulsez votre avenir au cœur de l'excellence industrielle
            </h1>
            <p className="hero-sub fade" data-immediate data-delay="260">
              Rejoignez le leader mondial des phosphates. Intégrez des projets technologiques et durables d'envergure internationale avec un accompagnement d'experts de premier rang.
            </p>
            <div className="hero-ctas fade" data-immediate data-delay="400">
              <Link to="/login" className="btn-ocp">Découvrir nos offres</Link>
              <button className="btn-light" onClick={() => alert("Démo Plateforme - En cours de chargement.")}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#1f2937" stroke="#1f2937" strokeWidth="2" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                Démo Plateforme
              </button>
            </div>
          </div>

          <div className="cards-row">
            <div className="dash-card card-savings card-outer fade" data-immediate data-delay="550">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="card-label">Stages Actifs</span>
                <span className="badge-green">+12%</span>
              </div>
              <div className="card-main-val font-cooper-medium">1,240</div>
              <svg viewBox="0 0 240 70" style={{ width: '100%', height: 45, marginTop: 6 }} preserveAspectRatio="none">
                <defs><linearGradient id="savfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00843D" stopOpacity="0.3" /><stop offset="100%" stopColor="#00843D" stopOpacity="0" /></linearGradient></defs>
                <polygon points="0,55 40,40 80,45 120,25 160,30 200,10 240,15 240,70 0,70" fill="url(#savfill)" />
                <polyline points="0,55 40,40 80,45 120,25 160,30 200,10 240,15" fill="none" stroke="#00843D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="months"><span>Jan</span><span>Fév</span><span>Mar</span><span>Avr</span></div>
            </div>
            <div className="dash-card card-others fade" data-immediate data-delay="650">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="card-label">Candidatures</span>
                <span className="pill-dd">Ce Mois
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
              </div>
              <div className="card-main-val font-cooper-medium">2,854</div>
              <div className="stat-row"><span>UM6P / Ecoles Ing.</span><b>64%</b></div>
              <div className="stat-row"><span>Universités Nat.</span><b>28%</b></div>
              <div className="stat-row"><span>International</span><b>8%</b></div>
              <div className="barchart" id="bar-others" />
            </div>
            <div className="dash-card card-bills card-outer fade" data-immediate data-delay="750">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="card-label">Satisfaction</span>
                <span className="badge-red">94.5%</span>
              </div>
              <div className="card-main-val font-cooper-medium">Attestation</div>
              <div style={{ marginTop: 6, fontSize: '0.72rem', color: 'var(--stone-600)', fontWeight: 500 }}>Génération immédiate validée</div>
              <div className="barchart" id="bar-bills" />
              <div className="months"><span>Tech</span><span>R&amp;D</span><span>Mines</span><span>Digi</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-cream" id="about">
        <div className="container testimonial-grid">
          <div className="t-left">
            <span className="sec-badge">À propos</span>
            <h2 className="t-heading font-cooper-medium fade">La digitalisation intégrale du parcours de stage à l'OCP</h2>
            <p className="quote font-cooper fade" data-delay="100">
              Grâce à notre plateforme unifiée, nous réinventons la gestion des stages. Du dépôt de candidature électronique à l'évaluation finale en ligne, chaque étape est automatisée pour garantir transparence, efficacité et fluidité à tous les acteurs.
            </p>
            <div className="about-points">
              <div className="about-point fade" data-delay="200">
                <div className="about-point-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                </div>
                <div>
                  <div className="about-point-title">Zéro Papier</div>
                  <div className="about-point-desc">Conventions générées dynamiquement et validées par signature électronique en quelques minutes.</div>
                </div>
              </div>
              <div className="about-point fade" data-delay="250">
                <div className="about-point-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                </div>
                <div>
                  <div className="about-point-title">Mentorat Structuré</div>
                  <div className="about-point-desc">Mise en relation immédiate avec les parrains de stage et suivi transparent des jalons de vos travaux.</div>
                </div>
              </div>
            </div>
            <Link to="/login" className="btn-dark fade" data-delay="300">
              Rejoindre le Portail
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
          </div>
          <div className="t-right fade" data-delay="150">
            <div className="t-video-wrap">
              <video autoPlay muted loop playsInline
                src="https://plugin-assets.open-design.ai/plugins/evergreen-finance/hf_20260517_074029_c7a854bd-2d6e-4b62-96b3-ae8c16311e44-59f9be.mp4" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-white" id="features">
        <div className="container">
          <div className="features-header">
            <div>
              <span className="sec-badge">Fonctionnalités</span>
              <h2 className="f-heading font-cooper-medium fade">Des outils de pointe pour chaque acteur</h2>
            </div>
            <button className="btn-dark fade" data-delay="100" onClick={() => alert("Visite guidée (1 min)")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff" stroke="#fff" strokeWidth="2" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              Visite guidée (1 min)
            </button>
          </div>
          <div className="cards-grid">
            <div className="feature-card fade" data-delay="50">
              <img className="bg-img" src="https://plugin-assets.open-design.ai/plugins/evergreen-finance/hf_20260517_061249_f20dfeda-1033-45ce-a3ee-070965599cbf-6c6b7e.webp&w=1280&q=85" alt="Gestion des candidatures" />
              <div className="overlay" />
              <div className="top-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                <span>Candidatures</span>
                <span className="top-label-badge">Intelligent</span>
              </div>
              <div className="bottom-text">
                <h3>Gestion des Candidatures</h3>
                <p>Dépôt de dossier simplifié, matching automatique avec les sujets disponibles et suivi en direct de l'état d'avancement.</p>
              </div>
            </div>
            <div className="insight-card fade" data-delay="120">
              <div className="top-label">
                <span className="card-label">Suivi des Conventions</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
              </div>
              <div className="insight-inner">
                <div className="ititle">Workflow de Signature</div>
                <div className="isub">Envoi en cours à l'établissement</div>
                <div className="step-track-list">
                  <div className="step-track-item">
                    <div className="step-track-dot completed">✓</div>
                    <div className="step-track-text">Dossier Validé</div>
                  </div>
                  <div className="step-track-item">
                    <div className="step-track-dot active">2</div>
                    <div className="step-track-text active">Signature Électronique</div>
                  </div>
                  <div className="step-track-item">
                    <div className="step-track-dot">3</div>
                    <div className="step-track-text">Badge d'accès OCP</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="feature-card fade" data-delay="180">
              <img className="bg-img" src="https://plugin-assets.open-design.ai/plugins/evergreen-finance/hf_20260517_061305_db631f5f-185f-4fda-a7a8-1dd7359ef2ea-4b7cdd.webp&w=1280&q=85" alt="Validation des stages" />
              <div className="overlay" />
              <div className="top-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
                <span>Évaluation</span>
                <span className="top-label-badge">Sécurisé</span>
              </div>
              <div className="bottom-text">
                <h3>Validation des Stages</h3>
                <p>Saisie dématérialisée des rapports de mi-parcours, grilles d'évaluation partagées et traitement automatique des attestations.</p>
              </div>
            </div>
            <div className="insight-card fade" data-delay="240">
              <div className="top-label">
                <span className="card-label">Gestion des Encadrants</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
              </div>
              <div className="insight-inner" style={{ justifyContent: 'flex-start', paddingTop: 14 }}>
                <div className="ititle" style={{ marginBottom: 6 }}>Maîtres de Stage Actifs</div>
                <div className="custom-tutor-list">
                  <div className="tutor-item"><span className="tutor-name">Dr. L. Belkadi</span><span className="tutor-tag">R&amp;D Jorf</span></div>
                  <div className="tutor-item"><span className="tutor-name">M. A. Tazi</span><span className="tutor-tag">Mines Khouribga</span></div>
                  <div className="tutor-item"><span className="tutor-name">Mme S. Bennani</span><span className="tutor-tag">Digital Casa</span></div>
                </div>
              </div>
            </div>
            <div className="feature-card fade" data-delay="300">
              <img className="bg-img" src="https://plugin-assets.open-design.ai/plugins/evergreen-finance/hf_20260517_061316_50e651f8-02d0-4add-9ddb-7d81d15ac02e-24edde.webp&w=1280&q=85" alt="Génération de documents" />
              <div className="overlay" />
              <div className="top-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                <span>Documents</span>
                <span className="top-label-badge">Instantané</span>
              </div>
              <div className="bottom-text">
                <h3>Édition Automatisée</h3>
                <p>Production instantanée des attestations de stage, fiches d'accueil, livrets d'intégration et autorisations d'accès aux complexes.</p>
              </div>
            </div>
            <div className="insight-card fade" data-delay="360">
              <div className="top-label">
                <span className="card-label">Statistiques Globales</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="9" x2="15" y2="9" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="11" y2="17" /></svg>
              </div>
              <div className="insight-inner">
                <div className="ititle">Répartition des Sujets</div>
                <div className="isub">Projets stratégiques 2026</div>
                <div className="donut-wrap">
                  <svg viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#00843D" strokeWidth="5" strokeDasharray="26.4 61.56" strokeDashoffset="0" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#D29F13" strokeWidth="5" strokeDasharray="22 65.96" strokeDashoffset="-26.4" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#7A8C3E" strokeWidth="5" strokeDasharray="17.6 70.36" strokeDashoffset="-48.4" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#B8AFA4" strokeWidth="5" strokeDasharray="22 65.96" strokeDashoffset="-66" />
                  </svg>
                  <div className="donut-center"><span className="pct">42%</span><span className="lbl">R&amp;D / IA</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-cream" id="stats">
        <div className="container">
          <span className="sec-badge">Indicateurs</span>
          <h2 className="t-heading font-cooper-medium fade" style={{ textAlign: 'center', marginBottom: 20 }}>L'excellence académique représentée</h2>
          <div className="stats-nav fade" data-delay="100">
            <button className="stats-tab-btn active" onClick={(e) => { document.querySelectorAll('.stats-content').forEach(c => c.classList.remove('active')); document.querySelectorAll('.stats-tab-btn').forEach(b => b.classList.remove('active')); e.currentTarget.classList.add('active'); document.getElementById('tab-schools')?.classList.add('active'); }}>Établissements partenaires</button>
            <button className="stats-tab-btn" onClick={(e) => { document.querySelectorAll('.stats-content').forEach(c => c.classList.remove('active')); document.querySelectorAll('.stats-tab-btn').forEach(b => b.classList.remove('active')); e.currentTarget.classList.add('active'); document.getElementById('tab-growth')?.classList.add('active'); }}>Évolution des candidatures</button>
            <button className="stats-tab-btn" onClick={(e) => { document.querySelectorAll('.stats-content').forEach(c => c.classList.remove('active')); document.querySelectorAll('.stats-tab-btn').forEach(b => b.classList.remove('active')); e.currentTarget.classList.add('active'); document.getElementById('tab-sites')?.classList.add('active'); document.querySelectorAll('#tab-sites .bar-v-fill').forEach(f => { const h = f.style.height; f.style.height = '0%'; setTimeout(() => { f.style.height = h; }, 50); }); }}>Répartition par site OCP</button>
          </div>
          <div className="stats-display fade" data-delay="150">
            <div className="stats-content active" id="tab-schools">
              <div className="chart-layout-split">
                <div className="chart-panel-text">
                  <h4>Origine académique de nos talents</h4>
                  <p>L'OCP collabore étroitement avec les institutions les plus prestigieuses à l'échelle nationale et internationale pour recruter des stagiaires d'exception.</p>
                  <div className="chart-legend-list">
                    {[{ color: 'var(--ocp-green)', label: 'UM6P', val: '35%' }, { color: 'var(--dark-green)', label: "Grandes Écoles d'Ingénieurs", val: '30%' }, { color: 'var(--gold-accent)', label: 'Universités Publiques', val: '20%' }, { color: '#7A8C3E', label: 'Écoles de Management & Commerce', val: '15%' }].map((d, i) => (
                      <div className="chart-legend-item" key={i}>
                        <span className="chart-legend-label"><span className="chart-legend-color" style={{ background: d.color }} />{d.label}</span>
                        <b>{d.val} des effectifs</b>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="svg-chart-wrap">
                  <svg viewBox="0 0 100 100" style={{ width: '100%', height: 'auto', maxWidth: 240 }}>
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#00843D" strokeWidth="12" strokeDasharray="35 65" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#02421D" strokeWidth="12" strokeDasharray="30 70" strokeDashoffset="-35" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#D29F13" strokeWidth="12" strokeDasharray="20 80" strokeDashoffset="-65" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#7A8C3E" strokeWidth="12" strokeDasharray="15 85" strokeDashoffset="-85" />
                    <circle cx="50" cy="50" r="28" fill="white" />
                    <text x="50" y="48" fontSize="6" fontWeight="bold" fill="var(--dark-green)" textAnchor="middle">RECRUTEMENT</text>
                    <text x="50" y="56" fontSize="10" fontWeight="800" fill="var(--ocp-green)" textAnchor="middle">2026</text>
                  </svg>
                </div>
              </div>
            </div>
            <div className="stats-content" id="tab-growth">
              <div className="chart-layout-split">
                <div className="chart-panel-text">
                  <h4>Évolution mensuelle des candidatures</h4>
                  <p>Chaque année, l'attractivité de l'OCP ne cesse de croître auprès des futurs diplômés.</p>
                  <div className="chart-legend-list">
                    <div className="chart-legend-item"><span className="chart-legend-label">Total candidatures reçues</span><b>+28% de croissance globale</b></div>
                    <div className="chart-legend-item"><span className="chart-legend-label">Taux d'affectation final</span><b>18% des demandes retenues</b></div>
                  </div>
                </div>
                <div style={{ width: '100%', maxWidth: 420, margin: '0 auto' }}>
                  <svg viewBox="0 0 400 200" style={{ width: '100%', height: 'auto' }}>
                    <defs><linearGradient id="linefill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00843D" stopOpacity="0.25" /><stop offset="100%" stopColor="#00843D" stopOpacity="0" /></linearGradient></defs>
                    <line x1="40" y1="20" x2="380" y2="20" stroke="#f3f4f6" strokeWidth="1" /><line x1="40" y1="70" x2="380" y2="70" stroke="#f3f4f6" strokeWidth="1" /><line x1="40" y1="120" x2="380" y2="120" stroke="#f3f4f6" strokeWidth="1" /><line x1="40" y1="170" x2="380" y2="170" stroke="#e5e7eb" strokeWidth="1.5" />
                    <polygon points="40,170 90,140 150,150 210,110 270,70 330,30 380,45 380,170" fill="url(#linefill)" />
                    <polyline points="40,170 90,140 150,150 210,110 270,70 330,30 380,45" fill="none" stroke="#00843D" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="90" cy="140" r="5" fill="#02421D" stroke="white" strokeWidth="1.5" /><circle cx="150" cy="150" r="5" fill="#02421D" stroke="white" strokeWidth="1.5" /><circle cx="210" cy="110" r="5" fill="#02421D" stroke="white" strokeWidth="1.5" /><circle cx="270" cy="70" r="5" fill="#02421D" stroke="white" strokeWidth="1.5" /><circle cx="330" cy="30" r="5" fill="#D29F13" stroke="white" strokeWidth="1.5" /><circle cx="380" cy="45" r="5" fill="#02421D" stroke="white" strokeWidth="1.5" />
                    <text x="40" y="185" fontSize="8" fill="#6b7280" textAnchor="middle">Nov</text><text x="90" y="185" fontSize="8" fill="#6b7280" textAnchor="middle">Déc</text><text x="150" y="185" fontSize="8" fill="#6b7280" textAnchor="middle">Jan</text><text x="210" y="185" fontSize="8" fill="#6b7280" textAnchor="middle">Fév</text><text x="270" y="185" fontSize="8" fill="#6b7280" textAnchor="middle">Mar</text><text x="330" y="185" fontSize="8" fill="#6b7280" textAnchor="middle">Avr</text><text x="380" y="185" fontSize="8" fill="#6b7280" textAnchor="middle">Mai</text>
                    <text x="330" y="18" fontSize="9" fontWeight="bold" fill="var(--ocp-green)" textAnchor="middle">Pic (2,800+)</text>
                  </svg>
                </div>
              </div>
            </div>
            <div className="stats-content" id="tab-sites">
              <div className="chart-layout-split">
                <div className="chart-panel-text">
                  <h4>Répartition géographique par site d'affectation</h4>
                  <p>L'implantation nationale du Groupe OCP permet d'accueillir des stagiaires sur l'ensemble de nos hubs industriels.</p>
                  <div className="chart-legend-list">
                    {[{ label: 'Casablanca (Siège social)', val: '15%' }, { label: 'Benguerir (Innovation / R&D UM6P)', val: '30%' }, { label: 'Jorf Lasfar & Safi (Chimie & Engrais)', val: '40%' }, { label: 'Khouribga & Gantour (Sites Miniers)', val: '15%' }].map((d, i) => (
                      <div className="chart-legend-item" key={i}><span className="chart-legend-label">{d.label}</span><b>{d.val} des stagiaires</b></div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="bar-chart-v">
                    {[15, 30, 40, 15].map((h, i) => (
                      <div className="bar-col-v" key={i}>
                        <div className="bar-v-container"><div className="bar-v-fill" style={{ height: h + '%' }} data-val={h + '%'} /></div>
                        <span className="bar-v-label">{['Casa', 'Benguerir', 'Jorf Lasfar', 'Khouribga'][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-white" id="process">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <span className="sec-badge">Parcours</span>
            <h2 className="f-heading font-cooper-medium fade">Comment postuler et réaliser votre stage ?</h2>
            <p style={{ color: 'var(--stone-600)', fontSize: '0.95rem', marginTop: 10, maxWidth: '32rem', marginLeft: 'auto', marginRight: 'auto' }}>Un parcours transparent et entièrement dématérialisé en 4 grandes étapes.</p>
          </div>
          <div className="proc-grid">
            {[
              { num: '01', icon: 'mail', title: "Dépôt & Profil", desc: "Inscrivez-vous sur le portail, importez votre CV et sélectionnez le sujet de stage." },
              { num: '02', icon: 'users', title: "Entretien & Sélection", desc: "Échangez avec nos équipes RH et votre futur encadrant technique OCP." },
              { num: '03', icon: 'file', title: "Convention & Accès", desc: "Générez automatiquement votre convention de stage numérique et obtenez votre badge." },
              { num: '04', icon: 'chart', title: "Projet & Soutenance", desc: "Menez à bien votre projet, rédigez votre mémoire et soutenez vos conclusions." },
            ].map((step, i) => (
              <div className="proc-step-card fade" data-delay={50 + i * 100} key={i}>
                <div className="proc-badge">{step.num}</div>
                <div className="proc-icon-wrap">
                  {step.icon === 'mail' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>}
                  {step.icon === 'users' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="23" y1="11" x2="17" y2="11" /></svg>}
                  {step.icon === 'file' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>}
                  {step.icon === 'chart' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>}
                </div>
                <h3 className="proc-title">{step.title}</h3>
                <p className="proc-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-cream" id="testimonials">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <span className="sec-badge">Témoignages</span>
            <h2 className="f-heading font-cooper-medium fade">Ils partagent leur expérience à l'OCP</h2>
            <p style={{ color: 'var(--stone-600)', fontSize: '0.95rem', marginTop: 10, maxWidth: '32rem', marginLeft: 'auto', marginRight: 'auto' }}>Découvrez les retours de nos anciens stagiaires et encadrants techniques.</p>
          </div>
          <div className="t-cards-grid">
            {[
              { initials: 'SB', name: 'Sofia Bennani', role: 'Stagiaire Data Science, EHTP Casablanca', quote: "Mon stage de fin d'études au site chimique de Jorf Lasfar a été un tournant. J'ai conçu des modèles prédictifs d'optimisation d'énergie sur des cas industriels réels." },
              { initials: 'KB', name: 'Dr. Karim Belkadi', role: 'Parrain & Chercheur R&D, UM6P Benguerir', quote: "En tant que maître de stage, la dématérialisation du processus m'a fait gagner un temps précieux. Je peux me concentrer sur le mentorat." },
              { initials: 'MA', name: 'Mehdi Alaoui', role: 'Stagiaire Génie Industriel, EMI Rabat', quote: "La plateforme digitale m'a permis d'éditer mon attestation de stage en un clic. La transparence de tout le process m'a agréablement impressionné." },
            ].map((t, i) => (
              <div className="t-card fade" data-delay={50 + i * 100} key={i}>
                <div>
                  <div className="rating-stars">{'★'.repeat(5)}</div>
                  <p className="t-card-quote">"{t.quote}"</p>
                </div>
                <div className="t-card-footer">
                  <div className="t-card-avatar">{t.initials}</div>
                  <div className="t-card-info"><h5>{t.name}</h5><p>{t.role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section" id="cta">
        <div className="cta-pattern" />
        <div className="cta-inner">
          <span className="sec-badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>Commencer l'aventure</span>
          <h2 className="cta-title font-cooper-medium">Prêt à façonner l'industrie du futur ?</h2>
          <p className="cta-desc">Accédez à votre espace sécurisé pour soumettre votre dossier, suivre vos conventions ou encadrer de futurs talents.</p>
          <div className="cta-btns">
            <Link to="/login" className="btn-cta btn-cta-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
              Espace Stagiaire
            </Link>
            <Link to="/login" className="btn-cta btn-cta-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
              Portail Encadrant
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="brand-container" style={{ marginBottom: 16 }}><OcpLogo /></div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.5)' }}>Portail de gestion de l'excellence académique et de la formation professionnelle au sein de l'OCP Group.</p>
          </div>
          {[
            { title: 'Plateforme', links: ['Notre Vision', 'Fonctionnalités', 'Statistiques', 'Recrutement'] },
            { title: 'Complexe & Sites', links: ['Jorf Lasfar', 'Benguerir', 'Khouribga', 'Safi & Gantour'] },
            { title: 'Support', links: ["Centre d'aide", "Guide d'intégration", "Contactez l'administration", 'Mentions Légales'] },
          ].map((col, i) => (
            <div className="footer-col" key={i}>
              <h6>{col.title}</h6>
              <ul>{col.links.map((link, j) => <li key={j}><a href="#">{link}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <div>&copy; 2026 OCP Group — Tous droits réservés.</div>
          <div style={{ display: 'flex', gap: 20 }}><a href="#">Politique de Confidentialité</a><a href="#">Conditions d'Utilisation</a></div>
        </div>
      </footer>
    </>
  );
};

export default Welcome;
