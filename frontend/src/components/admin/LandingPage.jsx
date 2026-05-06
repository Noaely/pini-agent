export default function LandingPage() {
  const html = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>pini – הצ'אטבוט שעובד בשבילך</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
:root {
  --blue: #4f8eff;
  --violet: #a259ff;
  --cyan: #00e5ff;
  --pink: #ff4f9b;
  --bg: #060612;
  --bg2: #0b0b1e;
  --glass: rgba(255,255,255,0.04);
  --glass-border: rgba(255,255,255,0.08);
  --glass-hover: rgba(255,255,255,0.07);
  --text: #f0f0ff;
  --muted: #7a7a9d;
  --card-glow-blue: 0 0 40px rgba(79,142,255,0.15), 0 2px 24px rgba(0,0,0,0.5);
  --card-glow-violet: 0 0 40px rgba(162,89,255,0.15), 0 2px 24px rgba(0,0,0,0.5);
  --card-glow-cyan: 0 0 40px rgba(0,229,255,0.12), 0 2px 24px rgba(0,0,0,0.5);
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { font-family: 'Heebo', sans-serif; direction: rtl; background: var(--bg); color: var(--text); overflow-x: hidden; }
a { text-decoration: none; color: inherit; }
.container { max-width: 1160px; margin: 0 auto; padding: 0 28px; }

#bg-canvas { position: fixed; inset: 0; z-index: 0; pointer-events: none; }

body::after {
  content: ''; position: fixed; inset: 0; z-index: 1; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  opacity: 0.4;
}

nav, main, footer { position: relative; z-index: 2; }

nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  height: 68px; display: flex; align-items: center; justify-content: space-between;
  padding: 0 40px;
  background: rgba(6,6,18,0.7);
  backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.nav-logo { font-size: 22px; font-weight: 900; letter-spacing: -0.5px; background: linear-gradient(90deg, var(--blue), var(--violet)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.nav-links { display: flex; gap: 36px; align-items: center; }
.nav-links a { font-size: 14px; font-weight: 500; color: var(--muted); transition: color 0.2s; }
.nav-links a:hover { color: var(--text); }
.nav-cta { background: linear-gradient(135deg, var(--blue), var(--violet)); color: #fff; padding: 10px 24px; border-radius: 100px; font-weight: 700; font-size: 14px; position: relative; box-shadow: 0 0 24px rgba(79,142,255,0.4); transition: all 0.25s; }
.nav-cta:hover { transform: translateY(-2px); box-shadow: 0 0 40px rgba(79,142,255,0.6); }

.reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.7s cubic-bezier(.16,1,.3,1), transform 0.7s cubic-bezier(.16,1,.3,1); }
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal-left { opacity: 0; transform: translateX(40px); transition: opacity 0.7s cubic-bezier(.16,1,.3,1), transform 0.7s cubic-bezier(.16,1,.3,1); }
.reveal-left.visible { opacity: 1; transform: translateX(0); }
.reveal-scale { opacity: 0; transform: scale(0.9); transition: opacity 0.6s cubic-bezier(.16,1,.3,1), transform 0.6s cubic-bezier(.16,1,.3,1); }
.reveal-scale.visible { opacity: 1; transform: scale(1); }

#hero { min-height: 100vh; display: flex; align-items: center; padding-top: 68px; }
.hero-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; padding: 80px 0 100px; }
.hero-badge { display: inline-flex; align-items: center; gap: 8px; border: 1px solid rgba(79,142,255,0.3); background: rgba(79,142,255,0.08); padding: 7px 18px; border-radius: 100px; font-size: 13px; font-weight: 600; color: var(--blue); margin-bottom: 28px; width: fit-content; animation: fadeInDown 0.8s ease both; }
.badge-pulse { width: 7px; height: 7px; border-radius: 50%; background: #4ade80; animation: pulseDot 2s infinite; }
@keyframes pulseDot { 0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(74,222,128,.6)} 50%{transform:scale(1.2);box-shadow:0 0 0 6px rgba(74,222,128,0)} }
@keyframes fadeInDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
.hero-title { font-size: clamp(38px,5.5vw,72px); font-weight: 900; line-height: 1.08; letter-spacing: -2px; margin-bottom: 24px; text-wrap: balance; animation: fadeInUp 0.8s 0.1s ease both; }
@keyframes fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
.hero-title .grad { background: linear-gradient(90deg,var(--blue) 0%,var(--violet) 50%,var(--cyan) 100%); background-size: 200%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: gradShift 4s ease infinite; }
@keyframes gradShift { 0%,100%{background-position:0%} 50%{background-position:100%} }
.hero-sub { font-size: 18px; color: var(--muted); line-height: 1.75; margin-bottom: 44px; max-width: 480px; font-weight: 400; animation: fadeInUp 0.8s 0.2s ease both; }
.hero-actions { display: flex; gap: 14px; flex-wrap: wrap; animation: fadeInUp 0.8s 0.3s ease both; }
.btn-glow { background: linear-gradient(135deg,var(--blue),var(--violet)); color: #fff; padding: 16px 32px; border-radius: 14px; font-weight: 800; font-size: 16px; cursor: pointer; border: none; box-shadow: 0 0 40px rgba(79,142,255,0.45); transition: all 0.25s; position: relative; overflow: hidden; font-family: 'Heebo',sans-serif; display: inline-flex; align-items: center; gap: 8px; }
.btn-glow:hover { transform: translateY(-3px); box-shadow: 0 0 60px rgba(79,142,255,0.65); }
.btn-glow::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent); opacity: 0; transition: opacity 0.2s; }
.btn-glow:hover::before { opacity: 1; }
.btn-ghost { background: var(--glass); color: var(--text); padding: 16px 32px; border-radius: 14px; font-weight: 700; font-size: 16px; cursor: pointer; border: 1px solid var(--glass-border); transition: all 0.25s; font-family: 'Heebo',sans-serif; display: inline-flex; align-items: center; gap: 8px; backdrop-filter: blur(10px); }
.btn-ghost:hover { background: var(--glass-hover); border-color: rgba(255,255,255,0.15); transform: translateY(-2px); }

.hero-visual { display: flex; justify-content: center; align-items: center; position: relative; animation: fadeInUp 0.9s 0.2s ease both; }
.phone-scene { position: relative; width: 300px; height: 580px; }
.orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.5; pointer-events: none; animation: orbFloat 6s ease-in-out infinite; }
.orb-1 { width: 280px; height: 280px; background: var(--violet); top: -60px; right: -60px; animation-delay: 0s; }
.orb-2 { width: 200px; height: 200px; background: var(--blue); bottom: -40px; left: -40px; animation-delay: -3s; }
.orb-3 { width: 150px; height: 150px; background: var(--cyan); top: 40%; left: -80px; animation-delay: -1.5s; opacity: 0.3; }
@keyframes orbFloat { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-30px) scale(1.05)} }
.phone-3d { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 260px; animation: phoneFloat 5s ease-in-out infinite; transform-origin: center center; transform-style: preserve-3d; }
@keyframes phoneFloat { 0%,100%{transform:translateX(-50%) translateY(0) rotateY(-8deg) rotateX(4deg)} 50%{transform:translateX(-50%) translateY(-20px) rotateY(8deg) rotateX(-2deg)} }
.phone-body { background: linear-gradient(160deg,#1a1a3e 0%,#0d0d1f 100%); border-radius: 44px; padding: 14px 10px; border: 1.5px solid rgba(255,255,255,0.12); box-shadow: 0 60px 120px rgba(0,0,0,0.8),0 0 80px rgba(79,142,255,0.2),inset 0 1px 0 rgba(255,255,255,0.1),inset 0 -1px 0 rgba(0,0,0,0.5); position: relative; overflow: hidden; }
.phone-body::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg,rgba(79,142,255,0.08) 0%,transparent 50%,rgba(162,89,255,0.08) 100%); }
.phone-notch { width: 72px; height: 20px; background: #000; border-radius: 100px; margin: 0 auto 10px; position: relative; z-index: 1; }
.phone-screen-inner { background: #0f0f1e; border-radius: 32px; overflow: hidden; position: relative; z-index: 1; }
.chat-header-phone { background: linear-gradient(90deg,#1a0533 0%,#0d1433 100%); padding: 12px 14px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.chat-av { width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg,var(--blue),var(--violet)); display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
.chat-meta-name { font-size: 11px; font-weight: 700; color: #fff; }
.chat-meta-status { font-size: 9px; color: var(--cyan); font-weight: 600; }
.phone-msgs { padding: 10px; display: flex; flex-direction: column; gap: 7px; min-height: 320px; }
.pb { border-radius: 16px; padding: 9px 12px; font-size: 11px; line-height: 1.5; }
.pb-bot { background: linear-gradient(135deg,rgba(79,142,255,0.25),rgba(162,89,255,0.25)); border: 1px solid rgba(79,142,255,0.2); color: #fff; align-self: flex-end; border-bottom-right-radius: 4px; animation: msgIn 0.4s ease both; }
.pb-user { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.08); color: var(--text); align-self: flex-start; border-bottom-left-radius: 4px; animation: msgIn 0.4s ease both; }
@keyframes msgIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
.typing-ph { display: flex; gap: 4px; align-items: center; padding: 9px 12px; background: rgba(79,142,255,0.1); border: 1px solid rgba(79,142,255,0.15); border-radius: 16px; border-bottom-right-radius: 4px; align-self: flex-end; width: fit-content; }
.typing-ph span { width: 6px; height: 6px; border-radius: 50%; background: var(--blue); animation: typingDot 1.2s infinite; }
.typing-ph span:nth-child(2){animation-delay:.2s} .typing-ph span:nth-child(3){animation-delay:.4s}
@keyframes typingDot { 0%,60%,100%{transform:translateY(0);opacity:.5} 30%{transform:translateY(-5px);opacity:1} }

.float-card { position: absolute; background: rgba(255,255,255,0.06); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 12px 16px; font-size: 12px; font-weight: 700; color: #fff; white-space: nowrap; box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
.float-card-1 { top: 80px; left: -80px; animation: floatCard1 4s ease-in-out infinite; }
.float-card-2 { bottom: 100px; right: -80px; animation: floatCard2 5s ease-in-out infinite; }
.float-card-3 { bottom: 20px; left: -60px; animation: floatCard3 4.5s ease-in-out infinite; }
@keyframes floatCard1 { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-12px) rotate(1deg)} }
@keyframes floatCard2 { 0%,100%{transform:translateY(0) rotate(2deg)} 50%{transform:translateY(-10px) rotate(-1deg)} }
@keyframes floatCard3 { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-8px) rotate(2deg)} }
.fc-icon { font-size: 18px; margin-bottom: 4px; }
.fc-val { font-size: 20px; font-weight: 900; color: var(--cyan); }
.fc-label { font-size: 10px; color: var(--muted); font-weight: 500; }

#proof { border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06); padding: 36px 0; background: rgba(255,255,255,0.02); }
.proof-inner { display: flex; align-items: center; justify-content: space-between; gap: 32px; flex-wrap: wrap; }
.proof-stats { display: flex; gap: 48px; }
.stat-num { font-size: 40px; font-weight: 900; letter-spacing: -1.5px; background: linear-gradient(90deg,var(--blue),var(--violet)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.stat-label { font-size: 13px; color: var(--muted); margin-top: 2px; font-weight: 500; }
.proof-logos { display: flex; gap: 12px; flex-wrap: wrap; }
.logo-chip { background: var(--glass); border: 1px solid var(--glass-border); padding: 9px 18px; border-radius: 100px; font-size: 13px; font-weight: 600; color: var(--muted); transition: all 0.2s; cursor: default; }
.logo-chip:hover { color: var(--text); border-color: rgba(255,255,255,0.2); background: var(--glass-hover); }

section { padding: 100px 0; }
.stag { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--blue); margin-bottom: 20px; }
.stag::before { content: ''; width: 20px; height: 2px; background: var(--blue); display: inline-block; }
.stitle { font-size: clamp(30px,4vw,52px); font-weight: 900; letter-spacing: -1.5px; line-height: 1.1; margin-bottom: 16px; text-wrap: balance; }
.stitle .grad { background: linear-gradient(90deg,var(--blue),var(--violet)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.ssub { font-size: 17px; color: var(--muted); line-height: 1.75; max-width: 520px; }

#how { background: var(--bg); }
.steps-wrap { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; margin-top: 64px; }
.step-card { background: var(--glass); border: 1px solid var(--glass-border); border-radius: 24px; padding: 40px 32px; position: relative; overflow: hidden; transition: all 0.4s cubic-bezier(.16,1,.3,1); cursor: default; }
.step-card:hover { transform: translateY(-10px) rotateX(4deg); border-color: rgba(79,142,255,0.3); box-shadow: 0 30px 80px rgba(0,0,0,0.5),0 0 60px rgba(79,142,255,0.15); }
.step-card:nth-child(2):hover { border-color: rgba(162,89,255,0.3); box-shadow: 0 30px 80px rgba(0,0,0,0.5),0 0 60px rgba(162,89,255,0.15); }
.step-card:nth-child(3):hover { border-color: rgba(0,229,255,0.3); box-shadow: 0 30px 80px rgba(0,0,0,0.5),0 0 60px rgba(0,229,255,0.15); }
.step-card::before { content: ''; position: absolute; top: 0; right: 0; left: 0; height: 2px; background: linear-gradient(90deg,transparent,var(--blue),transparent); opacity: 0; transition: opacity 0.3s; }
.step-card:nth-child(2)::before { background: linear-gradient(90deg,transparent,var(--violet),transparent); }
.step-card:nth-child(3)::before { background: linear-gradient(90deg,transparent,var(--cyan),transparent); }
.step-card:hover::before { opacity: 1; }
.step-glow { position: absolute; width: 200px; height: 200px; border-radius: 50%; filter: blur(80px); opacity: 0; transition: opacity 0.4s; top: -50px; right: -50px; pointer-events: none; }
.step-card:nth-child(1) .step-glow { background: var(--blue); }
.step-card:nth-child(2) .step-glow { background: var(--violet); }
.step-card:nth-child(3) .step-glow { background: var(--cyan); }
.step-card:hover .step-glow { opacity: 0.15; }
.step-icon-wrap { width: 60px; height: 60px; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 26px; margin-bottom: 24px; position: relative; }
.step-card:nth-child(1) .step-icon-wrap { background: rgba(79,142,255,0.12); border: 1px solid rgba(79,142,255,0.2); }
.step-card:nth-child(2) .step-icon-wrap { background: rgba(162,89,255,0.12); border: 1px solid rgba(162,89,255,0.2); }
.step-card:nth-child(3) .step-icon-wrap { background: rgba(0,229,255,0.12); border: 1px solid rgba(0,229,255,0.2); }
.step-n { position: absolute; top: -8px; left: -8px; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; color: #fff; }
.step-card:nth-child(1) .step-n { background: var(--blue); }
.step-card:nth-child(2) .step-n { background: var(--violet); }
.step-card:nth-child(3) .step-n { background: var(--cyan); color: #000; }
.step-title { font-size: 20px; font-weight: 800; color: var(--text); margin-bottom: 12px; }
.step-desc { font-size: 15px; color: var(--muted); line-height: 1.7; }
.step-card-link { cursor: pointer; }
.step-link-hint { position: absolute; top: 18px; left: 28px; font-size: 12px; font-weight: 700; color: var(--blue); opacity: 0; transform: translateX(6px); transition: opacity 0.25s,transform 0.25s; letter-spacing: 0.3px; }
.step-card-link:hover .step-link-hint { opacity: 1; transform: translateX(0); }

#conversations { background: var(--bg2); }
.tabs { display: flex; gap: 8px; margin-bottom: 48px; flex-wrap: wrap; }
.tab-btn { padding: 10px 22px; border-radius: 100px; border: 1px solid var(--glass-border); background: var(--glass); color: var(--muted); font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: 'Heebo',sans-serif; display: flex; align-items: center; gap: 6px; backdrop-filter: blur(10px); }
.tab-btn:hover { color: var(--text); border-color: rgba(255,255,255,0.15); }
.tab-btn.active { background: linear-gradient(135deg,var(--blue),var(--violet)); color: #fff; border-color: transparent; box-shadow: 0 0 30px rgba(79,142,255,0.35); }
.convo-panel { display: none; }
.convo-panel.active { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
.convo-mock { background: var(--glass); border: 1px solid var(--glass-border); border-radius: 28px; overflow: hidden; box-shadow: 0 0 60px rgba(79,142,255,0.1),0 20px 60px rgba(0,0,0,0.5); }
.convo-hdr { padding: 18px 22px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid var(--glass-border); background: linear-gradient(90deg,rgba(79,142,255,0.08),rgba(162,89,255,0.08)); }
.convo-av { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg,var(--blue),var(--violet)); display: flex; align-items: center; justify-content: center; font-size: 20px; }
.convo-nm { font-weight: 800; font-size: 15px; }
.convo-st { font-size: 12px; color: var(--cyan); font-weight: 600; }
.convo-msgs { padding: 20px; display: flex; flex-direction: column; gap: 10px; }
.cm { display: flex; flex-direction: column; max-width: 82%; }
.cm.bot { align-self: flex-end; align-items: flex-end; }
.cm.usr { align-self: flex-start; align-items: flex-start; }
.cm-b { padding: 12px 16px; border-radius: 18px; font-size: 14px; line-height: 1.6; }
.cm.bot .cm-b { background: linear-gradient(135deg,rgba(79,142,255,0.2),rgba(162,89,255,0.2)); border: 1px solid rgba(79,142,255,0.2); border-bottom-right-radius: 4px; color: var(--text); }
.cm.usr .cm-b { background: rgba(255,255,255,0.06); border: 1px solid var(--glass-border); border-bottom-left-radius: 4px; color: var(--muted); }
.cm-t { font-size: 11px; color: var(--muted); margin-top: 4px; opacity: 0.6; }
.convo-info .stag { margin-bottom: 12px; }
.convo-info h3 { font-size: 36px; font-weight: 900; letter-spacing: -1px; line-height: 1.15; margin-bottom: 16px; }
.convo-info p { font-size: 16px; color: var(--muted); line-height: 1.8; margin-bottom: 28px; }
.highlights { display: flex; flex-direction: column; gap: 14px; }
.hl { display: flex; align-items: center; gap: 12px; font-size: 15px; font-weight: 500; }
.hl-dot { width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
.hl:nth-child(1) .hl-dot { background: rgba(79,142,255,0.12); }
.hl:nth-child(2) .hl-dot { background: rgba(162,89,255,0.12); }
.hl:nth-child(3) .hl-dot { background: rgba(0,229,255,0.12); }

#chat-demo { background: var(--bg); }
.chat-demo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
.chat-widget { background: var(--glass); border: 1px solid var(--glass-border); border-radius: 28px; overflow: hidden; height: 520px; display: flex; flex-direction: column; box-shadow: 0 0 80px rgba(79,142,255,0.1),0 20px 60px rgba(0,0,0,0.5); }
.cw-header { padding: 20px 24px; border-bottom: 1px solid var(--glass-border); display: flex; align-items: center; gap: 14px; background: linear-gradient(90deg,rgba(79,142,255,0.08),rgba(162,89,255,0.08)); }
.cw-av { width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg,var(--blue),var(--violet)); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.cw-name { font-weight: 800; font-size: 15px; }
.cw-status { font-size: 12px; color: var(--cyan); display: flex; align-items: center; gap: 5px; }
.online-dot { width: 7px; height: 7px; border-radius: 50%; background: #4ade80; animation: pulseDot 2s infinite; }
.cw-msgs { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
.cw-msgs::-webkit-scrollbar { width: 3px; }
.cw-msgs::-webkit-scrollbar-thumb { background: var(--glass-border); border-radius: 2px; }
.cw-msg { display: flex; flex-direction: column; max-width: 82%; }
.cw-msg.ass { align-self: flex-end; align-items: flex-end; }
.cw-msg.usm { align-self: flex-start; align-items: flex-start; }
.cw-mb { padding: 12px 16px; border-radius: 18px; font-size: 14px; line-height: 1.6; }
.cw-msg.ass .cw-mb { background: linear-gradient(135deg,rgba(79,142,255,0.25),rgba(162,89,255,0.25)); border: 1px solid rgba(79,142,255,0.2); border-bottom-right-radius: 4px; color: var(--text); }
.cw-msg.usm .cw-mb { background: rgba(255,255,255,0.07); border: 1px solid var(--glass-border); border-bottom-left-radius: 4px; color: var(--text); }
.cw-input-row { padding: 16px 20px; border-top: 1px solid var(--glass-border); display: flex; gap: 10px; align-items: center; }
.cw-input { flex: 1; border: 1px solid var(--glass-border); background: rgba(255,255,255,0.05); color: var(--text); border-radius: 14px; padding: 12px 16px; font-size: 14px; outline: none; font-family: 'Heebo',sans-serif; transition: all 0.2s; }
.cw-input:focus { border-color: rgba(79,142,255,0.5); background: rgba(79,142,255,0.05); box-shadow: 0 0 0 3px rgba(79,142,255,0.1); }
.cw-input::placeholder { color: var(--muted); }
.cw-send { width: 44px; height: 44px; border-radius: 12px; border: none; background: linear-gradient(135deg,var(--blue),var(--violet)); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; transition: all 0.2s; flex-shrink: 0; box-shadow: 0 0 20px rgba(79,142,255,0.4); }
.cw-send:hover { transform: scale(1.08); box-shadow: 0 0 30px rgba(79,142,255,0.6); }
.cw-send:disabled { opacity: 0.4; transform: none; cursor: not-allowed; }
.chat-side-info h2 { font-size: 44px; font-weight: 900; letter-spacing: -1.5px; line-height: 1.1; margin-bottom: 16px; }
.chat-side-info p { font-size: 17px; color: var(--muted); line-height: 1.8; margin-bottom: 32px; }
.quick-btns { display: flex; flex-direction: column; gap: 10px; }
.qbtn { background: var(--glass); border: 1px solid var(--glass-border); color: var(--muted); padding: 13px 18px; border-radius: 14px; cursor: pointer; text-align: right; font-family: 'Heebo',sans-serif; font-size: 14px; font-weight: 600; transition: all 0.25s; display: flex; align-items: center; gap: 10px; }
.qbtn:hover { color: var(--text); border-color: rgba(79,142,255,0.4); background: rgba(79,142,255,0.08); transform: translateX(-4px); }

#features { background: var(--bg2); }
.features-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 20px; margin-top: 64px; }
.feat-card { background: var(--glass); border: 1px solid var(--glass-border); border-radius: 24px; padding: 36px 32px; transition: all 0.4s cubic-bezier(.16,1,.3,1); cursor: default; position: relative; overflow: hidden; }
.feat-card:hover { transform: translateY(-8px); border-color: rgba(255,255,255,0.12); box-shadow: 0 30px 80px rgba(0,0,0,0.5); }
.feat-card:nth-child(1):hover { box-shadow: 0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(79,142,255,0.1); }
.feat-card:nth-child(2):hover { box-shadow: 0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(162,89,255,0.1); }
.feat-card:nth-child(3):hover { box-shadow: 0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(0,229,255,0.1); }
.feat-card:nth-child(4):hover { box-shadow: 0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(255,79,155,0.1); }
.feat-icon { width: 64px; height: 64px; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 22px; }
.feat-card:nth-child(1) .feat-icon { background: rgba(79,142,255,0.1); border: 1px solid rgba(79,142,255,0.2); }
.feat-card:nth-child(2) .feat-icon { background: rgba(162,89,255,0.1); border: 1px solid rgba(162,89,255,0.2); }
.feat-card:nth-child(3) .feat-icon { background: rgba(0,229,255,0.1); border: 1px solid rgba(0,229,255,0.2); }
.feat-card:nth-child(4) .feat-icon { background: rgba(255,79,155,0.1); border: 1px solid rgba(255,79,155,0.2); }
.feat-title { font-size: 20px; font-weight: 800; margin-bottom: 10px; }
.feat-desc { font-size: 15px; color: var(--muted); line-height: 1.7; }

#faq { background: var(--bg); }
.faq-wrap { max-width: 800px; margin-top: 56px; display: flex; flex-direction: column; gap: 10px; }
.faq-item { background: var(--glass); border: 1px solid var(--glass-border); border-radius: 18px; overflow: hidden; transition: border-color 0.2s,box-shadow 0.2s; }
.faq-item.open { border-color: rgba(79,142,255,0.3); box-shadow: 0 0 30px rgba(79,142,255,0.08); }
.faq-q { padding: 22px 26px; font-size: 16px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: space-between; user-select: none; transition: color 0.2s; gap: 16px; }
.faq-q:hover { color: var(--blue); }
.faq-icon { width: 28px; height: 28px; border-radius: 8px; background: var(--glass-hover); display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; transition: all 0.3s; color: var(--muted); }
.faq-item.open .faq-icon { transform: rotate(180deg); background: linear-gradient(135deg,var(--blue),var(--violet)); color: #fff; }
.faq-a { max-height: 0; overflow: hidden; transition: max-height 0.4s ease,padding 0.3s; padding: 0 26px; color: var(--muted); font-size: 15px; line-height: 1.8; }
.faq-item.open .faq-a { max-height: 200px; padding: 0 26px 22px; }

#lead { background: var(--bg2); }
.lead-box { border-radius: 32px; padding: 80px 64px; text-align: center; background: linear-gradient(135deg,rgba(79,142,255,0.08) 0%,rgba(162,89,255,0.08) 100%); border: 1px solid rgba(79,142,255,0.2); position: relative; overflow: hidden; box-shadow: 0 0 100px rgba(79,142,255,0.1); }
.lead-orb1 { position: absolute; width: 400px; height: 400px; border-radius: 50%; background: var(--blue); filter: blur(120px); opacity: 0.1; top: -200px; right: -100px; pointer-events: none; }
.lead-orb2 { position: absolute; width: 300px; height: 300px; border-radius: 50%; background: var(--violet); filter: blur(100px); opacity: 0.1; bottom: -150px; left: -100px; pointer-events: none; }
.lead-title { font-size: clamp(28px,4vw,52px); font-weight: 900; letter-spacing: -1.5px; margin-bottom: 12px; position: relative; }
.lead-title .grad { background: linear-gradient(90deg,var(--blue),var(--violet),var(--cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.lead-sub { font-size: 18px; color: var(--muted); margin-bottom: 48px; position: relative; }
.lead-form { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; max-width: 760px; margin: 0 auto; position: relative; }
.lead-inp,.lead-sel { padding: 16px 20px; border-radius: 14px; font-size: 15px; font-family: 'Heebo',sans-serif; background: rgba(255,255,255,0.06); color: var(--text); border: 1px solid rgba(255,255,255,0.1); outline: none; transition: all 0.2s; flex: 1; min-width: 180px; }
.lead-inp::placeholder { color: var(--muted); }
.lead-inp:focus,.lead-sel:focus { border-color: rgba(79,142,255,0.5); box-shadow: 0 0 0 3px rgba(79,142,255,0.1); }
.lead-sel { appearance: none; }
.lead-sel option { background: #1a1a2e; color: var(--text); }
.lead-btn { padding: 16px 36px; border-radius: 14px; border: none; cursor: pointer; background: linear-gradient(135deg,var(--blue),var(--violet)); color: #fff; font-size: 16px; font-weight: 800; font-family: 'Heebo',sans-serif; box-shadow: 0 0 40px rgba(79,142,255,0.45); transition: all 0.25s; white-space: nowrap; }
.lead-btn:hover { transform: translateY(-2px); box-shadow: 0 0 60px rgba(79,142,255,0.65); }
.lead-ok { display: none; background: rgba(79,142,255,0.1); border: 1px solid rgba(79,142,255,0.3); border-radius: 16px; padding: 24px; color: var(--text); font-size: 18px; font-weight: 700; position: relative; }

footer { background: #000; border-top: 1px solid rgba(255,255,255,0.06); padding: 48px 0 32px; }
.footer-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 24px; }
.footer-logo { font-size: 24px; font-weight: 900; background: linear-gradient(90deg,var(--blue),var(--violet)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.footer-links { display: flex; gap: 28px; }
.footer-links a { font-size: 14px; color: var(--muted); transition: color 0.2s; }
.footer-links a:hover { color: var(--text); }
.footer-copy { font-size: 13px; color: var(--muted); text-align: center; padding-top: 28px; border-top: 1px solid rgba(255,255,255,0.05); margin-top: 28px; }

@media (max-width: 900px) {
  .hero-inner,.convo-panel.active,.chat-demo-grid { grid-template-columns: 1fr; }
  .hero-visual { order: -1; }
  .steps-wrap,.features-grid { grid-template-columns: 1fr; }
  nav { padding: 0 20px; }
  .nav-links { display: none; }
  .lead-box { padding: 48px 24px; }
  .phone-scene { width: 260px; height: 500px; margin: 0 auto; }
  section { padding: 72px 0; }
}
</style>
</head>
<body>
<canvas id="bg-canvas"></canvas>

<nav id="main-nav">
  <div class="nav-logo">pini</div>
  <div class="nav-links">
    <a href="#how">איך זה עובד</a>
    <a href="#conversations">שיחות</a>
    <a href="#features">תכונות</a>
    <a href="#faq">שאלות</a>
    <a href="#lead" class="nav-cta">קבע פגישה ←</a>
  </div>
</nav>

<main>
<section id="hero">
  <div class="container">
    <div class="hero-inner">
      <div>
        <div class="hero-badge"><span class="badge-pulse"></span> 120+ עסקים פעילים</div>
        <h1 class="hero-title">הצ'אטבוט שעובד<br><span class="grad">בשבילך</span> – 24/7</h1>
        <p class="hero-sub">תן ללקוחות שלך מענה מיידי, סגור את המכירות – בלי שתצטרך להיות זמין</p>
        <div class="hero-actions">
          <a href="#lead" class="btn-glow">🚀 קבע פגישת הדגמה חינם</a>
          <a href="#chat-demo" class="btn-ghost">💬 נסה את הצ'אט עכשיו</a>
        </div>
      </div>
      <div class="hero-visual">
        <div class="phone-scene">
          <div class="orb orb-1"></div>
          <div class="orb orb-2"></div>
          <div class="orb orb-3"></div>
          <div class="phone-3d">
            <div class="phone-body">
              <div class="phone-notch"></div>
              <div class="phone-screen-inner">
                <div class="chat-header-phone">
                  <div class="chat-av">🤖</div>
                  <div>
                    <div class="chat-meta-name">pini – הצ'אט שלי</div>
                    <div class="chat-meta-status">● פעיל עכשיו</div>
                  </div>
                </div>
                <div class="phone-msgs" id="hero-msgs">
                  <div class="pb pb-bot" style="animation-delay:.1s">שלום! אני pini 🎉<br>במה אוכל לעזור?</div>
                  <div class="pb pb-user" style="animation-delay:.5s">כמה עולה אנטריקוט לקילו?</div>
                  <div class="pb pb-bot" style="animation-delay:1s">אנטריקוט עכשיו 89₪/ק"ג 🥩<br>מבצע: 2 ק"ג ב-160₪!</div>
                  <div class="pb pb-user" style="animation-delay:1.5s">תזמין 2 קילו בבקשה</div>
                  <div class="typing-ph" id="hero-typing" style="animation-delay:2s">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="float-card float-card-1">
            <div class="fc-icon">📦</div>
            <div class="fc-val">+32</div>
            <div class="fc-label">הזמנות החודש</div>
          </div>
          <div class="float-card float-card-2">
            <div class="fc-icon">⭐</div>
            <div class="fc-val">92%</div>
            <div class="fc-label">שביעות רצון</div>
          </div>
          <div class="float-card float-card-3">
            <div class="fc-icon">🕐</div>
            <div class="fc-label">פעיל 24/7</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="proof">
  <div class="container">
    <div class="proof-inner">
      <div class="proof-stats reveal">
        <div><div class="stat-num" data-count="120">0</div><div class="stat-label">עסקים פעילים</div></div>
        <div><div class="stat-num" data-count="50" data-suffix="K">0</div><div class="stat-label">שיחות בחודש</div></div>
        <div><div class="stat-num" data-count="92" data-suffix="%">0</div><div class="stat-label">שביעות רצון</div></div>
      </div>
      <div class="proof-logos reveal" style="transition-delay:.15s">
        <div class="logo-chip">🥩 קצביות</div>
        <div class="logo-chip">✂️ מספרות</div>
        <div class="logo-chip">🎂 קונדיטוריות</div>
        <div class="logo-chip">🎨 סטודיו</div>
      </div>
    </div>
  </div>
</section>

<section id="how">
  <div class="container">
    <div class="reveal">
      <div class="stag">איך זה עובד</div>
      <h2 class="stitle">שלושה צעדים והצ'אט<br>שלך <span class="grad">עובד</span></h2>
      <p class="ssub">תהליך פשוט של 30 דקות – ואחרי pini מתחיל לשרת את הלקוחות שלך</p>
    </div>
    <div class="steps-wrap">
      <div class="step-card step-card-link reveal" style="transition-delay:.1s" onclick="document.getElementById('chat-demo').scrollIntoView({behavior:'smooth'})">
        <div class="step-glow"></div>
        <div class="step-link-hint">דבר איתנו עכשיו ←</div>
        <div class="step-icon-wrap"><span class="step-n">1</span>🤝</div>
        <h3 class="step-title">קובעים פגישה להכיר אתכם</h3>
        <p class="step-desc">מקיימים שיחה קצרה ומובנית כדי להבין את העסק, המוצרים ואופן ניהול ההזמנות – ובונים עבורכם צ'אט שמדבר בדיוק בשפה שלכם.</p>
      </div>
      <div class="step-card reveal" style="transition-delay:.2s">
        <div class="step-glow"></div>
        <div class="step-icon-wrap"><span class="step-n">2</span>📱</div>
        <h3 class="step-title">חיבור לוואטסאפ בסריקה אחת</h3>
        <p class="step-desc">מחברים את הצ'אט לוואטסאפ העסקי שלכם בקלות – סורקים קוד QR אחד ותוך שניות הכל מחובר. אין תכנות, אין טכנאי, אין בלגן.</p>
      </div>
      <div class="step-card step-card-link reveal" style="transition-delay:.3s" onclick="document.getElementById('conversations').scrollIntoView({behavior:'smooth'})">
        <div class="step-glow"></div>
        <div class="step-link-hint">ראה שיחות אמיתיות ←</div>
        <div class="step-icon-wrap"><span class="step-n">3</span>🚀</div>
        <h3 class="step-title">הצ'אט מתחיל לעבוד בשבילך</h3>
        <p class="step-desc">מהרגע הזה pini עונה ללקוחות, מסביר מחירים, מציע מבצעים ומסייע בהזמנות – סביב השעון, בלי שתצטרך לגעת בשום דבר.</p>
      </div>
    </div>
  </div>
</section>

<section id="conversations">
  <div class="container">
    <div class="reveal">
      <div class="stag">שיחות אמיתיות</div>
      <h2 class="stitle">ראה איך <span class="grad">pini</span> מדבר<br>עם הלקוחות שלך</h2>
    </div>
    <div class="tabs reveal" style="transition-delay:.1s">
      <button class="tab-btn active" onclick="showConvo('barber',this)">✂️ מספרה</button>
      <button class="tab-btn" onclick="showConvo('cakes',this)">🎂 קונדיטוריה</button>
      <button class="tab-btn" onclick="showConvo('butcher',this)">🥩 קצבייה</button>
      <button class="tab-btn" onclick="showConvo('studio',this)">🎨 סטודיו</button>
    </div>

    <div class="convo-panel active" id="convo-barber">
      <div class="convo-mock reveal-scale">
        <div class="convo-hdr"><div class="convo-av">✂️</div><div><div class="convo-nm">מספרת סטייל – רון</div><div class="convo-st">● פעיל</div></div></div>
        <div class="convo-msgs">
          <div class="cm usr"><div class="cm-b">היי, יש תור פנוי מחר אחה"צ?</div><div class="cm-t">21:14</div></div>
          <div class="cm bot"><div class="cm-b">היי! יש לנו מחר 🗓️<br><br>• 14:30 – פנוי<br>• 16:00 – פנוי<br>• 17:30 – פנוי<br><br>איזה שירות אתה מחפש?</div><div class="cm-t">21:14</div></div>
          <div class="cm usr"><div class="cm-b">תספורת + עיצוב זקן. כמה עולה?</div><div class="cm-t">21:15</div></div>
          <div class="cm bot"><div class="cm-b">תספורת + זקן = 120₪ ✂️<br>משך: כ-45 דקות<br><br>תרשום אותך ל-16:00?</div><div class="cm-t">21:15</div></div>
          <div class="cm usr"><div class="cm-b">מעולה, כן בבקשה</div><div class="cm-t">21:15</div></div>
          <div class="cm bot"><div class="cm-b">✅ מזמין אותך מחר ב-16:00!<br>תקבל תזכורת שעה לפני 🔔</div><div class="cm-t">21:15</div></div>
        </div>
      </div>
      <div class="convo-info reveal-left">
        <div class="stag">תרחיש 01</div>
        <h3>תור שנסגר<br>בשעה 21:00</h3>
        <p>הלקוח שלח DM בלילה – pini הציג זמינות, תימחר ורשם אותו. בלי שום מעורבות שלך.</p>
        <div class="highlights">
          <div class="hl"><div class="hl-dot">📅</div><span>מציג זמינות בזמן אמת</span></div>
          <div class="hl"><div class="hl-dot">💈</div><span>מתמחר שירות מדויק</span></div>
          <div class="hl"><div class="hl-dot">🔔</div><span>שולח אישור ותזכורת אוטומטית</span></div>
        </div>
      </div>
    </div>

    <div class="convo-panel" id="convo-cakes">
      <div class="convo-mock reveal-scale">
        <div class="convo-hdr"><div class="convo-av">🎂</div><div><div class="convo-nm">עוגות של מיכל</div><div class="convo-st">● פעיל</div></div></div>
        <div class="convo-msgs">
          <div class="cm usr"><div class="cm-b">ראיתי את הפוסט שלכן באינסטגרם, רוצה עוגת יום הולדת לשבוע הבא</div><div class="cm-t">11:30</div></div>
          <div class="cm bot"><div class="cm-b">כמה נחמד! 🎂 כמה קומות ולכמה אנשים?</div><div class="cm-t">11:30</div></div>
          <div class="cm usr"><div class="cm-b">2 קומות, בערך 20 איש, טעם שוקולד</div><div class="cm-t">11:31</div></div>
          <div class="cm bot"><div class="cm-b">מעולה! עוגת שוקולד 2 קומות ל-20 איש 🍫<br><br>מחיר: 380–420₪ (תלוי עיצוב)<br>הכנה: 3 ימי עסקים<br><br>יש לך תאריך מסוים?</div><div class="cm-t">11:31</div></div>
          <div class="cm usr"><div class="cm-b">יום שישי הבא, 14 בחודש</div><div class="cm-t">11:32</div></div>
          <div class="cm bot"><div class="cm-b">✅ יש לנו מקום ליום שישי ה-14!<br>אשלח לך דוגמאות עיצוב לבחירה 🎨</div><div class="cm-t">11:32</div></div>
        </div>
      </div>
      <div class="convo-info reveal-left">
        <div class="stag">תרחיש 02</div>
        <h3>ליד מאינסטגרם<br>הפך להזמנה</h3>
        <p>הלקוחה ראתה פוסט ושלחה DM – pini אסף את כל הפרטים ותיאם תאריך. מיכל לא ידעה מזה.</p>
        <div class="highlights">
          <div class="hl"><div class="hl-dot">📸</div><span>עונה ללידים מאינסטגרם מיד</span></div>
          <div class="hl"><div class="hl-dot">🧁</div><span>מתמחר לפי גודל ועיצוב</span></div>
          <div class="hl"><div class="hl-dot">📆</div><span>בודק זמינות וסוגר תאריך</span></div>
        </div>
      </div>
    </div>

    <div class="convo-panel" id="convo-butcher">
      <div class="convo-mock reveal-scale">
        <div class="convo-hdr"><div class="convo-av">🥩</div><div><div class="convo-nm">קצביית בן דוד</div><div class="convo-st">● פעיל</div></div></div>
        <div class="convo-msgs">
          <div class="cm usr"><div class="cm-b">בני לי תפריט לשישה אנשים ב-800 ₪</div><div class="cm-t">14:32</div></div>
          <div class="cm bot"><div class="cm-b">ברשותך! הנה ארוחת ברביקיו לשישה 🍖<br><br>• אנטריקוט 1.5ק"ג – 240₪<br>• שיפודי עוף 12 יח' – 120₪<br>• צוואר כבש 1ק"ג – 180₪<br>• קבבים 500ג – 85₪<br><br>סה"כ: 625₪ – נשאר תקציב לתוספות!</div><div class="cm-t">14:32</div></div>
          <div class="cm usr"><div class="cm-b">מצויין! אפשר לאסוף היום?</div><div class="cm-t">14:33</div></div>
          <div class="cm bot"><div class="cm-b">✅ כן! יש מקום ב-16:00 או ב-18:00<br>איזה שעה נוחה לך?</div><div class="cm-t">14:33</div></div>
        </div>
      </div>
      <div class="convo-info reveal-left">
        <div class="stag">תרחיש 03</div>
        <h3>תפריט שלם<br>תוך שניות</h3>
        <p>הלקוח הגיע עם תקציב – pini בנה תפריט, חישב מחירים ותיאם איסוף. הכל בארבע הודעות.</p>
        <div class="highlights">
          <div class="hl"><div class="hl-dot">💰</div><span>בונה תפריט לפי תקציב מדויק</span></div>
          <div class="hl"><div class="hl-dot">🛒</div><span>מציע תוספות בטבעיות</span></div>
          <div class="hl"><div class="hl-dot">🕓</div><span>תואם שעת איסוף מיד</span></div>
        </div>
      </div>
    </div>

    <div class="convo-panel" id="convo-studio">
      <div class="convo-mock reveal-scale">
        <div class="convo-hdr"><div class="convo-av">🎨</div><div><div class="convo-nm">סטודיו צבע ויוצרים</div><div class="convo-st">● פעיל</div></div></div>
        <div class="convo-msgs">
          <div class="cm usr"><div class="cm-b">ראיתי את הסדנה שפרסמתם – יש עוד מקומות?</div><div class="cm-t">19:47</div></div>
          <div class="cm bot"><div class="cm-b">כן! נשארו 3 מקומות לסדנת אקריליק 🎨<br><br>📅 שבת, 10:00–13:00<br>💰 280₪ – כולל כל החומרים<br>👥 קבוצה קטנה של 8 אנשים<br><br>רוצה להירשם?</div><div class="cm-t">19:47</div></div>
          <div class="cm usr"><div class="cm-b">כן! אני ובת הזוג שלי</div><div class="cm-t">19:48</div></div>
          <div class="cm bot"><div class="cm-b">נהדר! 2 מקומות = 560₪ 🖌️<br>אשלח קישור לתשלום ואישור רישום<br>מצפים לראותכם!</div><div class="cm-t">19:48</div></div>
        </div>
      </div>
      <div class="convo-info reveal-left">
        <div class="stag">תרחיש 04</div>
        <h3>פוסט אחד<br>מלא את הסדנה</h3>
        <p>תוך 2 דקות מה-DM הראשון – pini רשם שניים, שלח קישור תשלום וסגר את המקומות.</p>
        <div class="highlights">
          <div class="hl"><div class="hl-dot">🖼️</div><span>עונה לפניות מפוסטים מיידית</span></div>
          <div class="hl"><div class="hl-dot">👥</div><span>מנהל רישום לכמה משתתפים</span></div>
          <div class="hl"><div class="hl-dot">💳</div><span>שולח קישור תשלום אוטומטי</span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="chat-demo">
  <div class="container">
    <div class="chat-demo-grid">
      <div class="chat-side-info reveal">
        <div class="stag">נסה עכשיו</div>
        <h2 class="stitle">דבר איתו<br><span class="grad">עכשיו</span></h2>
        <p>קבע איתנו פגישת היכרות לגמרי בחינם!</p>
        <div class="quick-btns">
          <button class="qbtn" onclick="sendQ('מה pini יכול לעשות לעסק שלי?')">💼 מה pini יכול לעשות עבורי?</button>
          <button class="qbtn" onclick="sendQ('כמה זמן לוקח להקים?')">⏱️ כמה זמן לוקח להקים?</button>
          <button class="qbtn" onclick="sendQ('מה העלות?')">💰 מה העלות?</button>
          <button class="qbtn" onclick="sendQ('אני רוצה לקבוע פגישת הדגמה')">📅 רוצה לקבוע פגישה</button>
        </div>
      </div>
      <div class="chat-widget reveal" style="transition-delay:.15s">
        <div class="cw-header">
          <div class="cw-av">🤖</div>
          <div>
            <div class="cw-name">pini – נציג ההדגמה</div>
            <div class="cw-status"><span class="online-dot"></span> פעיל עכשיו</div>
          </div>
        </div>
        <div class="cw-msgs" id="cw-msgs">
          <div class="cw-msg ass"><div class="cw-mb">שלום! אני pini 👋<br>שמח לעזור לך לגלות<br>מה אני יכול לעשות לעסק שלך.</div></div>
        </div>
        <div class="cw-input-row">
          <input class="cw-input" id="cw-input" placeholder="כתוב הודעה..." onkeydown="if(event.key==='Enter')cwSend()">
          <button class="cw-send" id="cw-send-btn" onclick="cwSend()">➤</button>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="features">
  <div class="container">
    <div class="reveal">
      <div class="stag">למה pini</div>
      <h2 class="stitle">היתרון<br>שלנו</h2>
    </div>
    <div class="features-grid">
      <div class="feat-card reveal" style="transition-delay:.05s">
        <div class="feat-icon">💬</div>
        <h3 class="feat-title">אין יותר לידים אבודים</h3>
        <p class="feat-desc">כל וואטסאפ מקבל תשובה תוך שניות – לא אחרי שעה כשהלקוח כבר אצל המתחרה. pini סוגר שיחות בשבילך בזמן שאתה עובד.</p>
      </div>
      <div class="feat-card reveal" style="transition-delay:.1s">
        <div class="feat-icon">🌙</div>
        <h3 class="feat-title">עובד 24/7 בלי שכר</h3>
        <p class="feat-desc">בשעה 23:00 כשאתה כבר בבית, pini ממשיך לענות, לתאם תורים ולסגור הזמנות. בלי שעות נוספות, בלי עלות נוספת.</p>
      </div>
      <div class="feat-card reveal" style="transition-delay:.15s">
        <div class="feat-icon">🪄</div>
        <h3 class="feat-title">מדבר בשפה של הלקוחות שלך</h3>
        <p class="feat-desc">pini לומד את המוצרים, המחירים והסגנון של העסק שלך – ומרגיש ללקוח כאילו הוא מדבר איתך ישירות.</p>
      </div>
      <div class="feat-card reveal" style="transition-delay:.2s">
        <div class="feat-icon">📊</div>
        <h3 class="feat-title">שליטה מלאה בלחיצה</h3>
        <p class="feat-desc">רואים כל שיחה, כל ליד וכל הזמנה מפאנל ניהול פשוט. לעדכן מבצע או לשנות מחיר – שניות. ללא ידע טכני בכלל.</p>
      </div>
    </div>
  </div>
</section>

<section id="faq">
  <div class="container">
    <div class="reveal">
      <div class="stag">שאלות נפוצות</div>
      <h2 class="stitle">יש לך שאלות?<br><span class="grad">יש לנו תשובות</span></h2>
    </div>
    <div class="faq-wrap">
      <div class="faq-item reveal" style="transition-delay:.05s">
        <div class="faq-q" onclick="toggleFaq(this.parentElement)">כמה זמן לוקח להקים?<span class="faq-icon">▼</span></div>
        <div class="faq-a">בין 30 דקות לשעה. נעבור יחד על המוצרים, המחירים והמבצעים של הצ'אט – ואחרי תצא עם צ'אטבוט עובד.</div>
      </div>
      <div class="faq-item reveal" style="transition-delay:.1s">
        <div class="faq-q" onclick="toggleFaq(this.parentElement)">האם צריך ידע טכני?<span class="faq-icon">▼</span></div>
        <div class="faq-a">בכלל לא. הפאנל שלנו נבנה לעסקים מקומיים רגילים. שומר את פרטיך ומגדיר הכל בלחיצה.</div>
      </div>
      <div class="faq-item reveal" style="transition-delay:.15s">
        <div class="faq-q" onclick="toggleFaq(this.parentElement)">מה קורה אם לקוח שואל שהצ'אט לא יודע?<span class="faq-icon">▼</span></div>
        <div class="faq-a">הצ'אט מפנה לאיש קשר בעסק. אם אין מה שנראה לך – אנחנו תמיד נשפר אותו.</div>
      </div>
      <div class="faq-item reveal" style="transition-delay:.2s">
        <div class="faq-q" onclick="toggleFaq(this.parentElement)">מה העלות?<span class="faq-icon">▼</span></div>
        <div class="faq-a">מתחיל ב-199₪ לחודש – תוכנית מלאה עם עדכון לעסק ובשיחות ללא הגבלה. אם לא תהיה מרוצה פעם ראשונה, תקבל החזר מלא.</div>
      </div>
      <div class="faq-item reveal" style="transition-delay:.25s">
        <div class="faq-q" onclick="toggleFaq(this.parentElement)">האם עובד עם WhatsApp?<span class="faq-icon">▼</span></div>
        <div class="faq-a">כן! ניתן לחבר לשירות ה-WhatsApp Business שלך. אפשר גם להטמיע באתר.</div>
      </div>
    </div>
  </div>
</section>

<section id="lead">
  <div class="container">
    <div class="lead-box reveal">
      <div class="lead-orb1"></div>
      <div class="lead-orb2"></div>
      <h2 class="lead-title">רוצה <span class="grad">לדעת יותר?</span></h2>
      <p class="lead-sub">השאר פרטים ונחזור אליך תוך 24 שעות</p>
      <form class="lead-form" onsubmit="submitLead(event)">
        <input class="lead-inp" type="text" placeholder="שם מלא" required id="l-name">
        <input class="lead-inp" type="tel" placeholder="מספר טלפון" required id="l-phone">
        <select class="lead-sel" required id="l-type">
          <option value="" disabled selected>סוג עסק</option>
          <option>קצביה</option><option>חנות דגים</option><option>ירקן / פירות</option>
          <option>מאפייה</option><option>מכולת</option><option>אחר</option>
        </select>
        <button type="submit" class="lead-btn">שלח – נחזור אליך</button>
      </form>
      <div class="lead-ok" id="lead-ok">✅ קיבלנו! נחזור אליך תוך 24 שעות. נשמח לדבר!</div>
    </div>
  </div>
</section>
</main>

<footer>
  <div class="container">
    <div class="footer-inner">
      <div class="footer-logo">pini</div>
      <div class="footer-links">
        <a href="#">פרטיות</a>
        <a href="#">תנאי שימוש</a>
        <a href="#lead">צור קשר</a>
      </div>
    </div>
    <div class="footer-copy">© 2025 pini – הצ'אטבוט שעובד בשבילך</div>
  </div>
</footer>

<script>
/* ── CANVAS BG ── */
(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.5 + 0.1;
    const cols = ['79,142,255', '162,89,255', '0,229,255'];
    this.color = cols[Math.floor(Math.random() * cols.length)];
  }

  function init() {
    resize();
    particles = [];
    const count = Math.floor((W * H) / 12000);
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + p.color + ',' + p.alpha + ')';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', init);
  init();
  draw();
})();

/* ── SCROLL REVEAL ── */
(function() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale');
  const obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(function(el) { obs.observe(el); });
})();

/* ── COUNTER ANIMATION ── */
(function() {
  document.querySelectorAll('.stat-num').forEach(function(el) {
    var obs = new IntersectionObserver(function(entries) {
      if (!entries[0].isIntersecting) return;
      obs.disconnect();
      var target = +el.dataset.count;
      var suffix = el.dataset.suffix || '';
      var current = 0;
      var step = target / 80;
      var timer = setInterval(function() {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current) + suffix;
        if (current >= target) clearInterval(timer);
      }, 16);
    });
    obs.observe(el);
  });
})();

/* ── HERO TYPING ── */
setTimeout(function() {
  var t = document.getElementById('hero-typing');
  if (!t) return;
  var msg = document.createElement('div');
  msg.className = 'pb pb-bot';
  msg.innerHTML = '✅ אמור לי מתי נוח לאסוף<br>ואני אשריין לאדמין!';
  t.parentNode.replaceChild(msg, t);
}, 3200);

/* ── CONVERSATION TABS ── */
function showConvo(id, btn) {
  document.querySelectorAll('.convo-panel').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
  document.getElementById('convo-' + id).classList.add('active');
  btn.classList.add('active');
}

/* ── FAQ ── */
function toggleFaq(item) {
  var isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(function(i) { i.classList.remove('open'); });
  if (!isOpen) item.classList.add('open');
}

/* ── DEMO CHAT ── */
var CANNED = {
  'מה pini יכול לעשות לעסק שלי?': 'pini יכול לענות ללקוחות 24/7, לסגור הזמנות, לתאם תורים ולשלוח מידע על מבצעים – הכל אוטומטי, בלי שתצטרך להיות זמין. 🚀',
  'כמה זמן לוקח להקים?': 'בין 30 דקות לשעה. מכינים את כל הפרטים ביחד ואחרי זה הכל עולה לאוויר. לא צריך שום ידע טכני! ⚡',
  'מה העלות?': 'מתחיל ב-199₪ לחודש עם כל התכונות ושיחות ללא הגבלה. יש גם ניסיון בחינם! 🎁',
  'אני רוצה לקבוע פגישת הדגמה': 'מעולה! השאר את פרטיך בטופס למטה ונחזור אליך תוך 24 שעות לתיאום פגישה נוחה. 📅'
};

function addMsg(type, text) {
  var msgs = document.getElementById('cw-msgs');
  var div = document.createElement('div');
  div.className = 'cw-msg ' + type;
  div.innerHTML = '<div class="cw-mb">' + text.replace(/\n/g, '<br>') + '</div>';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function cwSend() {
  var inp = document.getElementById('cw-input');
  var btn = document.getElementById('cw-send-btn');
  var text = inp.value.trim();
  if (!text) return;
  addMsg('usm', text);
  inp.value = '';
  btn.disabled = true;
  setTimeout(function() {
    var reply = CANNED[text] || 'תודה על השאלה! צוות pini ישמח לענות. מלא את הטופס למטה ונחזור אליך בהקדם 👇';
    addMsg('ass', reply);
    btn.disabled = false;
  }, 900);
}

function sendQ(q) {
  document.getElementById('cw-input').value = q;
  cwSend();
  setTimeout(function() {
    document.getElementById('chat-demo').scrollIntoView({ behavior: 'smooth' });
  }, 50);
}

/* ── LEAD FORM ── */
function submitLead(e) {
  e.preventDefault();
  document.querySelector('.lead-form').style.display = 'none';
  document.getElementById('lead-ok').style.display = 'block';
}
</script>
</body>
</html>`

  return (
    <iframe
      srcDoc={html}
      title="דף נחיתה"
      style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
      sandbox="allow-scripts allow-same-origin"
    />
  )
}
