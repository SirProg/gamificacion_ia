# 🎓 EduGamify — Plataforma Integrada de Gamificación Educativa y Visualización Docente

> Democratizar el uso de la Inteligencia Artificial en la educación básica: **menos carga administrativa para el docente, más motivación para el estudiante.**

Prototipo funcional (v2) construido con tecnologías web abiertas y sin dependencias pesadas, pensado para ser evaluado en aulas reales dentro de un plan de validación.

---

## 📌 Tabla de contenidos

- [El problema: los dolores que buscamos resolver](#-el-problema-los-dolores-que-buscamos-resolver)
- [La propuesta](#-la-propuesta)
- [Demostración de uso](#-demostración-de-uso)
- [Cómo ejecutarlo](#-cómo-ejecutarlo)
- [Arquitectura del proyecto](#-arquitectura-del-proyecto)
- [Personalización sin programar](#-personalización-sin-programar)
- [Sistema de diseño](#-sistema-de-diseño)
- [Alcance del prototipo](#-alcance-del-prototipo-honestidad-técnica)
- [Hoja de ruta](#-hoja-de-ruta)

---

## 🩹 El problema: los dolores que buscamos resolver

La tecnología educativa suele fracasar porque resuelve problemas que nadie tenía, mientras ignora los que duelen todos los días. Estos son los dolores concretos que originan este proyecto.

### Dolores del docente

| Dolor | Situación actual | Cómo lo aborda EduGamify |
|---|---|---|
| **⏳ El tiempo se va en tareas administrativas** | Diseñar un cuestionario, transcribirlo, calificarlo y tabular resultados consume horas que deberían ir a enseñar. | Generación automática de quizzes a partir del PDF que el docente **ya tiene**. Calificación y tabulación instantáneas. |
| **🔍 Ceguera pedagógica hasta que es tarde** | El docente descubre que el grupo no entendió un tema **cuando ya pasó el examen**, sin margen para reforzar. | Dashboard en tiempo real que expone qué temas concentran el error **mientras el tema aún se está enseñando**. |
| **📉 Datos que no se convierten en decisiones** | Las plataformas arrojan planillas y porcentajes que nadie tiene tiempo de interpretar. | Visualizaciones directas: *qué* tema falla, *quién* necesita apoyo, *cuándo* baja la participación. |
| **😰 Frustración tecnológica** | Herramientas con jerga técnica, configuraciones complejas y curvas de aprendizaje que provocan abandono. | Interfaz sin tecnicismos, flujos de un clic, lenguaje cotidiano. Si el docente necesita un manual, fallamos. |
| **👤 Alumnos invisibles** | En grupos numerosos, el estudiante que se queda atrás en silencio no se detecta a tiempo. | Tabla de progreso individual con nivel, participación y promedio; el bajo rendimiento se señala visualmente. |

### Dolores del estudiante

| Dolor | Situación actual | Cómo lo aborda EduGamify |
|---|---|---|
| **😴 La evaluación se vive como castigo** | Equivocarse solo produce una nota baja; no hay incentivo para intentarlo de nuevo. | Motor de gamificación: XP, niveles e insignias. **Incluso al fallar se gana XP por participar.** |
| **🕐 Retroalimentación que llega tarde** | El resultado llega días después, cuando el momento de aprendizaje ya se perdió. | Retroalimentación **inmediata** tras cada respuesta, explicando el porqué en el instante del error. |
| **🤷 Atascarse sin nadie a quien preguntar** | Al trabar, el estudiante copia la respuesta o abandona la actividad. | Tutor IA disponible en todo momento dentro de la actividad. |
| **🧠 El riesgo de que la IA piense por él** | Un chatbot que da respuestas directas **sustituye** el razonamiento y anula el aprendizaje. | El Tutor IA está diseñado para **negarse a dar la respuesta**. Ofrece pistas, explica el concepto y devuelve preguntas guía. Además, las ayudas son **limitadas**, para que la IA sea un andamiaje y no una muleta. |
| **📚 El material se pierde de vista** | Los recursos del profesor quedan en otra plataforma, lejos del momento en que hacen falta. | Material y videos del docente accesibles **dentro de la actividad**, priorizando el tema de la pregunta actual. |

> ### 🎯 El principio que guía el diseño
> **La IA no debe sustituir el pensamiento del estudiante ni el criterio del docente.**
> Debe devolverle tiempo al docente y darle andamiaje al estudiante. Por eso el tutor niega respuestas, las ayudas se racionan, y el material de estudio —que sí queremos fomentar— **nunca consume ayudas**.

---

## 💡 La propuesta

EduGamify integra en una sola plataforma los dos lados del aula:

### 👩‍🏫 Módulo Docente — Dashboard de analítica en tiempo real

- **4 indicadores clave**: promedio del grupo, tasa de participación, quizzes completados y **horas ahorradas** al docente.
- **4 visualizaciones** (Chart.js):
  - Progreso del grupo (evolución semanal del promedio).
  - **Temas más difíciles**, coloreados por severidad del error — el corazón de la propuesta.
  - Participación por día.
  - Distribución del rendimiento (alto / medio / necesita apoyo).
- **Generador de quiz con IA**: se sube un PDF y la plataforma redacta el cuestionario.
- **Tabla de progreso individual** con nivel, XP, insignias, promedio y participación de cada estudiante.

### 🧑‍🎓 Módulo Estudiante — Actividad gamificada

- Quiz dinámico de 5 preguntas con **retroalimentación inmediata**.
- **HUD de juego**: barra de experiencia animada, nivel actual e insignias desbloqueables.
- **Motor de gamificación parametrizable** (XP por acierto, XP por participar, bonus por racha).
- Notificaciones de logro al subir de nivel u obtener una insignia.
- Acceso al **material de estudio y videos** del profesor sin salir de la actividad.

### 🤖 Tutor IA — Asistente socrático con ayudas limitadas

Botón flotante disponible durante toda la actividad. Ofrece **cuatro tipos de apoyo**, ninguno de los cuales revela la respuesta:

| Acción | Qué hace | ¿Consume ayuda? |
|---|---|:---:|
| 🎯 **50/50** | Elimina opciones incorrectas de la pregunta actual (una vez por pregunta). | Sí |
| 💡 **Pista breve** | Una pista corta y concreta. | Sí |
| 📖 **Explícame el concepto** | Explica la idea de fondo, sin resolver el ejercicio. | Sí |
| ❓ **Pregunta guía** | Devuelve una pregunta socrática para que el estudiante razone. | Sí |
| 📚 **Material de estudio** | Abre los documentos y videos del profesor. | **No** |

**Límite de 5 ayudas por intento.** El contador es visible en todo momento y cambia de color al quedar pocas. Al agotarse, el chat se desactiva por completo —salvo el material de estudio, que siempre queda disponible—. Las ayudas se restauran al reintentar la actividad.

> Si el estudiante escribe *"dime la respuesta"*, el tutor **se niega explícitamente** y reconduce hacia una pista.

---

## 🖥️ Demostración de uso

### Flujo del docente

1. Entra en la landing y elige el perfil **Docente**.
2. Lee de un vistazo los KPIs del grupo.
3. Identifica en el gráfico de **temas difíciles** que *"Evaporación y condensación"* concentra un 46 % de error → decide reforzar ese tema en la próxima clase.
4. Sube el PDF de su material y pulsa **"Generar quiz con IA"**; el cuestionario queda listo para asignar.
5. Revisa la tabla individual para detectar a quién acompañar de cerca.

### Flujo del estudiante

1. Entra con el perfil **Estudiante** y ve su nivel, XP e insignias.
2. Responde la primera pregunta → **acierta**: gana 100 XP y recibe una explicación de por qué es correcta.
3. Encadena 3 aciertos → **bonus de racha** y la insignia 🔥.
4. Se traba en una pregunta → abre el **Tutor IA**, pide una *pregunta guía*, razona y responde por su cuenta.
5. Consulta el **video del profesor** sobre el tema (sin gastar ayudas).
6. Termina el reto → pantalla de resultados con XP total e insignias obtenidas.

---

## 🚀 Cómo ejecutarlo

> ⚠️ **Importante:** la aplicación lee `data.json` mediante `fetch`, y los navegadores bloquean esa petición al abrir los archivos con doble clic (`file://`). **Se requiere un servidor local.**

### Opción 1 — Python (disponible en la mayoría de sistemas)

```bash
git clone https://github.com/SirProg/gamificacion_ia.git
cd gamificacion_ia
python3 -m http.server 8000
```

Abre **http://localhost:8000** en el navegador.

### Opción 2 — Node.js

```bash
npx serve .
```

### Opción 3 — VS Code

Instala la extensión **Live Server** y pulsa *"Go Live"*.

### Requisitos

- Un navegador moderno (Chrome, Firefox, Edge, Safari).
- Conexión a internet **solo** para el dashboard docente, que carga Chart.js desde CDN.

---

## 📁 Arquitectura del proyecto

```
gamificacion_ia/
├── index.html                  # Landing con inicio de sesión simulado
├── dashboard-docente.html      # Vista del profesor: analítica + generador IA
├── evaluacion-estudiante.html  # Vista del estudiante: quiz + tutor IA
├── styles.css                  # Sistema de diseño y estilos responsivos
├── app.js                      # Lógica de las 3 vistas, gamificación y chatbot
├── data.json                   # Backend simulado (datos de prueba)
└── .github/workflows/          # Despliegue automático a GitHub Pages
```

### Stack tecnológico

| Capa | Tecnología | Motivo |
|---|---|---|
| Estructura | **HTML5 semántico** | Accesibilidad y claridad. |
| Estilos | **CSS3 puro** con variables | Sin frameworks: carga mínima y control total del tema. |
| Lógica | **Vanilla JavaScript (ES6+)** | Cero dependencias, cero build, cero mantenimiento de librerías. |
| Datos | **JSON** vía `fetch` | Simula el backend; permite editar el contenido sin tocar código. |
| Gráficos | **Chart.js** (open source) | Única dependencia externa, y solo en la vista docente. |

`app.js` detecta automáticamente en qué vista se ejecuta según los elementos presentes en el DOM, lo que permite compartir un único archivo entre las tres páginas.

**Decisión de diseño:** el proyecto evita deliberadamente frameworks y procesos de compilación. Esto mantiene el consumo de recursos al mínimo —relevante en escuelas con equipos modestos y conectividad limitada— y permite que cualquier docente o desarrollador junior lo modifique con un editor de texto.

---

## ⚙️ Personalización sin programar

Casi todo el contenido vive en **`data.json`**, para que un docente pueda adaptarlo sin tocar JavaScript.

### Ajustar el motor de gamificación

```json
"gamificacion": {
  "xpPorAcierto": 100,
  "xpPorParticipar": 20,
  "bonusRacha": 50
}
```

### Añadir una pregunta

Cada pregunta incluye la retroalimentación y los tres niveles de apoyo del tutor:

```json
{
  "tema": "Fotosíntesis",
  "enunciado": "¿Qué gas liberan las plantas durante la fotosíntesis?",
  "opciones": ["Dióxido de carbono", "Oxígeno", "Nitrógeno", "Metano"],
  "respuestaCorrecta": 1,
  "retroInmediataCorrecta": "¡Genial! Las plantas liberan oxígeno…",
  "retroInmediataIncorrecta": "Piensa en qué gas te permite respirar.",
  "pistaBreve": "Es el gas que tú necesitas para respirar.",
  "explicacionConcepto": "En la fotosíntesis la planta toma dióxido de carbono…",
  "preguntaGuia": "Si las plantas absorben CO₂, ¿qué gas crees que devuelven?"
}
```

### Publicar material o videos

```json
{
  "tema": "Fotosíntesis",
  "tipo": "video",
  "titulo": "¿Cómo respiran las plantas?",
  "descripcion": "Experimento realizado en clase.",
  "duracion": "3:12",
  "autor": "Prof. Laura Méndez"
}
```

### Cambiar el límite de ayudas

En `app.js` (primeras líneas):

```js
const TUTOR_HELP_LIMIT = 5;                    // ayudas por intento
const FREE_ACTIONS = new Set(["material"]);    // acciones que no consumen
```

---

## 🎨 Sistema de diseño

Paleta elegida para resultar **amigable y no intimidante**, evitando el aspecto corporativo que genera rechazo docente:

| Uso | Color | Muestra |
|---|---|---|
| Primario — confianza educativa | `#0374b5` | 🟦 Azul |
| Secundario — IA y tecnología | `#315f74` → `#edf6f8` | 🟩 Turquesa |
| Acento — gamificación y logros | `#b7791f` / `#f6ad55` | 🟧 Dorado |
| Acierto | `#2f855a` | 🟩 Verde |
| Alerta de bajo rendimiento | `#c0392b` | 🟥 Rojo |
| Fondos | `#f5f6f7` / `#ffffff` | ⬜ Neutros |

Principios aplicados: fondos claros para **minimizar el consumo de recursos**, diseño responsivo (escritorio, tableta y móvil), etiquetas ARIA y contraste accesible, y **lenguaje libre de tecnicismos** en toda la interfaz.

---

## 🔬 Alcance del prototipo (honestidad técnica)

Este es un **prototipo de validación**, no un producto en producción. Es importante ser explícito sobre sus límites:

| Aspecto | Estado actual |
|---|---|
| Inicio de sesión | **Simulado** — no hay autenticación real ni contraseñas verificadas. |
| Generación de quizzes con IA | **Simulada** — reproduce el flujo y los tiempos de espera, sin llamar a un modelo real. |
| Respuestas del Tutor IA | **Guionizadas** desde `data.json`, no generadas por un modelo. |
| Persistencia | **Ninguna** — el progreso se reinicia al recargar la página. |
| Datos de estudiantes | **Ficticios** (6 estudiantes, 5 preguntas, 5 recursos). |

> 🔒 **Advertencia de privacidad:** `data.json` es un archivo público y accesible por URL. **No incluyas datos reales de estudiantes** (nombres, calificaciones) mientras no exista autenticación y un backend seguro.

El objetivo de esta versión es **validar la propuesta de valor con docentes y estudiantes reales** antes de invertir en infraestructura.

---

## 🗺️ Hoja de ruta

- [ ] Backend real con autenticación y roles.
- [ ] Integración con un modelo de IA para generar quizzes y retroalimentación de verdad.
- [ ] Panel para que el docente **suba** su propio material y videos (hoy se definen en `data.json`).
- [ ] Persistencia del progreso, XP e insignias por estudiante.
- [ ] Exportación de reportes para reuniones de padres y consejo técnico.
- [ ] Analítica predictiva: alertar sobre riesgo de rezago antes de que ocurra.

---

## 🌐 Despliegue

El repositorio incluye un workflow de **GitHub Pages** (`.github/workflows/jekyll-gh-pages.yml`) que publica automáticamente al hacer push a `main`. Al ser un sitio estático, también funciona sin configuración en Netlify, Vercel o Cloudflare Pages.

---

## 📄 Licencia

Distribuido bajo licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">

**Hecho para devolverle tiempo al docente y curiosidad al estudiante.**

</div>
