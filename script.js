/* =========================================================
   Portfólio — Sofia Sousa · script.js
   ========================================================= */

/* ---------- [EDITAR] A TUA STACK ----------
   cat: front | back | tool
   lvl: 0–100 (quanto dominas)
   use: onde/como usaste (aparece ao clicar)           */
const STACK = [
  { sym: "Ht", name: "HTML5",      cat: "front", lvl: 90, color: "#e34f26", use: "Base de todos os meus projetos. Estrutura semântica e acessível." },
  { sym: "Cs", name: "CSS3",       cat: "front", lvl: 85, color: "#2965f1", use: "Layouts com Grid e Flexbox, animações, temas claro/escuro, design responsivo." },
  { sym: "Js", name: "JavaScript", cat: "front", lvl: 72, color: "#d4a800", use: "Carrinho de compras, interações da loja Northside e este terminal." },
  { sym: "Bs", name: "Bootstrap 5",cat: "front", lvl: 80, color: "#7952b3", use: "Front-end da loja Northside: grelha, componentes e responsividade." },
  { sym: "Ph", name: "PHP",        cat: "back",  lvl: 70, color: "#777bb4", use: "Back-end e backoffices da Northside, Macau D’Ouro e Casas & Propriedades, e este formulário." },
  { sym: "Py", name: "Python",     cat: "back",  lvl: 62, color: "#3776ab", use: "Aprendido na formação Full Stack da CodeMaster: lógica de programação, scripts e exercícios práticos." },
  { sym: "Sq", name: "MySQL",      cat: "back",  lvl: 65, color: "#00758f", use: "Bases de dados da Northside, Macau D’Ouro e Casas & Propriedades, com PDO e consultas preparadas." },
  { sym: "St", name: "Stripe",     cat: "back",  lvl: 55, color: "#635bff", use: "Pagamentos com Apple Pay, Google Pay, MB WAY e Klarna." },
  { sym: "Co", name: "Composer",   cat: "tool",  lvl: 50, color: "#885630", use: "Gestão de dependências PHP (Stripe e PHPMailer) na Northside." },
  { sym: "Git",name: "Git & GitHub",cat: "tool", lvl: 60, color: "#f05032", use: "Controlo de versões e partilha de código." },
  { sym: "Cp", name: "cPanel",     cat: "tool",  lvl: 70, color: "#ff6c2c", use: "Alojamento, File Manager, bases de dados e emails em produção." },
  { sym: "Vs", name: "VS Code",    cat: "tool",  lvl: 85, color: "#0078d7", use: "O meu editor de todos os dias." },
  { sym: "Ai", name: "IA / Prompting", cat: "tool", lvl: 75, color: "#d97757", use: "Uso IA para acelerar, depurar e aprender — e sei rever o que ela escreve." },
];

/* Frases do título rotativo — [EDITAR] */
const ROTATOR = [
  "construo lojas online",
  "ligo front-end a bases de dados",
  "resolvo bugs em produção",
  "aprendo o que for preciso",
  "entrego projetos acabados",
];

/* ---------- UTIL ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};

/* ---------- TEMA ---------- */
(function theme() {
  const saved = store.get("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = saved || (prefersDark ? "dark" : "light");
  $("#themeToggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    store.set("theme", next);
  });
})();

/* ---------- NAV ---------- */
(function nav() {
  const nav = $(".nav"), links = $("#navLinks"), burger = $("#burger");
  addEventListener("scroll", () => nav.classList.toggle("is-scrolled", scrollY > 10), { passive: true });
  burger.addEventListener("click", () => links.classList.toggle("is-open"));
  $$("a", links).forEach(a => a.addEventListener("click", () => links.classList.remove("is-open")));
})();

/* ---------- TÍTULO ROTATIVO (efeito máquina de escrever) ---------- */
(function rotator() {
  const el = $("#rotator");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let i = 0, char = ROTATOR[0].length, deleting = true;
  function tick() {
    const word = ROTATOR[i];
    char += deleting ? -1 : 1;
    el.textContent = word.slice(0, char);
    let delay = deleting ? 35 : 65;
    if (!deleting && char === word.length) { deleting = true; delay = 2200; }
    else if (deleting && char === 0) { deleting = false; i = (i + 1) % ROTATOR.length; delay = 300; }
    setTimeout(tick, delay);
  }
  setTimeout(tick, 2500);
})();

