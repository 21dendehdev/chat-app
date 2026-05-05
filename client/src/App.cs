cat > ~/Chat-App/client/src/App.css << 'ENDCSS'
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --orange:       #FF6B2B;
  --orange2:      #e85a1a;
  --orange3:      #ff8c5a;
  --orange-light: rgba(255,107,43,0.12);
  --orange-glow:  rgba(255,107,43,0.25);
  --bg:           #1a0f0a;
  --bg2:          #221408;
  --bg3:          #2e1c0e;
  --bg4:          #3a2414;
  --white:        #ffffff;
  --text:         #fff8f5;
  --text2:        #c4a898;
  --text3:        #7a5a4a;
  --green:        #3ecf8e;
  --red:          #ff6b6b;
  --border:       rgba(255,107,43,0.15);
  --border2:      rgba(255,107,43,0.3);
  --font:         'Inter', sans-serif;
  --r:            16px;
  --rs:           10px;
  --sidebar-w:    300px;
}

html, body, #root {
  width: 100%; height: 100%;
  margin: 0; padding: 0;
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  overflow: hidden;
}

/* ═══════════════════════════════
   AUTH / LOGIN
═══════════════════════════════ */
.auth-shell {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  position: relative;
  overflow: hidden;
}

.auth-shell::before {
  content: '';
  position: absolute;
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(255,107,43,0.15) 0%, transparent 70%);
  top: -200px; left: -200px;
  pointer-events: none;
}

.auth-shell::after {
  content: '';
  position: absolute;
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(255,107,43,0.1) 0%, transparent 70%);
  bottom: -100px; right: -100px;
  pointer-events: none;
}

.auth-card {
  position: relative;
  background: var(--bg2);
  border: 1px solid var(--border2);
  border-radius: 24px;
  padding: 44px 40px;
  width: 420px;
  max-width: 95vw;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px var(--border);
  animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
  z-index: 1;
}

.auth-card::before {
  content: '';
  position: absolute;
  top: 0; left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--orange), transparent);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}

.auth-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.auth-logo-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: var(--orange);
  box-shadow: 0 0 16px var(--orange);
}

.auth-logo-text {
  font-size: 22px;
  font-weight: 700;
  color: var(--white);
  letter-spacing: -0.5px;
}

.auth-tagline {
  font-size: 13px;
  color: var(--text2);
  margin-bottom: 8px;
}

.auth-tabs {
  display: flex;
  background: var(--bg3);
  border-radius: var(--rs);
  padding: 4px;
  gap: 4px;
  border: 1px solid var(--border);
}

.auth-tabs button {
  flex: 1;
  padding: 10px;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--font);
  background: transparent;
  border: none;
  color: var(--text2);
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
}

.auth-tabs button:hover {
  color: var(--text);
  background: var(--bg4);
}

.auth-card input {
  width: 100%;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: var(--rs);
  padding: 12px 16px;
  color: var(--text);
  font-family: var(--font);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
}

.auth-card input:focus {
  border-color: var(--orange);
  background: var(--bg4);
  box-shadow: 0 0 0 3px var(--orange-light);
}

.auth-card input::placeholder { color: var(--text3); }

@media (max-width: 768px) {
  .auth-card input { font-size: 16px; }
  .auth-card { padding: 32px 24px; }
}

.auth-card > button:last-of-type,
.auth-btn {
  width: 100%;
  padding: 13px;
  background: linear-gradient(135deg, var(--orange), var(--orange2));
  border: none;
  border-radius: var(--rs);
  color: #fff;
  font-family: var(--font);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 46px;
  box-shadow: 0 4px 20px var(--orange-glow);
  letter-spacing: 0.3px;
}

.auth-card > button:last-of-type:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--orange3), var(--orange));
  box-shadow: 0 6px 28px var(--orange-glow);
  transform: translateY(-1px);
}

.auth-card > button:last-of-type:disabled { opacity: 0.55; cursor: not-allowed; }

/* ═══════════════════════════════
   APP SHELL
═══════════════════════════════ */
.app-shell, .chat-shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--bg);
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  position: relative;
  background: var(--bg);
}

/* ═══════════════════════════════
   SIDEBAR
═══════════════════════════════ */
.sidebar {
  width: var(--sidebar-w);
  background: var(--bg2);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform 0.3s ease;
  z-index: 100;
}

