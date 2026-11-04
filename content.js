(() => {
  if (window.__traductorPreciso) return;
  window.__traductorPreciso = true;

  const HOST_ID = "traductor-preciso-host";
  let host, body, copyBtn, lastText = "", origText = "";

  const css = `
    :host { all: initial; }
    .panel { position: fixed; z-index: 2147483647; width: min(420px, calc(100vw - 16px));
      max-height: 60vh; display: flex; flex-direction: column; border-radius: 10px;
      font: 15px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif;
      background: #fff; color: #1d1d1f; border: 1px solid #d0d0d5;
      box-shadow: 0 8px 30px rgba(0,0,0,.2); }
    @media (prefers-color-scheme: dark) {
      .panel { background: #26262b; color: #ececf0; border-color: #45454d; } }
    .bar { display: flex; align-items: center; justify-content: space-between;
      padding: 8px 12px; font-size: 12px; opacity: .75; border-bottom: 1px solid rgba(128,128,128,.3); }
    .bar button { all: unset; cursor: pointer; padding: 2px 8px; border-radius: 6px; font-size: 12px; }
    .bar button:hover { background: rgba(128,128,128,.25); }
    .body { padding: 12px; overflow-y: auto; white-space: pre-wrap; word-wrap: break-word; }
    .err { color: #c0392b; }
  `;

  function ensure() {
    host = document.getElementById(HOST_ID);
    if (host) return;
    host = document.createElement("div");
    host.id = HOST_ID;
    const root = host.attachShadow({ mode: "open" });
    root.innerHTML = `<style>${css}</style>
      <div class="panel">
        <div class="bar"><span>Traducción</span>
          <span><button id="rev">⇄ Revertir</button><button id="copy">Copiar</button><button id="close">✕</button></span></div>
        <div class="body"></div>
      </div>`;
    document.documentElement.appendChild(host);
    body = root.querySelector(".body");
    copyBtn = root.getElementById("copy");
    root.getElementById("close").onclick = hide;
    root.getElementById("rev").onclick = () => {
      if (lastText) chrome.runtime.sendMessage({ type: "reverse", text: lastText, original: origText });
    };
    copyBtn.onclick = async () => {
      try { await navigator.clipboard.writeText(lastText); copyBtn.textContent = "¡Copiado!";
        setTimeout(() => (copyBtn.textContent = "Copiar"), 1200); } catch (e) {}
    };
  }

  function position() {
    const panel = host.shadowRoot.querySelector(".panel");
    let rect = null;
    const sel = window.getSelection();
    if (sel && sel.rangeCount) rect = sel.getRangeAt(0).getBoundingClientRect();
    const w = Math.min(420, window.innerWidth - 16);
    let left = rect ? rect.left : window.innerWidth - w - 16;
    let top = rect ? rect.bottom + 8 : 16;
    left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
    if (top > window.innerHeight - 160) top = Math.max(8, (rect ? rect.top : 200) - 200);
    panel.style.left = left + "px";
    panel.style.top = top + "px";
  }

  function hide() { const h = document.getElementById(HOST_ID); if (h) h.remove(); }

  document.addEventListener("keydown", (e) => { if (e.key === "Escape") hide(); });

  chrome.runtime.onMessage.addListener((msg, _s, reply) => {
    if (msg.type === "getSelection") {
      reply({ text: window.getSelection().toString() });
      return;
    }
    if (msg.type === "loading") {
      origText = msg.original || "";
      hide(); ensure(); position();
      body.className = "body"; body.textContent = "Traduciendo…";
    } else if (msg.type === "result") {
      ensure(); lastText = msg.text; body.className = "body"; body.textContent = msg.text;
    } else if (msg.type === "error") {
      ensure(); body.className = "body err"; body.textContent = msg.message;
    }
  });
})();
