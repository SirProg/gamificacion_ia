/* ============================================================
   EduGamify · app.js
   Lógica compartida para las 3 vistas. Detecta la página activa
   por los elementos presentes en el DOM.
   ============================================================ */
(function () {
  "use strict";

  const DATA_URL = "data.json";
  const TUTOR_HELP_LIMIT = 5;

  /* Utilidad: cargar el "backend" simulado */
  async function loadData() {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error("No se pudo cargar data.json");
    return res.json();
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("login-form")) initLogin();
    if (document.getElementById("kpi-promedio")) initDashboard();
    if (document.getElementById("quiz-card") || document.getElementById("quiz-body")) initStudent();
  });

  /* ==========================================================
     1) LOGIN
     ========================================================== */
  function initLogin() {
    const form = document.getElementById("login-form");
    const roleBtns = document.querySelectorAll(".role-btn");
    let target = "dashboard-docente.html";

    roleBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        roleBtns.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        target = btn.dataset.target;
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      window.location.href = target;
    });
  }

  /* ==========================================================
     2) DASHBOARD DOCENTE
     ========================================================== */
  async function initDashboard() {
    let data;
    try {
      data = await loadData();
    } catch (err) {
      console.error(err);
      return;
    }

    const { curso, estadisticasGrupo: g, estudiantes } = data;

    // Contexto
    setText("curso-nombre", curso.nombre);
    setText("docente-nombre", curso.docente);

    // KPIs
    setText("kpi-promedio", g.promedioCalificaciones.toFixed(1));
    setText("kpi-participacion", g.tasaParticipacion + "%");
    setText("kpi-quizzes", g.quizzesCompletados);
    setText("kpi-tiempo", g.tiempoAhorradoDocenteHoras + " h");

    // Tabla
    renderStudentsTable(estudiantes);

    // Generador IA simulado
    setupAIGenerator();

    // Gráficos (Chart.js)
    if (window.Chart) renderCharts(g);
  }

  function renderStudentsTable(estudiantes) {
    const tbody = document.getElementById("students-tbody");
    tbody.innerHTML = "";
    estudiantes.forEach((e) => {
      const gradeClass = e.promedio >= 8 ? "high" : e.promedio >= 6 ? "mid" : "low";
      const badges = e.insignias.length
        ? e.insignias.join(" ")
        : '<span class="none">Sin insignias aún</span>';
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <div class="student-cell"><span class="avatar">${e.avatar}</span> ${e.nombre}</div>
        </td>
        <td><span class="level-pill">⭐ Nivel ${e.nivel}</span></td>
        <td>${e.xp.toLocaleString("es")} XP</td>
        <td><span class="mini-badges">${badges}</span></td>
        <td><span class="grade ${gradeClass}">${e.promedio.toFixed(1)}</span></td>
        <td>
          <span class="bar-mini"><span style="width:${e.participacion}%"></span></span>${e.participacion}%
        </td>`;
      tbody.appendChild(tr);
    });
  }

  function setupAIGenerator() {
    const input = document.getElementById("pdf-input");
    const dropText = document.getElementById("file-drop-text");
    const btn = document.getElementById("btn-generar-quiz");
    const progress = document.getElementById("ai-progress");
    const bar = progress.querySelector(".ai-progress-bar span");
    const text = document.getElementById("ai-progress-text");

    input.addEventListener("change", () => {
      dropText.textContent = input.files.length ? input.files[0].name : "Selecciona un PDF";
    });

    const steps = [
      { p: 25, t: "📖 Leyendo el documento…" },
      { p: 55, t: "🧠 Identificando conceptos clave con IA…" },
      { p: 80, t: "✍️ Redactando 5 preguntas de opción múltiple…" },
      { p: 100, t: "✅ ¡Quiz generado y listo para asignar!" },
    ];

    btn.addEventListener("click", () => {
      progress.hidden = false;
      btn.disabled = true;
      let i = 0;
      bar.style.width = "8%";
      text.textContent = "Analizando documento…";

      const timer = setInterval(() => {
        const step = steps[i];
        bar.style.width = step.p + "%";
        text.textContent = step.t;
        i++;
        if (i >= steps.length) {
          clearInterval(timer);
          btn.disabled = false;
          setTimeout(() => {
            text.textContent = "✅ Quiz \"El ciclo del agua\" creado. Ya está disponible para tus estudiantes.";
          }, 400);
        }
      }, 850);
    });
  }

  function renderCharts(g) {
    Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
    Chart.defaults.color = "#64748b";

    const C = {
      primary: "#0374b5",
      tech: "#4a8ba3",
      gold: "#f6ad55",
      green: "#2f855a",
      danger: "#e5837a",
    };

    // Progreso semanal — línea
    new Chart(document.getElementById("chart-progreso"), {
      type: "line",
      data: {
        labels: g.progresoSemanal.map((d) => d.semana),
        datasets: [{
          label: "Promedio",
          data: g.progresoSemanal.map((d) => d.promedio),
          borderColor: C.primary,
          backgroundColor: "rgba(3,116,181,.12)",
          fill: true, tension: .35, borderWidth: 3,
          pointBackgroundColor: C.primary, pointRadius: 4,
        }],
      },
      options: baseOpts({ yMax: 10, yMin: 5 }),
    });

    // Temas difíciles — barras horizontales
    new Chart(document.getElementById("chart-temas"), {
      type: "bar",
      data: {
        labels: g.temasDificiles.map((d) => d.tema),
        datasets: [{
          label: "% de error",
          data: g.temasDificiles.map((d) => d.tasaError),
          backgroundColor: g.temasDificiles.map((d) =>
            d.tasaError >= 40 ? C.danger : d.tasaError >= 25 ? C.gold : C.tech),
          borderRadius: 6,
        }],
      },
      options: baseOpts({ indexAxis: "y", yMax: 60, legend: false }),
    });

    // Participación por día — barras
    new Chart(document.getElementById("chart-participacion"), {
      type: "bar",
      data: {
        labels: g.participacionPorDia.map((d) => d.dia),
        datasets: [{
          label: "% participación",
          data: g.participacionPorDia.map((d) => d.porcentaje),
          backgroundColor: C.tech, borderRadius: 6,
        }],
      },
      options: baseOpts({ yMax: 100, legend: false }),
    });

    // Distribución — dona
    new Chart(document.getElementById("chart-distribucion"), {
      type: "doughnut",
      data: {
        labels: ["Alto rendimiento", "Rendimiento medio", "Necesita apoyo"],
        datasets: [{
          data: [g.distribucionRendimiento.alto, g.distribucionRendimiento.medio, g.distribucionRendimiento.bajo],
          backgroundColor: [C.green, C.gold, C.danger],
          borderWidth: 2, borderColor: "#fff",
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: "bottom", labels: { padding: 14, usePointStyle: true } } },
      },
    });
  }

  function baseOpts(o = {}) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: o.indexAxis || "x",
      plugins: { legend: { display: o.legend !== false, position: "top" } },
      scales: {
        x: { grid: { display: o.indexAxis === "y" }, beginAtZero: true, max: o.indexAxis === "y" ? o.yMax : undefined },
        y: {
          grid: { color: "#eef1f4" },
          beginAtZero: o.yMin === undefined,
          min: o.indexAxis === "y" ? undefined : o.yMin,
          max: o.indexAxis === "y" ? undefined : o.yMax,
        },
      },
    };
  }

  /* ==========================================================
     3) ESTUDIANTE — quiz gamificado + tutor IA
     ========================================================== */
  async function initStudent() {
    let data;
    try {
      data = await loadData();
    } catch (err) {
      console.error(err);
      return;
    }

    const quiz = data.quiz;
    const gConf = data.gamificacion;
    const catBadges = data.catalogoInsignias;
    // Perfil del estudiante activo (primero de la lista para la demo)
    const perfil = data.estudiantes[0];

    // Estado de la sesión de juego
    const state = {
      index: 0,
      answered: false,
      correctCount: 0,
      streak: 0,
      xpGained: 0,
      startXP: perfil.xp,
      currentXP: perfil.xp,
      level: perfil.nivel,
      xpToNext: perfil.xpSiguienteNivel,
      newBadges: [],
    };
    let chatbotController;

    // Control del comodín 50/50 (una vez por pregunta)
    const fiftyUsed = new Set();

    // ----- Refs DOM -----
    const el = {
      studentName: id("student-name"),
      hudAvatar: id("hud-avatar"),
      hudLevel: id("hud-level"),
      hudXP: id("hud-xp"),
      xpBar: id("xp-bar"),
      xpFill: id("xp-bar-fill"),
      hudHint: id("hud-hint"),
      hudBadges: id("hud-badges"),
      quizMateria: id("quiz-materia"),
      quizTitle: id("quiz-title"),
      counter: id("quiz-counter"),
      steps: id("quiz-steps"),
      tema: id("question-tema"),
      qText: id("question-text"),
      options: id("options-list"),
      feedback: id("feedback"),
      feedbackText: id("feedback-text"),
      feedbackXP: id("feedback-xp"),
      btnNext: id("btn-next"),
      quizBody: id("quiz-body"),
      result: id("quiz-result"),
      resultScore: id("result-score"),
      resultXP: id("result-xp"),
      resultBadges: id("result-badges"),
      btnRetry: id("btn-retry"),
    };

    // ----- Encabezados -----
    el.studentName.textContent = perfil.nombre;
    el.hudAvatar.textContent = perfil.avatar;
    el.quizMateria.textContent = quiz.materia;
    el.quizTitle.textContent = quiz.titulo;

    // Pasos del progreso
    el.steps.innerHTML = quiz.preguntas
      .map(() => '<span class="step"></span>').join("");

    // Insignias iniciales
    renderHudBadges(perfil.insignias);
    updateHUD();

    // ----- Render de pregunta -----
    function renderQuestion() {
      const q = quiz.preguntas[state.index];
      state.answered = false;

      el.counter.textContent = `Pregunta ${state.index + 1} / ${quiz.preguntas.length}`;
      el.tema.textContent = q.tema;
      el.qText.textContent = q.enunciado;
      el.feedback.hidden = true;
      el.btnNext.disabled = true;
      el.btnNext.textContent = state.index === quiz.preguntas.length - 1 ? "Ver resultados 🏆" : "Siguiente";

      // Pasos
      Array.from(el.steps.children).forEach((s, i) => {
        s.className = "step" + (i < state.index ? " done" : i === state.index ? " current" : "");
      });

      // Opciones
      const keys = ["A", "B", "C", "D"];
      el.options.innerHTML = "";
      q.opciones.forEach((op, i) => {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "option-btn";
        btn.innerHTML = `<span class="option-key">${keys[i]}</span> <span>${op}</span>`;
        btn.addEventListener("click", () => answer(i, btn, q));
        li.appendChild(btn);
        el.options.appendChild(li);
      });
    }

    // ----- Responder -----
    function answer(choice, btn, q) {
      if (state.answered) return;
      state.answered = true;

      const buttons = el.options.querySelectorAll(".option-btn");
      buttons.forEach((b) => (b.disabled = true));

      const isCorrect = choice === q.respuestaCorrecta;
      el.feedback.hidden = false;

      if (isCorrect) {
        btn.classList.add("correct");
        state.correctCount++;
        state.streak++;

        let gained = gConf.xpPorAcierto;
        let bonusMsg = "";
        if (state.streak >= 3) {
          gained += gConf.bonusRacha;
          bonusMsg = ` · 🔥 ¡Racha de ${state.streak}! +${gConf.bonusRacha} bonus`;
          maybeAwardBadge("🔥", catBadges);
        }
        addXP(gained);
        state.xpGained += gained;

        el.feedback.className = "feedback ok";
        el.feedbackText.textContent = q.retroInmediataCorrecta;
        el.feedbackXP.textContent = `+${gained} XP${bonusMsg}`;
      } else {
        btn.classList.add("wrong");
        buttons[q.respuestaCorrecta].classList.add("correct");
        state.streak = 0;

        const gained = gConf.xpPorParticipar;
        addXP(gained);
        state.xpGained += gained;

        el.feedback.className = "feedback no";
        el.feedbackText.textContent = q.retroInmediataIncorrecta;
        el.feedbackXP.textContent = `+${gained} XP por intentarlo · No te rindas, abre el 🤖 Tutor IA para una pista.`;
      }

      el.btnNext.disabled = false;
    }

    // ----- Siguiente / resultado -----
    el.btnNext.addEventListener("click", () => {
      if (state.index < quiz.preguntas.length - 1) {
        state.index++;
        renderQuestion();
        el.quizBody.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else {
        showResult();
      }
    });

    function showResult() {
      // Insignias por desempeño
      if (state.correctCount === quiz.preguntas.length) maybeAwardBadge("🧠", catBadges);
      maybeAwardBadge("🏅", catBadges); // completó un quiz

      Array.from(el.steps.children).forEach((s) => (s.className = "step done"));
      el.quizBody.hidden = true;
      el.result.hidden = false;

      el.resultScore.innerHTML =
        `Acertaste <strong>${state.correctCount}</strong> de ${quiz.preguntas.length} preguntas`;
      el.resultXP.textContent = state.xpGained;
      el.resultBadges.innerHTML = state.newBadges.length
        ? state.newBadges.join(" ")
        : "🎯";
    }

    // ----- Reintentar -----
    el.btnRetry.addEventListener("click", () => {
      state.index = 0;
      state.correctCount = 0;
      state.streak = 0;
      state.xpGained = 0;
      state.currentXP = state.startXP;
      state.newBadges = [];
      fiftyUsed.clear();
      chatbotController?.resetHelpLimit();
      el.quizBody.hidden = false;
      el.result.hidden = true;
      updateHUD();
      renderQuestion();
    });

    // ----- Gamificación -----
    function addXP(amount) {
      state.currentXP += amount;
      // Subida de nivel simulada
      while (state.currentXP >= state.xpToNext) {
        state.level++;
        state.xpToNext = Math.round(state.xpToNext * 1.25);
        maybeAwardBadge("🚀", catBadges);
        showToast(`🚀 ¡Subiste al Nivel ${state.level}!`);
      }
      updateHUD();
    }

    function updateHUD() {
      el.hudLevel.textContent = state.level;
      el.hudXP.textContent = state.currentXP.toLocaleString("es");
      const prevLevelBase = state.xpToNext - Math.round(state.xpToNext / 1.25) || 0;
      const pct = Math.max(6, Math.min(100, (state.currentXP / state.xpToNext) * 100));
      el.xpFill.style.width = pct + "%";
      el.xpBar.setAttribute("aria-valuenow", Math.round(pct));
      el.hudHint.textContent = `Te faltan ${Math.max(0, state.xpToNext - state.currentXP)} XP para el Nivel ${state.level + 1}.`;
    }

    function renderHudBadges(badges) {
      el.hudBadges.innerHTML = badges.map((b) => `<span>${b}</span>`).join("");
    }

    function maybeAwardBadge(icon, catalog) {
      const already = Array.from(el.hudBadges.children).some((s) => s.textContent === icon);
      if (already) return;
      const span = document.createElement("span");
      span.textContent = icon;
      span.classList.add("badge-pop");
      el.hudBadges.appendChild(span);
      state.newBadges.push(icon);
      const info = catalog.find((c) => c.icono === icon);
      if (info) showToast(`${icon} ¡Insignia desbloqueada: ${info.nombre}!`);
    }

    // ----- Toast -----
    let toastTimer;
    function showToast(msg) {
      const toast = id("toast");
      if (!toast) return;
      toast.textContent = msg;
      toast.hidden = false;
      requestAnimationFrame(() => toast.classList.add("show"));
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => (toast.hidden = true), 300);
      }, 2600);
    }

    // ----- Acciones interactivas del Tutor IA -----
    const actions = {
      // 50/50: elimina dos opciones incorrectas de la pregunta actual
      fifty() {
        const q = quiz.preguntas[state.index];
        if (state.answered) {
          addBotMessage("Esta pregunta ya la respondiste 😊. Guarda el 50/50 para la siguiente.");
          return;
        }
        if (fiftyUsed.has(state.index)) {
          addBotMessage("Ya usaste el 50/50 en esta pregunta. ¡Confía en tu razonamiento! 💪");
          return;
        }
        const buttons = Array.from(el.options.querySelectorAll(".option-btn"));
        const wrong = buttons
          .map((b, i) => i)
          .filter((i) => i !== q.respuestaCorrecta && !buttons[i].classList.contains("eliminated"));
        // Dejar la correcta + 1 incorrecta => eliminar el resto
        shuffle(wrong);
        const toRemove = wrong.slice(0, Math.max(1, wrong.length - 1));
        toRemove.forEach((i) => {
          buttons[i].classList.add("eliminated");
          buttons[i].disabled = true;
        });
        fiftyUsed.add(state.index);
        addBotMessage(`🎯 Eliminé ${toRemove.length} opción(es) incorrecta(s). ¡Ahora tienes muchas más probabilidades! Piensa bien entre las que quedan.`);
      },
      // Pista breve
      hint() {
        addBotMessage("💡 Pista breve: " + quiz.preguntas[state.index].pistaBreve);
      },
      // Explicación del concepto
      concept() {
        addBotMessage("📖 " + quiz.preguntas[state.index].explicacionConcepto);
      },
      // Pregunta guía (socrática)
      guide() {
        addBotMessage("❓ Para pensarlo tú: " + quiz.preguntas[state.index].preguntaGuia);
      },
      // Abrir material de estudio del profesor
      material() {
        openMaterialModal(quiz.preguntas[state.index].tema);
      },
    };

    // ----- Chatbot / Tutor IA -----
    chatbotController = setupChatbot(
      data.chatbot,
      () => quiz.preguntas[state.index],
      actions
    );

    // ----- Modal de material de estudio -----
    setupMaterialModal(data.materialEstudio);
    id("btn-material").addEventListener("click", () =>
      openMaterialModal(quiz.preguntas[state.index].tema)
    );

    // Iniciar
    renderQuestion();
  }

  /* ----- Modal de material de estudio (vista estudiante) ----- */
  let _materialData = [];
  function setupMaterialModal(material) {
    _materialData = material || [];
    const overlay = id("material-modal");
    const closeBtn = id("material-close");
    if (!overlay) return;
    closeBtn.addEventListener("click", () => (overlay.hidden = true));
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.hidden = true;
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !overlay.hidden) overlay.hidden = true;
    });
  }

  function openMaterialModal(temaActual) {
    const overlay = id("material-modal");
    const list = id("material-list");
    if (!overlay || !list) return;

    // Recomendados (del tema actual) primero
    const items = _materialData
      .slice()
      .sort((a, b) => (b.tema === temaActual ? 1 : 0) - (a.tema === temaActual ? 1 : 0));

    list.innerHTML = "";
    items.forEach((m) => {
      const reco = m.tema === temaActual;
      const meta = m.tipo === "video"
        ? `⏱️ ${m.duracion}`
        : `📄 ${m.paginas} pág.`;
      const card = document.createElement("div");
      card.className = "material-card" + (reco ? " is-recommended" : "");
      card.innerHTML = `
        <div class="material-card-head">
          <div class="material-thumb ${m.tipo}">${m.tipo === "video" ? "▶" : "📘"}</div>
          <div class="material-info">
            <h3>${m.titulo}</h3>
            <p>${m.descripcion}</p>
            <div class="material-meta">
              <span class="material-tag ${m.tipo}">${m.tipo === "video" ? "Video" : "Documento"}</span>
              <span class="material-tag tema">${m.tema}</span>
              ${reco ? '<span class="material-tag reco">Recomendado ahora</span>' : ""}
              <span class="material-tag tema">${meta}</span>
            </div>
          </div>
          <span class="material-chevron" aria-hidden="true">›</span>
        </div>
        <div class="material-detail">
          ${m.tipo === "video" ? videoPlayerHTML(m) : docPreviewHTML(m)}
        </div>`;

      const head = card.querySelector(".material-card-head");
      head.addEventListener("click", () => card.classList.toggle("open"));

      // Reproductor simulado
      const playBtn = card.querySelector(".play-btn");
      if (playBtn) {
        playBtn.addEventListener("click", (ev) => {
          ev.stopPropagation();
          card.classList.add("open");
          const player = card.querySelector(".video-player");
          player.innerHTML = `<p class="playing-note">▶ Reproduciendo…</p>
            <span class="video-caption">${m.titulo} · ${m.autor}</span>`;
        });
      }
      list.appendChild(card);
    });

    overlay.hidden = false;
  }

  function videoPlayerHTML(m) {
    return `
      <div class="video-player">
        <button type="button" class="play-btn" aria-label="Reproducir video">▶</button>
        <span class="video-caption">${m.titulo} · ${m.autor}</span>
      </div>
      <p class="demo-note">Video de demostración subido por ${m.autor}.</p>`;
  }

  function docPreviewHTML(m) {
    return `
      <div class="doc-preview">
        <strong>${m.titulo}</strong>
        <div class="doc-line"></div>
        <div class="doc-line"></div>
        <div class="doc-line short"></div>
        <div class="doc-line"></div>
      </div>
      <p class="demo-note">Documento de ${m.paginas} páginas subido por ${m.autor}.</p>`;
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /* ----- Chatbot (compartido dentro de la vista estudiante) ----- */
  let _chatOpen = false;
  function openChatbot() {
    const panel = id("chatbot");
    if (!panel || _chatOpen) { if (panel) panel.hidden = false; return; }
    panel.hidden = false;
    _chatOpen = true;
  }

  function addBotMessage(text) {
    const body = id("chatbot-body");
    if (!body) return;
    const typing = document.createElement("div");
    typing.className = "chat-typing";
    typing.textContent = "Tutor IA está escribiendo…";
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;
    setTimeout(() => {
      typing.remove();
      const msg = document.createElement("div");
      msg.className = "chat-msg bot";
      msg.textContent = text;
      body.appendChild(msg);
      body.scrollTop = body.scrollHeight;
    }, 550);
  }

  function setupChatbot(chatData, getCurrentQuestion, actions) {
    const fab = id("fab-chat");
    const panel = id("chatbot");
    const closeBtn = id("chatbot-close");
    const form = id("chatbot-form");
    const input = id("chatbot-input");
    const body = id("chatbot-body");
    const chips = id("chatbot-actions");
    const quota = id("chatbot-help-quota");
    const sendBtn = form?.querySelector('button[type="submit"]');
    const chipButtons = chips?.querySelectorAll(".chip") || [];
    if (!fab || !panel || !form || !input || !body) return null;

    let greeted = false;
    let remainingHelps = TUTOR_HELP_LIMIT;
    let exhaustedMessageTimer;

    function updateHelpQuota() {
      const isExhausted = remainingHelps === 0;
      const isWarning = remainingHelps > 0 && remainingHelps <= 2;

      if (quota) {
        quota.textContent = isExhausted
          ? "Sin ayudas"
          : remainingHelps === 1
            ? "Última ayuda"
            : `${remainingHelps} ayudas`;
        quota.classList.toggle("is-warning", isWarning);
        quota.classList.toggle("is-exhausted", isExhausted);
        quota.setAttribute(
          "aria-label",
          isExhausted
            ? "No quedan ayudas del Tutor IA en este intento"
            : `${remainingHelps} ayudas del Tutor IA disponibles en este intento`
        );
      }

      panel.classList.toggle("is-help-exhausted", isExhausted);
      input.disabled = isExhausted;
      input.placeholder = isExhausted
        ? "No quedan ayudas en este intento"
        : "Escribe tu duda…";
      if (sendBtn) sendBtn.disabled = isExhausted;
      chipButtons.forEach((btn) => { btn.disabled = isExhausted; });
    }

    function useHelp() {
      if (remainingHelps === 0) return false;

      remainingHelps -= 1;
      updateHelpQuota();

      if (remainingHelps === 0) {
        exhaustedMessageTimer = setTimeout(() => {
          addBotMessage(
            "Usaste las 5 ayudas de este intento. Revisa las pistas y sigue con tu razonamiento; tendrás nuevas ayudas si vuelves a intentarlo."
          );
        }, 600);
      }
      return true;
    }

    function resetHelpLimit() {
      clearTimeout(exhaustedMessageTimer);
      remainingHelps = TUTOR_HELP_LIMIT;
      updateHelpQuota();
    }

    function greet() {
      if (greeted) return;
      greeted = true;
      addBotMessage(chatData.saludo);
    }

    function toggle() {
      panel.hidden = !panel.hidden;
      _chatOpen = !panel.hidden;
      if (!panel.hidden) greet();
    }

    fab.addEventListener("click", toggle);
    closeBtn.addEventListener("click", () => { panel.hidden = true; _chatOpen = false; });
    updateHelpQuota();

    // Chips de acciones rápidas: 50/50, pista, concepto, pregunta guía, material
    if (chips && actions) {
      chips.addEventListener("click", (e) => {
        const btn = e.target.closest(".chip");
        if (!btn) return;
        const map = {
          fifty: actions.fifty,
          hint: actions.hint,
          concept: actions.concept,
          guide: actions.guide,
          material: actions.material,
        };
        const fn = map[btn.dataset.action];
        if (fn && useHelp()) fn();
      });
    }

    // Exponer para openChatbot desde el tutor
    window.__eduGreet = greet;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      if (!useHelp()) return;
      const um = document.createElement("div");
      um.className = "chat-msg user";
      um.textContent = text;
      body.appendChild(um);
      body.scrollTop = body.scrollHeight;
      input.value = "";

      // Respuesta "IA": pista contextual + guía socrática (nunca la respuesta)
      const q = getCurrentQuestion();
      const lower = text.toLowerCase();
      let reply;
      if (/respuesta|cuál es|dime la|correcta|resultado/.test(lower) && q) {
        reply = `Mi trabajo es ayudarte a pensar, no darte la respuesta 😊. Sobre "${q.tema}": ${q.pistaIA}`;
      } else if (q && /pista|ayuda|no entiendo|no sé|explica/.test(lower)) {
        reply = q.pistaIA;
      } else {
        const arr = chatData.respuestasGenericas;
        reply = arr[Math.floor(Math.random() * arr.length)];
      }
      addBotMessage(reply);
    });

    return { resetHelpLimit };
  }

  /* ==========================================================
     Helpers
     ========================================================== */
  function id(x) { return document.getElementById(x); }
  function setText(elId, val) { const e = id(elId); if (e) e.textContent = val; }
})();