@media (max-width: 767px) {
  .sidebar {
    position: fixed;
    top: 0; left: 0;
    height: 100%;
    width: 85vw;
    transform: translateX(-100%);
    box-shadow: 8px 0 32px rgba(0,0,0,0.5);
  }
  .sidebar.is-open { transform: translateX(0); }
}

.sidebar-backdrop { display: none; }

@media (max-width: 767px) {
  .sidebar-backdrop {
    display: block;
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.6);
    opacity: 0;
    pointer-events: none;
    transition: 0.3s;
    z-index: 99;
  }
  .sidebar-backdrop.is-open { opacity: 1; pointer-events: auto; }
}

.sidebar-header {
  padding: 20px 16px 12px;
  border-bottom: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: var(--orange);
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-text::before {
  content: '';
  display: inline-block;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--orange);
  box-shadow: 0 0 10px var(--orange);
}

.search-input {
  width: 100%;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 14px;
  color: var(--text);
  font-family: var(--font);
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus {
  border-color: var(--orange);
  box-shadow: 0 0 0 3px var(--orange-light);
}

.search-input::placeholder { color: var(--text3); }

.contact-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 8px;
}

.contact-list::-webkit-scrollbar { width: 4px; }
.contact-list::-webkit-scrollbar-track { background: transparent; }
.contact-list::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }

.empty-state {
  text-align: center;
  color: var(--text3);
  font-size: 13px;
  padding: 40px 16px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.15s;
  position: relative;
  min-height: 56px;
}

.contact-item:hover { background: var(--bg3); }
.contact-item.active { background: var(--orange-light); border: 1px solid var(--border2); }

.contact-avatar-circle {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--orange), var(--orange2));
  display: flex; align-items: center; justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
  position: relative;
}

.online-dot {
  position: absolute;
  bottom: 1px; right: 1px;
  width: 10px; height: 10px;
  border-radius: 50%;
  background: var(--green);
  border: 2px solid var(--bg2);
}

.contact-info { flex: 1; min-width: 0; }

.contact-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.contact-sub {
  font-size: 12px;
  color: var(--text3);
  margin-top: 2px;
}

.unread-badge {
  background: var(--orange);
  color: white;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  min-width: 20px;
  text-align: center;
}

.sidebar-footer {
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg2);
}

.footer-name {
  flex: 1;
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.icon-btn {
  background: var(--bg3);
  border: 1px solid var(--border);
  color: var(--text2);
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  font-size: 15px;
  transition: all 0.15s;
  min-width: 34px; min-height: 34px;
  display: flex; align-items: center; justify-content: center;
}

.icon-btn:hover { background: var(--orange-light); border-color: var(--orange); color: var(--orange); }

.logout-btn {
  background: transparent;
  border: 1px solid rgba(255,107,107,0.3);
  color: #ff9999;
  border-radius: 8px;
  padding: 7px 12px;
  font-size: 12px;
  font-family: var(--font);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.logout-btn:hover { background: rgba(255,107,107,0.1); border-color: #ff6b6b; }

/* ═══════════════════════════════
   SIDEBAR TOGGLE (MOBILE)
═══════════════════════════════ */
.sidebar-toggle {
  display: none;
  position: absolute;
  top: 12px; left: 12px;
  z-index: 10;
  background: var(--bg3);
  border: 1px solid var(--border2);
  color: var(--text);
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 18px;
  cursor: pointer;
  min-height: 44px; min-width: 44px;
}

@media (max-width: 767px) {
  .sidebar-toggle { display: flex; align-items: center; justify-content: center; }
}

/* ═══════════════════════════════
   EMPTY CHAT
═══════════════════════════════ */
.empty-chat {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
}

.empty-chat-inner {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-logo-dot {
  width: 56px; height: 56px;
  border-radius: 50%;
  background: var(--orange-light);
  border: 2px solid var(--border2);
  box-shadow: 0 0 32px var(--orange-glow);
  margin-bottom: 4px;
}

.empty-chat-inner h2 {
  font-size: 22px;
  font-weight: 700;
  color: var(--text);
}

.empty-chat-inner p {
  font-size: 14px;
  color: var(--text2);
}

/* ═══════════════════════════════
   CHAT WINDOW
═══════════════════════════════ */
.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
  background: var(--bg);
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: var(--bg2);
  border-bottom: 1px solid var(--border);
  min-height: 64px;
}

.avatar-wrap { position: relative; flex-shrink: 0; }

.avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--orange), var(--orange2)) !important;
  color: white !important;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px;
  font-weight: 700;
}

