import { useCallback, useEffect, useRef, useState } from "react";
import { Brand, BrandSymbol } from "./Brand.jsx";
import { getActiveChapter, getPageProgress, isHeaderOverLightSection } from "./interactionState.js";

const whatsapp = "https://wa.me/5521986287957";

const navItems = [
  { label: "Sobre", href: "#sobre" },
  { label: "Atuação", href: "#solucoes" },
  { label: "Pensamento", href: "#abertura" },
  { label: "Contato", href: "#contato" },
];

const chapterItems = [
  { id: "inicio", label: "Início" },
  { id: "abertura", label: "Abordagem" },
  { id: "solucoes", label: "Soluções" },
  { id: "trabalhos", label: "Trabalho" },
  { id: "metodo", label: "Método" },
  { id: "sobre", label: "Sobre" },
  { id: "contato", label: "Contato" },
];

const methodStages = [
  {
    number: "01",
    eyebrow: "Diagnosticar",
    title: "Entrar no contexto real.",
    text: "Escutamos pessoas, lemos indicadores e observamos o trabalho como ele realmente acontece.",
    image: "/fundadoras-v2.png",
    alt: "Mônica Miranda e Kátia Puente, fundadoras da Objeto 2a",
    width: 1053,
    height: 1494,
  },
  {
    number: "02",
    eyebrow: "Desenhar",
    title: "Definir o percurso certo.",
    text: "Conectamos cultura, rotina, afetos e estratégia para desenhar uma intervenção própria para aquele contexto.",
    image: "/case-redballoon-reuniao-v2.png",
    alt: "Encontro de diagnóstico com a equipe Red Balloon",
    width: 1593,
    height: 987,
  },
  {
    number: "03",
    eyebrow: "Ativar",
    title: "Fazer a mudança ganhar corpo.",
    text: "Criamos experiências aplicáveis e acompanhamos qualitativamente o que muda nas relações e nas práticas.",
    image: "/case-redballoon-dia2.jpg",
    alt: "Experiência de desenvolvimento com lideranças",
    width: 1920,
    height: 1080,
  },
];

const services = [
  {
    title: "Programas para organizações",
    text: "Jornadas completas para lideranças, equipes e culturas em movimento. Do diagnóstico ao acompanhamento qualitativo.",
    meta: "Diagnóstico · Liderança · Cultura · NR-1",
    image: "/case-redballoon-grupo.png",
    alt: "Grupo reunido após uma jornada de desenvolvimento da Objeto 2a",
  },
  {
    title: "Mentorias",
    text: "Percursos individuais ou coletivos com profundidade, direção e aplicação concreta no cotidiano.",
    meta: "Liderança · Carreira · Marca pessoal",
    image: "/mentoring.jpg",
    alt: "Sessão de mentoria e desenvolvimento",
  },
  {
    title: "Workshops & masterclasses",
    text: "Experiências concentradas para abrir repertórios, mobilizar conversas e ativar novas práticas.",
    meta: "Comunicação · Inteligência emocional · IA",
    image: "/case-redballoon-grupo-horizontal.jpg",
    alt: "Grupo reunido após um workshop da Objeto 2a com a Red Balloon",
  },
  {
    title: "Facilitação & laboratórios",
    text: "Espaços de construção coletiva para questões complexas que não cabem em respostas prontas.",
    meta: "Futuros · Alinhamento · Learning sprints",
    image: "/facilitation.jpg",
    alt: "Processo de facilitação com uma equipe",
  },
];

const approachMoments = [
  {
    title: "Escutar",
    subtitle: "O singular de cada situação",
    text: "Antes de propor qualquer formato, escutamos a questão como ela chega — inclusive aquilo que ainda não encontrou palavra.",
  },
  {
    title: "Ler",
    subtitle: "O que organiza e o que se repete",
    text: "Separamos sintoma de causa. Lemos as repetições, as tensões e as possibilidades que organizam cada situação.",
  },
  {
    title: "Produzir direção",
    subtitle: "Movimento no cotidiano, não só no discurso",
    text: "A leitura volta para o cotidiano em forma de decisões, experiências e acordos que as pessoas conseguem sustentar.",
  },
];

const founderLenses = [
  {
    name: "Mônica Miranda",
    fields: "Comunicação · inovação · formação de lideranças",
    text: "Mônica observa como ideias ganham forma, circulam e mobilizam. Seu olhar conecta comunicação, inovação e formação de lideranças.",
  },
  {
    name: "Kátia Puente",
    fields: "Sociologia clínica · psicanálise e saúde · aprendizagem",
    text: "Kátia escuta o que as relações dizem — inclusive quando as palavras ainda não dão conta. Seu olhar conecta sociologia clínica, psicanálise, saúde e aprendizagem.",
  },
];