/* ---------- TABELA PERIÓDICA ---------- */
(function periodic() {
  const grid = $("#periodic"), detail = $("#elementDetail");
  const catName = { front: "Front-end", back: "Back-end", tool: "Ferramenta" };

  grid.innerHTML = STACK.map((s, idx) => `
    <button class="el" data-cat="${s.cat}" data-i="${idx}" style="--c:${s.color}; --lvl:${s.lvl}%">
      <span class="el__num">${String(idx + 1).padStart(2, "0")}</span>
      <span class="el__sym">${s.sym}</span>
      <span class="el__name">${s.name}</span>
      <span class="el__bar"><i></i></span>
    </button>`).join("");

  function select(btn) {
    $$(".el", grid).forEach(b => b.classList.remove("is-selected"));
    btn.classList.add("is-selected");
    const s = STACK[btn.dataset.i];
    const level = s.lvl >= 80 ? "Confortável" : s.lvl >= 60 ? "Uso com autonomia" : "A aprofundar";
    detail.innerHTML = `
      <h4>${s.name} <small style="font:400 .8rem var(--f-mono);color:var(--ink-2)">· ${catName[s.cat]}</small></h4>
      <p>${s.use}</p>
      <p class="lvl">Nível: ${level} (${s.lvl}%)</p>`;
  }

  grid.addEventListener("click", e => { const b = e.target.closest(".el"); if (b) select(b); });
  grid.addEventListener("mouseover", e => {
    const b = e.target.closest(".el");
    if (b && matchMedia("(hover: hover)").matches) select(b);
  });

  $("#stackFilters").addEventListener("click", e => {
    const chip = e.target.closest(".chip"); if (!chip) return;
    $$(".chip").forEach(c => c.classList.toggle("is-active", c === chip));
    const f = chip.dataset.filter;
    $$(".el", grid).forEach(el => el.classList.toggle("is-dim", f !== "all" && el.dataset.cat !== f));
  });
})();

/* ---------- TERMINAL INTERATIVO ---------- */
(function terminal() {
  const body = $("#termBody"), form = $("#termForm"), input = $("#termInput");
  const history = []; let hIdx = 0;

  const COMMANDS = {
    ajuda: () => `Comandos disponíveis:
  <span class="t-cmd">sobre</span>      quem sou eu
  <span class="t-cmd">stack</span>      linguagens que uso
  <span class="t-cmd">projetos</span>   o que construí
  <span class="t-cmd">onde</span>       onde trabalho
  <span class="t-cmd">contratar</span>  vamos falar
  <span class="t-cmd">tema</span>       claro / escuro
  <span class="t-cmd">limpar</span>     limpa o ecrã`,
    sobre: () => "Micaela Sofia Sousa — web developer no Porto. PHP, MySQL, JavaScript e Python. Autónoma, rápida a aprender, focada em entregar.",
    stack: () => STACK.map(s => `${s.name.padEnd(15, " ")} ${"█".repeat(Math.round(s.lvl / 10))}${"░".repeat(10 - Math.round(s.lvl / 10))}`).join("\n"),
    onde: () => "📍 Porto. Presencial ou híbrido no Grande Porto, ou remoto.",
    projetos: () => { go("#projetos"); return "→ Northside (e-commerce em PHP + MySQL)\n→ Macau D’Ouro (reservas + backoffice)\n→ Casas & Propriedades (imobiliário)\n→ CMPNEUS (cliente real)\n<span class='t-muted'>a levar-te para a secção de projetos...</span>"; },
    contratar: () => { go("#contacto"); return "<span class='t-ok'>Excelente escolha.</span> A abrir o contacto..."; },
    tema: () => { $("#themeToggle").click(); return "Tema alterado."; },
    limpar: () => { body.innerHTML = ""; return null; },
    sudo: () => "Boa tentativa 😄 Mas podes contratar-me sem sudo: escreve <span class='t-cmd'>contratar</span>.",
    ola: () => "Olá! 👋 Escreve <span class='t-cmd'>ajuda</span> para veres o que sei fazer.",
  };
  COMMANDS.help = COMMANDS.ajuda; COMMANDS.clear = COMMANDS.limpar; COMMANDS.hire = COMMANDS.contratar;
  COMMANDS["olá"] = COMMANDS.ola;

  function go(sel) { setTimeout(() => $(sel).scrollIntoView({ behavior: "smooth" }), 600); }
  function print(html, cls = "") {
    const p = document.createElement("p");
    if (cls) p.className = cls;
    p.innerHTML = html;
    body.appendChild(p);
    body.scrollTop = body.scrollHeight;
  }
  const esc = s => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  form.addEventListener("submit", e => {
    e.preventDefault();
    const raw = input.value.trim(); if (!raw) return;
    history.push(raw); hIdx = history.length;
    print(`<span class="t-prompt">❯</span> ${esc(raw)}`);
    const fn = COMMANDS[raw.toLowerCase()];
    const out = fn ? fn() : `Comando não encontrado: ${esc(raw)}. Escreve <span class="t-cmd">ajuda</span>.`;
    if (out) print(out);
    input.value = "";
  });

  input.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" && hIdx > 0) { input.value = history[--hIdx]; e.preventDefault(); }
    if (e.key === "ArrowDown") { hIdx = Math.min(history.length, hIdx + 1); input.value = history[hIdx] || ""; }
  });
  $("#terminal").addEventListener("click", () => input.focus({ preventScroll: true }));
})();