.status-dot {
  position: absolute;
  bottom: 1px; right: 1px;
  width: 11px; height: 11px;
  border-radius: 50%;
  border: 2px solid var(--bg2);
}

.status-dot.online { background: var(--green); }
.status-dot.offline { background: var(--text3); }

.chat-header-info { flex: 1; min-width: 0; }

.chat-header-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 8px;
}

.online-pill {
  font-size: 10px;
  font-weight: 600;
  background: rgba(62,207,142,0.15);
  color: var(--green);
  border: 1px solid rgba(62,207,142,0.3);
  border-radius: 20px;
  padding: 2px 8px;
}

.group-pill {
  font-size: 10px;
  font-weight: 600;
  background: var(--orange-light);
  color: var(--orange);
  border: 1px solid var(--border2);
  border-radius: 20px;
  padding: 2px 8px;
}

.chat-header-sub {
  font-size: 12px;
  color: var(--text2);
  margin-top: 2px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.selection-count {
  font-size: 13px;
  color: var(--orange);
  font-weight: 500;
}

.delete-selected-btn {
  background: rgba(255,107,107,0.15);
  border: 1px solid rgba(255,107,107,0.3);
  color: #ff9999;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 12px;
  font-family: var(--font);
  cursor: pointer;
  transition: all 0.15s;
}

.delete-selected-btn:hover { background: rgba(255,107,107,0.25); }

.cancel-select-btn {
  background: var(--bg3);
  border: 1px solid var(--border);
  color: var(--text2);
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 12px;
  font-family: var(--font);
  cursor: pointer;
}

/* ═══════════════════════════════
   MESSAGES AREA
═══════════════════════════════ */
.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.messages-area::-webkit-scrollbar { width: 4px; }
.messages-area::-webkit-scrollbar-track { background: transparent; }
.messages-area::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }

.messages-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 40px;
}

.loading-dots {
  display: flex; gap: 6px; align-items: center;
}

.loading-dots span {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--orange);
  animation: bounce 1.2s infinite;
}

.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
  30% { transform: translateY(-8px); opacity: 1; }
}

.date-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0 8px;
  color: var(--text3);
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.date-divider::before,
.date-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}

.msg-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-bottom: 2px;
  position: relative;
}

.msg-row.out { flex-direction: row-reverse; }
.msg-row.selected { background: var(--orange-light); border-radius: 12px; padding: 4px 8px; }

.message-select-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text3);
  font-size: 14px;
  padding: 4px;
  opacity: 0;
  transition: opacity 0.15s;
  flex-shrink: 0;
}

.msg-row:hover .message-select-btn { opacity: 1; }
.message-select-btn.selected { opacity: 1; color: var(--orange); }

.msg-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--orange), var(--orange2)) !important;
  color: white !important;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}

.msg-avatar.invisible { visibility: hidden; }

.msg-group {
  display: flex;
  flex-direction: column;
  max-width: 65%;
  gap: 2px;
}

.msg-sender-name {
  font-size: 11px;
  color: var(--orange);
  font-weight: 600;
  padding: 0 4px;
  margin-bottom: 2px;
}

.bubble {
  padding: 10px 14px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
  max-width: 100%;
}

.bubble.in {
  background: var(--bg3);
  color: var(--text);
  border: 1px solid var(--border);
  border-bottom-left-radius: 4px;
}

.bubble.out {
  background: linear-gradient(135deg, var(--orange), var(--orange2));
  color: white;
  border-bottom-right-radius: 4px;
  box-shadow: 0 2px 12px var(--orange-glow);
}

.bubble-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 4px;
  font-size: 11px;
  color: var(--text3);
}

.msg-row.out .bubble-meta { justify-content: flex-end; }

.tick { font-size: 11px; }
.tick.read { color: var(--orange); }

.delete-msg-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  opacity: 0;
  transition: opacity 0.15s;
  padding: 2px;
}

.msg-row:hover .delete-msg-btn { opacity: 1; }