function Arrow({ down = false }) {
  return <span aria-hidden="true">{down ? "↓" : "↗"}</span>;
}

function tracePath(points) {
  if (!points.length) return "";
  let path = `M${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const before = points[Math.max(0, index - 1)];
    const current = points[index];
    const next = points[index + 1];
    const after = points[Math.min(points.length - 1, index + 2)];
    const control1X = current.x + (next.x - before.x) / 6;
    const control1Y = current.y + (next.y - before.y) / 6;
    const control2X = next.x - (after.x - current.x) / 6;
    const control2Y = next.y - (after.y - current.y) / 6;
    path += `C${control1X.toFixed(1)} ${control1Y.toFixed(1)} ${control2X.toFixed(1)} ${control2Y.toFixed(1)} ${next.x.toFixed(1)} ${next.y.toFixed(1)}`;
  }
  return path;
}

function HeroTrace({ heroRef }) {
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const echoRef = useRef(null);
  const sheenRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const svg = svgRef.current;
    const path = pathRef.current;
    const echo = echoRef.current;
    const sheen = sheenRef.current;
    if (!hero || !svg || !path || !echo || !sheen) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return undefined;

    const pointCount = 28;
    const points = Array.from({ length: pointCount }, (_, index) => ({
      x: 650 + (1010 * index) / (pointCount - 1),
      y: 445 + Math.sin((Math.PI * index) / (pointCount - 1)) * 35
        + Math.sin((Math.PI * 2 * index) / (pointCount - 1)) * 48,
      offsetX: 0,
      offsetY: 0,
      velocityX: 0,
      velocityY: 0,
    }));
    const pointer = { x: 0, y: 0, smoothX: 0, smoothY: 0, active: false, pressed: false, moved: false };
    let frame = 0;
    let previousTime = performance.now();

    const locatePointer = (event) => {
      const rect = svg.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 1600;
      pointer.y = ((event.clientY - rect.top) / rect.height) * 900;
      if (!pointer.moved) {
        pointer.smoothX = pointer.x;
        pointer.smoothY = pointer.y;
      }
      pointer.active = pointer.x > 560 && pointer.x < 1660 && pointer.y > 130 && pointer.y < 840;
      pointer.moved = true;
    };

    const onPointerMove = (event) => locatePointer(event);
    const onPointerDown = (event) => {
      if (event.target.closest("a, button, input, textarea, select")) return;
      locatePointer(event);
      if (!pointer.active) return;
      event.preventDefault();
      pointer.pressed = pointer.active;
      hero.setPointerCapture?.(event.pointerId);
      hero.classList.add("is-trace-engaged");
      svg.classList.toggle("is-engaged", pointer.pressed);
    };
    const onPointerUp = (event) => {
      if (pointer.pressed) {
        points.forEach((point) => {
          const influence = Math.exp(-Math.pow((point.x - pointer.x) / 250, 2));
          point.velocityY += (point.y + point.offsetY - pointer.y) * influence * 0.055;
        });
      }
      pointer.pressed = false;
      if (event?.pointerId !== undefined && hero.hasPointerCapture?.(event.pointerId)) {
        hero.releasePointerCapture(event.pointerId);
      }
      hero.classList.remove("is-trace-engaged");
      svg.classList.remove("is-engaged");
    };
    const onPointerLeave = () => {
      pointer.active = false;
      onPointerUp();
    };

    const animate = (time) => {
      const delta = Math.min(1.8, Math.max(0.6, (time - previousTime) / 16.67));
      previousTime = time;
      const idleTime = time * 0.001;
      pointer.smoothX += (pointer.x - pointer.smoothX) * (pointer.pressed ? .2 : .11);
      pointer.smoothY += (pointer.y - pointer.smoothY) * (pointer.pressed ? .2 : .11);

      points.forEach((point, index) => {
        const edgeLock = Math.sin((Math.PI * index) / (pointCount - 1));
        const idleY = (Math.sin(idleTime * .62 + index * .52) * 18
          + Math.sin(idleTime * .27 - index * .34) * 11) * edgeLock;
        const idleX = Math.sin(idleTime * .31 + index * .43) * 6 * edgeLock;
        let targetX = idleX;
        let targetY = idleY;

        if (pointer.active) {
          const distanceX = point.x + point.offsetX - pointer.smoothX;
          const distanceY = point.y + point.offsetY - pointer.smoothY;
          const radius = pointer.pressed ? 480 : 310;
          const influence = Math.exp(-Math.pow(Math.hypot(distanceX, distanceY) / radius, 2)) * edgeLock;
          const strength = pointer.pressed ? 1.18 : .68;
          targetY += Math.max(-300, Math.min(300, pointer.smoothY - point.y)) * influence * strength;
          targetX += Math.max(-210, Math.min(210, pointer.smoothX - point.x)) * influence * strength * .34;
        }

        const spring = pointer.pressed ? .062 : .03;
        point.velocityX = (point.velocityX + (targetX - point.offsetX) * spring * delta) * Math.pow(.87, delta);
        point.velocityY = (point.velocityY + (targetY - point.offsetY) * spring * delta) * Math.pow(.885, delta);
        point.offsetX += point.velocityX * delta;
        point.offsetY += point.velocityY * delta;
      });

      const renderedPoints = points.map((point) => ({ x: point.x + point.offsetX, y: point.y + point.offsetY }));
      const nextPath = tracePath(renderedPoints);
      path.setAttribute("d", nextPath);
      echo.setAttribute("d", nextPath);
      sheen.setAttribute("d", nextPath);

      frame = requestAnimationFrame(animate);
    };

    const stopNativeDrag = (event) => event.preventDefault();

    hero.addEventListener("pointermove", onPointerMove, { passive: true });
    hero.addEventListener("pointerdown", onPointerDown);
    hero.addEventListener("pointerleave", onPointerLeave);
    hero.addEventListener("dragstart", stopNativeDrag);
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerdown", onPointerDown);
      hero.removeEventListener("pointerleave", onPointerLeave);
      hero.removeEventListener("dragstart", stopNativeDrag);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [heroRef]);

  return (
    <svg ref={svgRef} className="o2-hero__trace" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="hero-trace-gradient" x1="0" x2="1">
          <stop offset="0" stopColor="#d46a4a" stopOpacity=".42" />
          <stop offset=".28" stopColor="#d46a4a" />
          <stop offset=".67" stopColor="#d46a4a" stopOpacity=".72" />
          <stop offset=".88" stopColor="#e7dcc8" stopOpacity=".18" />
          <stop offset="1" stopColor="#e7dcc8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path ref={echoRef} className="o2-hero__trace-echo" d="M650 445C790 470 860 535 1010 500C1180 460 1260 400 1400 420C1510 435 1590 452 1660 445" />
      <path ref={pathRef} className="o2-hero__trace-line" d="M650 445C790 470 860 535 1010 500C1180 460 1260 400 1400 420C1510 435 1590 452 1660 445" />
      <path ref={sheenRef} className="o2-hero__trace-sheen" d="M650 445C790 470 860 535 1010 500C1180 460 1260 400 1400 420C1510 435 1590 452 1660 445" />
    </svg>
  );
}

function ChapterNav() {
  const [activeId, setActiveId] = useState("inicio");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const offsets = chapterItems
          .map((chapter) => ({ ...chapter, top: document.getElementById(chapter.id)?.offsetTop ?? Number.POSITIVE_INFINITY }))
          .filter((chapter) => Number.isFinite(chapter.top));
        const marker = window.scrollY + window.innerHeight * 0.42;

        setProgress(getPageProgress(window.scrollY, window.innerHeight, document.documentElement.scrollHeight));
        setActiveId(getActiveChapter(offsets, marker));
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const activeIndex = Math.max(0, chapterItems.findIndex((chapter) => chapter.id === activeId));
  const activeChapter = chapterItems[activeIndex];
  const darkSection = ["inicio", "metodo", "contato"].includes(activeId);

  return (
    <nav
      className={`o2-chapters ${darkSection ? "is-on-dark" : ""} ${activeId === "inicio" ? "is-in-hero" : ""}`}
      style={{ "--chapter-progress": progress }}
      aria-label="Progresso pelos capítulos da página"
    >
      <span className="o2-chapters__current" aria-live="polite">
        <i>{String(activeIndex + 1).padStart(2, "0")} / {String(chapterItems.length).padStart(2, "0")}</i>
        <b>{activeChapter.label}</b>
      </span>
      <span className="o2-chapters__rail">
        {chapterItems.map((chapter) => (
          <a
            className={chapter.id === activeId ? "is-active" : ""}
            href={`#${chapter.id}`}
            aria-label={`Ir para ${chapter.label}`}
            aria-current={chapter.id === activeId ? "location" : undefined}
            key={chapter.id}
          >
            <span>{chapter.label}</span>
          </a>
        ))}
      </span>
    </nav>
  );
}