/* ---------- REVEAL AO FAZER SCROLL ---------- */
(function reveal() {
  const targets = $$(".section__title, .about__text, .why__card, .periodic, .case, .project, .deal__card, .contact__grid");
  targets.forEach(t => t.classList.add("reveal"));
  const list = $(".deal__list");
  $$("li", list).forEach((li, i) => (li.style.transitionDelay = `${i * 90}ms`));

  if (!("IntersectionObserver" in window)) {
    targets.forEach(t => t.classList.add("is-visible")); list.classList.add("is-visible"); return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
  }, { threshold: .15 });
  [...targets, list].forEach(t => io.observe(t));
})();

/* ---------- COPIAR EMAIL ---------- */
(function copyMail() {
  const btn = $("#copyMail"), hint = $("#copyHint");
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.mail);
      hint.textContent = "✓ copiado!";
    } catch {
      location.href = "mailto:" + btn.dataset.mail;
    }
    setTimeout(() => (hint.textContent = "clica para copiar"), 2000);
  });
})();

/* ---------- FORMULÁRIO DE CONTACTO (envia para contact.php) ---------- */
(function contactForm() {
  const form = $("#contactForm"), status = $("#formStatus");
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  form.addEventListener("submit", async e => {
    e.preventDefault();
    status.className = "form__status"; status.textContent = "";

    // validação no cliente
    let ok = true;
    $$("[required]", form).forEach(f => {
      const bad = !f.value.trim() || (f.type === "email" && !emailRe.test(f.value.trim()));
      f.classList.toggle("is-invalid", bad);
      if (bad) ok = false;
    });
    if (!ok) { status.classList.add("err"); status.textContent = "Preenche os campos assinalados."; return; }

    const btn = $("button[type=submit]", form);
    btn.disabled = true; btn.textContent = "A enviar…";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" },
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || "Erro");
      status.classList.add("ok");
      status.textContent = "✓ Mensagem enviada! Respondo em breve.";
      form.reset();
    } catch (err) {
      status.classList.add("err");
      status.innerHTML = `Não foi possível enviar. Escreve-me diretamente para <a href="mailto:${$("#copyMail").dataset.mail}">${$("#copyMail").dataset.mail}</a>.`;
    } finally {
      btn.disabled = false; btn.textContent = "Enviar mensagem →";
    }
  });
})();

/* ---------- ANO NO RODAPÉ + mensagem na consola (recrutadores técnicos abrem-na!) ---------- */
$("#year").textContent = new Date().getFullYear();
console.log("%cOlá, curioso(a)! 👋", "font-size:20px;font-weight:bold;color:#2b3cff");
console.log("Se estás a ler isto, provavelmente és developer. Vamos falar: sofia04sousa@icloud.com");