/* ═══════════════════════════════
   TYPING INDICATOR
═══════════════════════════════ */
.typing-bubble {
  display: flex;
  align-items: center;
  gap: 5px;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 18px;
  border-bottom-left-radius: 4px;
  padding: 10px 14px;
}

.typing-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--orange);
  animation: bounce 1.2s infinite;
}

.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

.typing-name {
  font-size: 12px;
  color: var(--text2);
  margin-left: 4px;
}

/* ═══════════════════════════════
   INPUT AREA
═══════════════════════════════ */
.input-area {
  padding: 12px 20px 16px;
  background: var(--bg2);
  border-top: 1px solid var(--border);
}

.input-row {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 8px 8px 8px 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-row:focus-within {
  border-color: var(--orange);
  box-shadow: 0 0 0 3px var(--orange-light);
}

.msg-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text);
  font-family: var(--font);
  font-size: 14px;
  resize: none;
  max-height: 120px;
  line-height: 1.5;
  padding: 4px 0;
}

.msg-input::placeholder { color: var(--text3); }

.input-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.attach-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  transition: background 0.15s;
  color: var(--text2);
}

.attach-btn:hover { background: var(--bg4); }

.send-btn {
  background: linear-gradient(135deg, var(--orange), var(--orange2));
  border: none;
  color: white;
  border-radius: 10px;
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
  box-shadow: 0 2px 10px var(--orange-glow);
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.08);
  box-shadow: 0 4px 16px var(--orange-glow);
}

.send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

.input-hint {
  font-size: 11px;
  color: var(--text3);
  margin-top: 8px;
  padding-left: 4px;
}

/* ═══════════════════════════════
   SETTINGS PANEL
═══════════════════════════════ */
.settings-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.settings-panel {
  background: var(--bg2);
  border: 1px solid var(--border2);
  border-radius: 20px;
  width: 420px;
  max-width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 24px 64px rgba(0,0,0,0.6);
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}

.settings-header h2 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
}

.close-btn {
  background: var(--bg3);
  border: 1px solid var(--border);
  color: var(--text2);
  border-radius: 8px;
  width: 32px; height: 32px;
  font-size: 18px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}

.close-btn:hover { background: var(--bg4); color: var(--text); }

.settings-tabs {
  display: flex;
  padding: 12px 16px;
  gap: 8px;
  border-bottom: 1px solid var(--border);
}

.settings-tab {
  padding: 8px 18px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text2);
  font-family: var(--font);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.settings-tab.active {
  background: var(--orange-light);
  border-color: var(--border2);
  color: var(--orange);
}

.settings-tab:hover:not(.active) { background: var(--bg3); color: var(--text); }

.settings-content {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.avatar-preview-card {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}

.avatar-preview {
  width: 80px; height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--orange);
  box-shadow: 0 0 20px var(--orange-glow);
}

.avatar-empty {
  width: 80px; height: 80px;
  border-radius: 50%;
  background: var(--bg3);
  border: 2px dashed var(--border2);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px;
  color: var(--text3);
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text2);
  letter-spacing: 0.3px;
}

.form-group input {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: var(--rs);
  padding: 11px 14px;
  color: var(--text);
  font-family: var(--font);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus {
  border-color: var(--orange);
  box-shadow: 0 0 0 3px var(--orange-light);
}

.primary-btn {
  padding: 11px 20px;
  background: linear-gradient(135deg, var(--orange), var(--orange2));
  border: none;
  border-radius: var(--rs);
  color: white;
  font-family: var(--font);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 3px 14px var(--orange-glow);
}

.primary-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px var(--orange-glow);
}

.primary-btn:disabled { opacity: 0.55; cursor: not-allowed; }

.message.success {
  margin: 0 24px;
  padding: 10px 14px;
  background: rgba(62,207,142,0.12);
  border: 1px solid rgba(62,207,142,0.25);
  color: #6eefc1;
  border-radius: var(--rs);
  font-size: 13px;
}

.message.error {
  margin: 0 24px;
  padding: 10px 14px;
  background: rgba(255,107,107,0.12);
  border: 1px solid rgba(255,107,107,0.25);
  color: #ff9999;
  border-radius: var(--rs);
  font-size: 13px;
}

/* ═══════════════════════════════
   SPINNER
═══════════════════════════════ */
.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

@keyframes spin { to { transform: rotate(360deg); } }
ENDCSS