function MethodStory() {
  const sectionRef = useRef(null);
  const [activeStage, setActiveStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
        const next = Math.min(1, Math.max(0, -rect.top / travel));
        setProgress(next);
        setActiveStage(Math.min(2, Math.floor(next * 3)));
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section className="o2-method" id="metodo" data-cms-section-key="metodo" ref={sectionRef}>
      <div className="o2-method__pin">
        <div className="o2-method__intro">
          <p className="o2-kicker">Como trabalhamos</p>
          <h2>Da escuta à ação.<br /><em>Sem fórmulas prontas.</em></h2>
          <p>Três etapas conectam diagnóstico, desenho e acompanhamento para transformar uma questão real em mudança possível.</p>
          <div className="o2-method__progress" aria-hidden="true">
            <i style={{ transform: `scaleX(${progress})` }} />
          </div>
          <div className="o2-method__steps" aria-label="Etapas do método">
            {methodStages.map((stage, index) => (
              <button
                className={activeStage === index ? "is-active" : ""}
                type="button"
                onClick={() => {
                  const section = sectionRef.current;
                  if (!section) return;
                  const travel = section.offsetHeight - window.innerHeight;
                  window.scrollTo({ top: section.offsetTop + (travel * index) / 2, behavior: "smooth" });
                }}
                aria-current={activeStage === index ? "step" : undefined}
                key={stage.number}
              >
                <span>{stage.number}</span>{stage.eyebrow}
              </button>
            ))}
          </div>
        </div>

        <div className="o2-method__visual">
          {methodStages.map((stage, index) => (
            <article className={activeStage === index ? "is-active" : ""} aria-hidden={activeStage !== index} key={stage.number}>
              <figure>
                <img data-cms-key={`method-${stage.number}-image`} src={stage.image} alt={stage.alt} width={stage.width} height={stage.height} loading="lazy" decoding="async" />
              </figure>
              <div>
                <span>{stage.number} / 03</span>
                <h3>{stage.title}</h3>
                <p>{stage.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="o2-method__mobile">
        <header>
          <p className="o2-kicker">Como trabalhamos</p>
          <h2>Da escuta à ação. <em>Sem fórmulas prontas.</em></h2>
          <div className="o2-method__mobile-progress" aria-hidden="true">
            <i style={{ transform: `scaleX(${progress})` }} />
          </div>
          <div className="o2-method__mobile-steps" aria-label="Etapas do método">
            {methodStages.map((stage, index) => (
              <button
                className={activeStage === index ? "is-active" : ""}
                type="button"
                onClick={() => {
                  const section = sectionRef.current;
                  if (!section) return;
                  const travel = section.offsetHeight - window.innerHeight;
                  window.scrollTo({ top: section.offsetTop + (travel * index) / 2, behavior: "smooth" });
                }}
                aria-current={activeStage === index ? "step" : undefined}
                key={stage.number}
              >
                <span>{stage.number}</span>{stage.eyebrow}
              </button>
            ))}
          </div>
        </header>
        <div className="o2-method__mobile-stages">
        {methodStages.map((stage, index) => (
          <article className={activeStage === index ? "is-active" : ""} aria-hidden={activeStage !== index} key={stage.number}>
            <figure><img data-cms-key={`method-${stage.number}-image`} src={stage.image} alt={stage.alt} width={stage.width} height={stage.height} loading="lazy" decoding="async" /></figure>
            <div className="o2-method__mobile-copy">
              <span>Etapa {stage.number} de 03</span>
              <h3>{stage.title}</h3>
              <p>{stage.text}</p>
            </div>
          </article>
        ))}
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  const heroRef = useRef(null);
  const headerRef = useRef(null);
  const heroVideoRef = useRef([]);
  const fieldVideoRef = useRef(null);
  const contactRef = useRef(null);
  const serviceTimerRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerOnLight, setHeaderOnLight] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [serviceDirection, setServiceDirection] = useState("forward");
  const [servicePhase, setServicePhase] = useState("idle");
  const [activeFounder, setActiveFounder] = useState(0);
  const [contactVisible, setContactVisible] = useState(false);
  const [formState, setFormState] = useState("idle");

  const setFieldVideo = useCallback((video) => {
    fieldVideoRef.current = video;
    if (!video) return;
    video.defaultMuted = true;
    video.muted = true;
    video.loop = true;
    video.setAttribute("muted", "");
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    const videos = heroVideoRef.current.filter(Boolean);
    if (!hero || videos.length !== 2) return undefined;

    let holdTimer = 0;
    let blendTimer = 0;
    const heroRect = hero.getBoundingClientRect();
    let isVisible = heroRect.bottom > 0 && heroRect.top < window.innerHeight;
    let activeIndex = 0;

    const clearCycle = () => {
      window.clearTimeout(holdTimer);
      window.clearTimeout(blendTimer);
    };

    const prepare = (video) => {
      video.defaultMuted = true;
      video.muted = true;
      video.setAttribute("muted", "");
    };

    videos.forEach((video, index) => {
      prepare(video);
      video.classList.toggle("is-active", index === activeIndex);
      video.classList.remove("is-incoming", "is-visible");
    });

    const playActive = () => {
      if (!isVisible) return;
      videos[activeIndex].play().catch(() => {});
    };

    const crossFade = () => {
      if (!isVisible) return;
      const outgoingIndex = activeIndex;
      const incomingIndex = 1 - activeIndex;
      const outgoing = videos[outgoingIndex];
      const incoming = videos[incomingIndex];

      incoming.currentTime = 0.05;
      incoming.play().catch(() => {});

      const revealIncoming = () => {
        if (!isVisible) return;
        activeIndex = incomingIndex;
        incoming.classList.add("is-incoming");
        requestAnimationFrame(() => requestAnimationFrame(() => incoming.classList.add("is-visible")));

        blendTimer = window.setTimeout(() => {
          incoming.classList.add("is-active");
          incoming.classList.remove("is-incoming", "is-visible");
          outgoing.classList.remove("is-active");
          outgoing.pause();
          outgoing.currentTime = 0;
        }, 800);
      };

      if (incoming.requestVideoFrameCallback) incoming.requestVideoFrameCallback(revealIncoming);
      else requestAnimationFrame(revealIncoming);
    };

    const holdLastFrame = (index) => {
      if (index !== activeIndex) return;
      clearCycle();
      if (!isVisible) return;
      holdTimer = window.setTimeout(crossFade, 10000);
    };

    const onVisibility = ([entry]) => {
      isVisible = entry.isIntersecting;
      if (!isVisible) {
        clearCycle();
        videos.forEach((video) => video.pause());
        return;
      }
      if (videos[activeIndex].ended) holdLastFrame(activeIndex);
      else playActive();
    };

    const resumeIfVisible = () => {
      const rect = hero.getBoundingClientRect();
      isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
      if (!document.hidden && isVisible) playActive();
    };

    const endedHandlers = videos.map((_, index) => () => holdLastFrame(index));

    const observer = new IntersectionObserver(onVisibility, { threshold: 0.1 });
    observer.observe(hero);
    videos.forEach((video, index) => {
      video.addEventListener("ended", endedHandlers[index]);
      video.addEventListener("loadeddata", resumeIfVisible);
      video.addEventListener("canplay", resumeIfVisible);
    });
    document.addEventListener("visibilitychange", resumeIfVisible);
    window.addEventListener("pageshow", resumeIfVisible);
    playActive();

    return () => {
      clearCycle();
      observer.disconnect();
      videos.forEach((video, index) => {
        video.removeEventListener("ended", endedHandlers[index]);
        video.removeEventListener("loadeddata", resumeIfVisible);
        video.removeEventListener("canplay", resumeIfVisible);
      });
      document.removeEventListener("visibilitychange", resumeIfVisible);
      window.removeEventListener("pageshow", resumeIfVisible);
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const heroBottom = heroRef.current?.getBoundingClientRect().bottom ?? Number.POSITIVE_INFINITY;
        const trigger = Number.parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue("--o2-header-resting-bottom"),
        ) || 108;
        const transitionDistance = Math.min(220, Math.max(150, window.innerHeight * 0.2));
        const headerProgress = Math.min(1, Math.max(0, (trigger + transitionDistance - heroBottom) / transitionDistance));
        headerRef.current?.style.setProperty("--o2-header-progress", headerProgress.toFixed(3));
        setHeaderOnLight(isHeaderOverLightSection(heroBottom, trigger));
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    services.forEach((item) => {
      const image = new Image();
      image.src = item.image;
    });
  }, []);

  useEffect(() => {
    const video = fieldVideoRef.current;
    if (!video) return undefined;

    const play = () => {
      video.defaultMuted = true;
      video.muted = true;
      video.play().catch(() => {});
    };
    const resumeWhenVisible = ([entry]) => {
      if (entry.isIntersecting) play();
    };
    const resumeAfterVisibilityChange = () => {
      if (!document.hidden && video.getBoundingClientRect().bottom > 0 && video.getBoundingClientRect().top < window.innerHeight) play();
    };
    const observer = new IntersectionObserver(resumeWhenVisible, { threshold: 0.15 });

    observer.observe(video);
    video.addEventListener("loadeddata", play);
    video.addEventListener("ended", play);
    document.addEventListener("visibilitychange", resumeAfterVisibilityChange);
    play();

    return () => {
      observer.disconnect();
      video.removeEventListener("loadeddata", play);
      video.removeEventListener("ended", play);
      document.removeEventListener("visibilitychange", resumeAfterVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const contact = contactRef.current;
    if (!contact) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setContactVisible(entry.isIntersecting),
      { rootMargin: "320px 0px 0px", threshold: 0 },
    );

    observer.observe(contact);
    return () => observer.disconnect();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const message = encodeURIComponent(`Nome: ${data.name}\nE-mail: ${data.email}\n\nContexto:\n${data.message}`);
    setFormState("sent");
    window.open(`${whatsapp}?text=${message}`, "_blank", "noopener,noreferrer");
  }

  function selectService(index) {
    if (index === activeService || servicePhase !== "idle") return;
    setServiceDirection(index > activeService ? "forward" : "back");
    setServicePhase("covering");
    window.clearTimeout(serviceTimerRef.current);
    serviceTimerRef.current = window.setTimeout(() => {
      setActiveService(index);
      setServicePhase("revealing");
      serviceTimerRef.current = window.setTimeout(() => setServicePhase("idle"), 520);
    }, 340);
  }

  useEffect(() => () => window.clearTimeout(serviceTimerRef.current), []);

  function handleServiceKeyDown(event, index) {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = services.length - 1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % services.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + services.length) % services.length;
    selectService(nextIndex);
    event.currentTarget.parentElement?.querySelectorAll("button")[nextIndex]?.focus();
  }

  function handleFounderKeyDown(event, index) {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = founderLenses.length - 1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % founderLenses.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + founderLenses.length) % founderLenses.length;
    setActiveFounder(nextIndex);
    event.currentTarget.parentElement?.querySelectorAll("button")[nextIndex]?.focus();
  }

  const service = services[activeService];
  const founder = founderLenses[activeFounder];

  return (
    <main className="o2-home" id="inicio">
      <header
        ref={headerRef}
        className={`o2-header ${headerOnLight || menuOpen ? "is-solid" : ""} ${menuOpen ? "is-menu-open" : ""}`}
      >
        <Brand inverse={!headerOnLight && !menuOpen} href="#inicio" />
        <nav className={menuOpen ? "is-open" : ""} aria-label="Navegação principal">
          {navItems.map((item) => (
            <a href={item.href} onClick={() => setMenuOpen(false)} key={item.href}>{item.label}</a>
          ))}
          <a className="o2-nav__mobile-cta" href="#contato" onClick={() => setMenuOpen(false)}>Agende uma conversa</a>
        </nav>
        <a className="o2-header__cta" href="#contato">Agende uma conversa</a>
        <button
          className="o2-menu"
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <i /><i />
        </button>
      </header>
      <ChapterNav />

      <section
        className="o2-hero"
        data-cms-section-key="hero"
        aria-labelledby="hero-title"
        ref={heroRef}
      >
        <BrandSymbol className="o2-hero__watermark" />
        <div className="o2-hero__inner">
          <div className="o2-hero__copy">
            <p className="o2-hero__eyebrow">Psicanálise aplicada às organizações</p>
            <h1 id="hero-title">
              <span className="o2-hero__title-line is-first">Escuta que</span>
              <span className="o2-hero__title-line is-second">produz direção<span className="o2-hero__title-dot">.</span></span>
            </h1>
            <p className="o2-hero__lede">Psicanálise aplicada à leitura do que move pessoas, relações e trabalho.</p>
            <div className="o2-hero__actions">
              <a className="o2-hero__cta" href="#contato">Agende uma conversa <Arrow /></a>
              <a className="o2-hero__secondary" href="#abertura" aria-label="Conheça nossa abordagem">
                <span className="o2-hero__secondary-label">Conheça nossa abordagem</span><Arrow down />
              </a>
            </div>
            <p className="o2-hero__note"><i aria-hidden="true" />Passe pelas palavras. Arraste o fio para mudar seu percurso.</p>
          </div>
          <figure className="o2-hero__media">
            <picture>
              <source media="(max-width: 720px)" srcSet="/hero-architecture-mobile.png" />
              <img
                src="/hero-architecture-clean.png"
                alt="Ambiente arquitetônico circular com camadas que evocam linguagem, sujeito e desejo"
                decoding="async"
                fetchPriority="high"
                draggable="false"
              />
            </picture>
            {[0, 1].map((layer) => (
              <video
                ref={(video) => { heroVideoRef.current[layer] = video; }}
                className={`o2-hero__video${layer === 0 ? " is-active" : ""}`}
                autoPlay={layer === 0}
                muted
                playsInline
                preload="auto"
                aria-hidden="true"
                key={layer}
              >
                <source media="(max-width: 720px)" src="/hero-architecture-mobile.mp4" type="video/mp4" />
                <source src="/hero-architecture-loop.mp4" type="video/mp4" />
              </video>
            ))}
          </figure>
        </div>
        <HeroTrace heroRef={heroRef} />
      </section>

      <section className="o2-opening" id="abertura" aria-labelledby="opening-title">
        <p className="o2-kicker">A abordagem Objeto 2a</p>
        <div className="o2-opening__statement">
          <h2 id="opening-title">Ler o que está em jogo para dar direção ao que precisa mudar.</h2>
          <p>Entramos pela questão real, escutamos o que se repete e desenhamos um percurso próprio. A mudança é acompanhada onde ela ganha corpo: nas relações e no trabalho.</p>
        </div>
        <div className="o2-opening__field">
          <figure className="o2-opening__film">
            <div className="o2-opening__film-frame">
              <video
                ref={setFieldVideo}
                src="/hero-objeto2a.mp4"
                poster="/hero-objeto2a-poster.jpg"
                autoPlay
                loop
                controls
                muted
                playsInline
                preload="auto"
                aria-label="Objeto 2a conduzindo uma experiência de desenvolvimento em campo"
              />
              <span aria-hidden="true">01 · Em campo</span>
            </div>
            <figcaption>
              <span>Objeto 2a em campo</span>
              <p>Escuta, leitura e direção ganhando forma no trabalho real.</p>
            </figcaption>
          </figure>

          <div className="o2-opening__field-notes">
            <p className="o2-kicker">Registro de campo</p>
            <h3>O método aparece no modo de conduzir.</h3>
            <p className="o2-opening__field-lede">Um trecho real de facilitação: presença, leitura do grupo e direção construída no encontro — sem encenação e sem fórmula pronta.</p>
            <ol className="o2-opening__principles" aria-label="Princípios presentes no trabalho de campo">
              {approachMoments.map((moment, index) => (
                <li key={moment.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{moment.title}</strong>
                    <p>{moment.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="o2-solutions" id="solucoes" data-cms-section-key="solucoes">
        <header className="o2-section-heading o2-reveal">
          <p className="o2-kicker">Soluções</p>
          <h2>Da questão real<br /><em>ao formato certo.</em></h2>
          <p className="o2-section-heading__lede">Programas, mentorias, workshops e facilitação combinados de acordo com o contexto, as pessoas e o resultado esperado.</p>
          <a className="o2-text-link" href="/solucoes">Ver todas as soluções <Arrow /></a>
        </header>

        <div className="o2-solution-browser o2-reveal">
          <div className="o2-solution-browser__tabs" role="tablist" aria-label="Soluções Objeto 2a">
            {services.map((item, index) => (
              <button
                type="button"
                id={`service-tab-${index}`}
                role="tab"
                aria-selected={index === activeService}
                aria-controls="service-panel"
                tabIndex={index === activeService ? 0 : -1}
                className={index === activeService ? "is-active" : ""}
                onClick={() => selectService(index)}
                onKeyDown={(event) => handleServiceKeyDown(event, index)}
                key={item.title}
              >
                <span>0{index + 1}</span>
                <strong>{item.title}</strong>
                <i>{index === activeService ? "−" : "+"}</i>
              </button>
            ))}
          </div>
          <article
            className={`o2-solution-browser__panel is-${serviceDirection} is-${servicePhase}`}
            id="service-panel"
            role="tabpanel"
            aria-labelledby={`service-tab-${activeService}`}
            aria-live="polite"
          >
            <figure className="o2-solution-browser__media">
              <img
                key={service.image}
                data-cms-key={`solution-${activeService + 1}-image`}
                src={service.image}
                alt={service.alt}
                loading="eager"
                decoding="async"
                draggable="false"
              />
            </figure>
            <div className="o2-solution-browser__copy" key={service.title}>
              <p>{service.text}</p>
              <span>{service.meta}</span>
              <a className="o2-button is-dark" href="#contato">Conversar sobre esta solução <Arrow /></a>
            </div>
          </article>
        </div>
      </section>

      <section className="o2-case" id="trabalhos" data-cms-section-key="trabalhos">
        <header className="o2-section-heading o2-reveal">
          <p className="o2-kicker">Trabalho em contexto real</p>
          <h2>Cinco unidades.<br /><em>Um percurso sob medida.</em></h2>
        </header>
        <div className="o2-case__body o2-reveal">
          <figure>
            <img data-cms-key="red-balloon-case-image" src="/case-redballoon-reuniao-v2.png" alt="Encontro de diagnóstico com lideranças da Red Balloon" width="1593" height="987" loading="lazy" decoding="async" />
          </figure>
          <div className="o2-case__copy">
            <span>Red Balloon · 2025</span>
            <h3>Diagnóstico e desenvolvimento de lideranças</h3>
            <p>Diagnóstico organizacional e desenvolvimento de soft skills com lideranças de cinco unidades no Rio de Janeiro.</p>
            <ul className="o2-case__evidence" aria-label="Escopo verificado do projeto">
              <li>5 unidades no Rio</li>
              <li>Diagnóstico organizacional</li>
              <li>Desenvolvimento de soft skills</li>
            </ul>
            <small>Resultado observado no relatório qualitativo</small>
            <blockquote>“O grupo demonstrou maturidade tática e inteligência relacional para lidar com os desafios.”</blockquote>
            <a className="o2-text-link" href="/trabalhos">Conheça o trabalho <Arrow /></a>
          </div>
          <div className="o2-case__stat">
            <strong>05</strong>
            <span>unidades<br />envolvidas</span>
          </div>
        </div>
      </section>

      <MethodStory />

      <section className="o2-about" id="sobre" data-cms-section-key="sobre">
        <figure className="o2-about__photo o2-reveal">
          <img data-cms-key="founders-image" src="/fundadoras-v2.png" alt="Mônica Miranda e Kátia Puente, fundadoras da Objeto 2a" width="1053" height="1494" loading="lazy" decoding="async" />
          <figcaption>Mônica Miranda + Kátia Puente</figcaption>
        </figure>
        <div className="o2-about__copy o2-reveal">
          <p className="o2-kicker">Sobre a Objeto 2a</p>
          <h2>Dois olhares.<br /><em>Uma leitura inteira.</em></h2>
          <p>
            A Objeto 2a nasce do encontro entre repertórios complementares e de uma convicção:
            nenhuma transformação se sustenta sem escutar as relações que dão forma ao trabalho.
          </p>
          <p>
            Por isso, entramos em cada projeto com método, presença e curiosidade — para criar
            experiências que façam sentido naquele contexto, para aquelas pessoas.
          </p>
          <div className="o2-about__lenses">
            <div className="o2-about__lens-tabs" role="tablist" aria-label="Olhares das fundadoras">
              {founderLenses.map((item, index) => (
                <button
                  type="button"
                  id={`founder-tab-${index}`}
                  role="tab"
                  aria-selected={activeFounder === index}
                  aria-controls="founder-panel"
                  tabIndex={activeFounder === index ? 0 : -1}
                  className={activeFounder === index ? "is-active" : ""}
                  onClick={() => setActiveFounder(index)}
                  onKeyDown={(event) => handleFounderKeyDown(event, index)}
                  key={item.name}
                >
                  <span>0{index + 1}</span>
                  {item.name.split(" ")[0]}
                </button>
              ))}
            </div>
            <article
              className="o2-about__lens"
              id="founder-panel"
              key={founder.name}
              role="tabpanel"
              aria-labelledby={`founder-tab-${activeFounder}`}
              aria-live="polite"
            >
              <span>Olhar em foco</span>
              <div>
                <strong>{founder.name}</strong>
                <small>{founder.fields}</small>
                <p>{founder.text}</p>
              </div>
            </article>
          </div>
          <a className="o2-button is-outline" href="/sobre">Conheça nossa história <Arrow /></a>
        </div>
      </section>

      <section
        ref={contactRef}
        className={`o2-contact ${contactVisible ? "is-visible" : ""}`}
        id="contato"
        data-cms-section-key="contato"
      >
        <div className="o2-contact__lead">
          <p className="o2-kicker o2-contact__reveal">Uma conversa para começar</p>
          <h2>
            <span className="o2-contact__line"><span>Traga o desafio.</span></span>
            <span className="o2-contact__line"><em>A gente começa pela escuta.</em></span>
          </h2>
          <p className="o2-contact__intro o2-contact__reveal">
            Conte o que está pedindo movimento. A partir da questão real, pensamos juntos no melhor ponto de partida.
          </p>
        </div>

        <form className="o2-contact__form o2-contact__reveal" onSubmit={handleSubmit}>
          <div className="o2-contact__form-heading">
            <span>Mensagem</span>
            <h3>Qual desafio sua organização está vivendo?</h3>
          </div>
          <label>Nome<input name="name" required autoComplete="name" placeholder="Seu nome" /></label>
          <label>E-mail<input name="email" required type="email" autoComplete="email" placeholder="voce@empresa.com" /></label>
          <label>O que precisa se mover?<textarea name="message" required rows="3" placeholder="Conte em poucas palavras" /></label>
          <button className="o2-contact__cta" type="submit"><span>Enviar pelo WhatsApp</span> <Arrow /></button>
          <p className="o2-form-status" role="status">
            {formState === "sent" ? "O WhatsApp será aberto com a mensagem preenchida." : " "}
          </p>
        </form>
      </section>

      <footer className={`o2-footer ${contactVisible ? "is-reveal-ready" : ""}`}>
        <Brand inverse />
        <nav aria-label="Navegação do rodapé">
          {navItems.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}
        </nav>
        <div className="o2-footer__social">
          <a href="https://www.instagram.com/objeto2a/" target="_blank" rel="noreferrer">Instagram <Arrow /></a>
          <a href="https://www.linkedin.com/company/objeto2a" target="_blank" rel="noreferrer">LinkedIn <Arrow /></a>
        </div>
        <div className="o2-footer__meta">
          <span>© {new Date().getFullYear()} Objeto 2a</span>
          <span className="o2-footer__location">Rio de Janeiro · Brasil</span>
          <a href="#inicio">Voltar ao início ↑</a>
        </div>
      </footer>
    </main>
  );
}
