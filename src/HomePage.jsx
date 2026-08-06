import { useEffect, useRef, useState } from "react";
import { Brand, BrandSymbol } from "./Brand.jsx";
import { getActiveChapter, getPageProgress } from "./interactionState.js";

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
  },
  {
    number: "02",
    eyebrow: "Desenhar",
    title: "Definir o percurso certo.",
    text: "Conectamos cultura, rotina, afetos e estratégia para desenhar uma intervenção própria para aquele contexto.",
    image: "/case-redballoon-reuniao-v2.png",
    alt: "Encontro de diagnóstico com a equipe Red Balloon",
  },
  {
    number: "03",
    eyebrow: "Ativar",
    title: "Fazer a mudança ganhar corpo.",
    text: "Criamos experiências aplicáveis e acompanhamos qualitativamente o que muda nas relações e nas práticas.",
    image: "/case-redballoon-dia2.jpg",
    alt: "Experiência de desenvolvimento com lideranças",
  },
];

const services = [
  {
    title: "Programas para organizações",
    text: "Jornadas completas para lideranças, equipes e culturas em movimento. Do diagnóstico ao acompanhamento qualitativo.",
    meta: "Diagnóstico · Liderança · Cultura · NR-1",
    image: "/case-redballoon-dia2.jpg",
    alt: "Equipe reunida em uma jornada de desenvolvimento",
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
    image: "/case-redballoon-katia.png",
    alt: "Workshop facilitado por Kátia Puente",
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

function HeroTrace() {
  return (
    <svg className="o2-hero__trace" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">
      <path d="M600 480C720 450 790 520 900 500C1020 475 1090 445 1150 535C1210 625 1300 590 1360 510C1430 430 1510 470 1640 535" />
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
                <img data-cms-key={`method-${stage.number}-image`} src={stage.image} alt={stage.alt} loading="lazy" decoding="async" />
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
        </header>
        {methodStages.map((stage) => (
          <article key={stage.number}>
            <figure><img data-cms-key={`method-${stage.number}-image`} src={stage.image} alt={stage.alt} loading="lazy" decoding="async" /></figure>
            <span>{stage.number} / 03 · {stage.eyebrow}</span>
            <h3>{stage.title}</h3>
            <p>{stage.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function HomePage() {
  const heroRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [serviceDirection, setServiceDirection] = useState("forward");
  const [activeApproach, setActiveApproach] = useState(0);
  const [activeFounder, setActiveFounder] = useState(0);
  const [formState, setFormState] = useState("idle");

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 48);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const message = encodeURIComponent(`Nome: ${data.name}\nE-mail: ${data.email}\n\nContexto:\n${data.message}`);
    setFormState("sent");
    window.open(`${whatsapp}?text=${message}`, "_blank", "noopener,noreferrer");
  }

  function handleHeroPointerMove(event) {
    const hero = heroRef.current;
    if (!hero || window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = hero.getBoundingClientRect();
    hero.style.setProperty("--trace-x", `${((event.clientX - rect.left) / rect.width - 0.5) * 16}px`);
    hero.style.setProperty("--trace-y", `${((event.clientY - rect.top) / rect.height - 0.5) * 12}px`);
  }

  function resetHeroPointer() {
    const hero = heroRef.current;
    if (!hero) return;
    hero.style.setProperty("--trace-x", "0px");
    hero.style.setProperty("--trace-y", "0px");
  }

  function handleApproachKeyDown(event, index) {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = approachMoments.length - 1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % approachMoments.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + approachMoments.length) % approachMoments.length;
    setActiveApproach(nextIndex);
    event.currentTarget.parentElement?.parentElement?.querySelectorAll("button")[nextIndex]?.focus();
  }

  function selectService(index) {
    if (index === activeService) return;
    setServiceDirection(index > activeService ? "forward" : "back");
    setActiveService(index);
  }

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
  const approach = approachMoments[activeApproach];
  const founder = founderLenses[activeFounder];

  return (
    <main className="o2-home" id="inicio">
      <header className={`o2-header ${scrolled || menuOpen ? "is-solid" : ""}`}>
        <Brand inverse={!scrolled && !menuOpen} href="#inicio" />
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
        onPointerMove={handleHeroPointerMove}
        onPointerLeave={resetHeroPointer}
      >
        <BrandSymbol className="o2-hero__watermark" />
        <div className="o2-hero__inner">
          <div className="o2-hero__copy">
            <p className="o2-hero__eyebrow">Psicanálise aplicada às organizações</p>
            <h1 id="hero-title">Escuta que<br />produz direção<span className="o2-hero__title-dot">.</span></h1>
            <p className="o2-hero__lede">Psicanálise aplicada à leitura do que move pessoas, relações e trabalho.</p>
            <div className="o2-hero__actions">
              <a className="o2-hero__cta" href="#contato">Agende uma conversa <Arrow /></a>
              <a className="o2-hero__secondary" href="#abertura">Conheça nossa abordagem <Arrow down /></a>
            </div>
            <p className="o2-hero__note"><i aria-hidden="true" />O simbólico nunca se fecha.</p>
          </div>
          <figure className="o2-hero__media">
            <img
              src="/hero-architecture-clean.png"
              alt="Ambiente arquitetônico circular com camadas que evocam linguagem, sujeito e desejo"
              decoding="async"
              fetchPriority="high"
            />
          </figure>
        </div>
        <HeroTrace />
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

          <div className="o2-opening__path">
            <p className="o2-kicker">Três movimentos</p>
            <h3>Da escuta à direção.</h3>
            <div className="o2-opening__path-body">
              <svg className="o2-opening__thread" viewBox="0 0 48 390" preserveAspectRatio="none" aria-hidden="true">
                <path d="M24 0C8 58 42 95 24 146C6 198 43 242 24 292C8 334 22 365 24 390" />
              </svg>
              <ol className="o2-opening__sequence" aria-label="Etapas da abordagem" role="tablist">
                {approachMoments.map((moment, index) => (
                  <li key={moment.title} role="presentation">
                    <button
                      type="button"
                      id={`approach-tab-${index}`}
                      role="tab"
                      aria-selected={activeApproach === index}
                      aria-controls="approach-panel"
                      tabIndex={activeApproach === index ? 0 : -1}
                      className={activeApproach === index ? "is-active" : ""}
                      onClick={() => setActiveApproach(index)}
                      onKeyDown={(event) => handleApproachKeyDown(event, index)}
                    >
                      <i aria-hidden="true" />
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{moment.title}</strong>
                      <small>{moment.subtitle}</small>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
            <div
              className="o2-opening__insight"
              id="approach-panel"
              role="tabpanel"
              aria-labelledby={`approach-tab-${activeApproach}`}
              aria-live="polite"
            >
              <span>Em foco · {String(activeApproach + 1).padStart(2, "0")}/03</span>
              <p key={approach.title}>{approach.text}</p>
            </div>
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
            className={`o2-solution-browser__panel is-${serviceDirection}`}
            id="service-panel"
            key={service.title}
            role="tabpanel"
            aria-labelledby={`service-tab-${activeService}`}
            aria-live="polite"
          >
            <figure><img data-cms-key={`solution-${activeService + 1}-image`} src={service.image} alt={service.alt} loading="lazy" decoding="async" /></figure>
            <div>
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
            <img data-cms-key="red-balloon-case-image" src="/case-redballoon-reuniao-v2.png" alt="Encontro de diagnóstico com lideranças da Red Balloon" loading="lazy" decoding="async" />
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
          <img data-cms-key="founders-image" src="/fundadoras-v2.png" alt="Mônica Miranda e Kátia Puente, fundadoras da Objeto 2a" loading="lazy" decoding="async" />
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

      <section className="o2-contact" id="contato" data-cms-section-key="contato">
        <div className="o2-contact__lead">
          <p className="o2-kicker">Uma conversa para começar</p>
          <h2>Traga o desafio.<br /><em>A gente começa pela escuta.</em></h2>
          <p>Conte o que está pedindo movimento. A partir da questão real, pensamos juntos no melhor ponto de partida.</p>
          <a href={whatsapp} target="_blank" rel="noreferrer">Conversar direto no WhatsApp <Arrow /></a>
        </div>

        <form className="o2-contact__form" onSubmit={handleSubmit}>
          <div className="o2-contact__form-heading">
            <span>Mensagem</span>
            <h3>Qual desafio sua organização está vivendo?</h3>
          </div>
          <label>Nome<input name="name" required autoComplete="name" placeholder="Seu nome" /></label>
          <label>E-mail<input name="email" required type="email" autoComplete="email" placeholder="voce@empresa.com" /></label>
          <label>O que precisa se mover?<textarea name="message" required rows="3" placeholder="Conte em poucas palavras" /></label>
          <button type="submit">Enviar pelo WhatsApp <Arrow /></button>
          <p className="o2-form-status" role="status">
            {formState === "sent" ? "O WhatsApp será aberto com a mensagem preenchida." : " "}
          </p>
        </form>
      </section>

      <footer className="o2-footer">
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
          <span>Rio de Janeiro · Brasil</span>
          <a href="#inicio">Voltar ao início ↑</a>
        </div>
      </footer>
    </main>
  );
}
