import { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    quote: "O grupo demonstrou maturidade tática e inteligência relacional para lidar com os desafios.",
    author: "Relatório qualitativo",
    context: "Red Balloon",
  },
  {
    quote: "A equipe mostrou adaptabilidade, acolhimento e capacidade de manejar os ruídos operacionais.",
    author: "Ciclo de desenvolvimento",
    context: "Lideranças",
  },
  {
    quote: "A transformação acontece quando escuta ativa, clareza e fortalecimento das lideranças caminham juntos.",
    author: "Recomendação",
    context: "Objeto 2A",
  },
];

const cases = [
  {
    title: "Programa de liderança",
    text: "Diagnóstico e desenvolvimento de soft skills com lideranças de cinco unidades.",
    tag: "RED BALLOON | 2025",
    image: "/case-redballoon-dia2.jpg",
    size: "wide",
  },
  {
    title: "Mentorias",
    text: "Percursos individuais para ampliar repertório, autonomia e direção.",
    tag: "DESENVOLVIMENTO | CONTÍNUO",
    image: "/mentoring.jpg",
    size: "small",
  },
  {
    title: "Workshops experienciais",
    text: "Aprendizagem prática para transformar reflexão em movimento.",
    tag: "EQUIPES | SOB MEDIDA",
    image: "/case-redballoon-monica.png",
    size: "small",
  },
  {
    title: "Laboratórios de aprendizagem",
    text: "Problemas reais, metodologias ativas e construção coletiva.",
    tag: "INOVAÇÃO | PRÁTICA",
    image: "/bootcamp.png",
    size: "small",
  },
  {
    title: "Facilitação estratégica",
    text: "Conversas que organizam sentidos e constroem acordos possíveis.",
    tag: "CULTURA | RELAÇÕES",
    image: "/facilitation.jpg",
    size: "small",
  },
  {
    title: "Mapa da empatia",
    text: "Ferramentas de leitura humana aplicadas ao contexto do trabalho.",
    tag: "ESCUTA | CONTEXTO",
    image: "/mapa-empatia.jpg",
    size: "wide",
  },
];

const pillars = [
  {
    title: "Escuta ativa",
    text: "Lemos o que aparece nos indicadores e também o que ainda não encontrou linguagem.",
  },
  {
    title: "Desenho singular",
    text: "Cada contexto pede uma combinação própria de repertórios, práticas e experiências.",
  },
  {
    title: "Transformação possível",
    text: "A mudança ganha corpo quando reflexão, relação e ação acontecem juntas.",
  },
];

const services = [
  {
    title: "Programas para organizações",
    text: "Jornadas completas para lideranças, equipes e culturas em movimento. Do diagnóstico ao acompanhamento qualitativo.",
    image: "/case-redballoon-reuniao.png",
    points: ["Diagnóstico organizacional", "Liderança e cultura", "Soft skills e CNV", "Relatório qualitativo de progresso"],
  },
  {
    title: "Mentorias individuais e coletivas",
    text: "Percursos de desenvolvimento com profundidade, direção e aplicação no cotidiano.",
    image: "/mentoring.jpg",
    points: ["Liderança", "Carreira e reinvenção", "Marca pessoal", "Autoconhecimento aplicado"],
  },
  {
    title: "Workshops & masterclasses",
    text: "Experiências concentradas para abrir repertórios, mobilizar conversas e ativar novas práticas.",
    image: "/case-redballoon-katia.png",
    points: ["Comunicação e feedback", "Inteligência emocional", "Pensamento crítico", "Metodologias ativas"],
  },
  {
    title: "Facilitação & laboratórios",
    text: "Espaços de construção coletiva para questões que não cabem em respostas prontas.",
    image: "/facilitation.jpg",
    points: ["Desenho de futuros", "Alinhamento de equipes", "Clínicas de ideias", "Learning sprints"],
  },
];

const insights = [
  {
    eyebrow: "RELAÇÕES",
    title: "Comunicação que atravessa conversas difíceis",
    image: "/case-redballoon-monica.png",
  },
  {
    eyebrow: "LIDERANÇA",
    title: "Autonomia não nasce de uma ordem",
    image: "/case-redballoon-katia.png",
  },
  {
    eyebrow: "FUTURO",
    title: "Pensamento crítico na era da inteligência artificial",
    image: "/nexo-humano-hero.png",
  },
];

const nexusStages = [
  {
    eyebrow: "01 · ESCUTAR",
    title: ["Entrar no", "contexto real"],
    metric: "Ponto de partida",
    value: "Escuta situada",
    detail: "Pessoas, relações e trabalho observados onde realmente acontecem.",
    image: "/fundadoras.png",
    alt: "Fundadoras da Objeto 2A em atividade",
  },
  {
    eyebrow: "02 · COMPREENDER",
    title: ["Ler o sistema", "por inteiro"],
    metric: "Diagnóstico vivo",
    value: "05 unidades",
    detail: "Uma leitura qualitativa que conecta cultura, rotina e relações.",
    image: "/case-redballoon-reuniao.png",
    alt: "Encontro de diagnóstico com equipe da Red Balloon",
  },
  {
    eyebrow: "03 · ATIVAR",
    title: ["Fazer a mudança", "ganhar corpo"],
    metric: "Efeito observado",
    value: "Maturidade tática",
    detail: "Experiências que ampliam autonomia, repertório e inteligência relacional.",
    image: "/case-redballoon-dia2.jpg",
    alt: "Experiência de desenvolvimento com lideranças",
  },
];

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function range(value, from, to) {
  return clamp((value - from) / (to - from));
}

function NexusScrollStory() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const variantRefs = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return undefined;
    let frame = 0;
    let current = 0;
    let target = 0;

    const updateTarget = () => {
      const rect = section.getBoundingClientRect();
      target = clamp((window.innerHeight - rect.top) / rect.height);
    };

    const animate = () => {
      current += (target - current) * 0.08;
      const first = 1 - range(current, 0.4, 0.426);
      const second = Math.min(
        range(current, 0.426, 0.451),
        1 - range(current, 0.683, 0.709),
      );
      const third = range(current, 0.709, 0.734);
      const fills = [
        range(current, 0, 0.426),
        range(current, 0.426, 0.709),
        range(current, 0.709, 1),
      ];
      pin.style.setProperty("--story-1", first);
      pin.style.setProperty("--story-2", second);
      pin.style.setProperty("--story-3", third);
      fills.forEach((fill, index) => {
        pin.style.setProperty(`--progress-${index + 1}`, `${fill * 100}%`);
      });
      variantRefs.current.forEach((variant, index) => {
        if (variant) variant.setAttribute("aria-hidden", fills[index] === 0 ? "true" : "false");
      });
      frame = requestAnimationFrame(animate);
    };

    updateTarget();
    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget);
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
    };
  }, []);

  return (
    <section className="nexus-story" ref={sectionRef} aria-label="Como a Objeto 2A atua">
      <div className="nexus-story__pin" ref={pinRef}>
        <div className="nexus-story__progress" aria-hidden="true">
          <i></i><i></i><i></i>
        </div>
        <div className="nexus-story__stage">
          {nexusStages.map((stage, index) => (
            <figure
              className={`nexus-story__photo nexus-story__photo--${index + 1}`}
              key={stage.image}
            >
              <img src={stage.image} alt={stage.alt} />
              <figcaption><span>0{index + 1}</span>{stage.eyebrow.split(" · ")[1]}</figcaption>
            </figure>
          ))}
          <span className="nexus-story__object-label">MÉTODO OBJETO 2A</span>
        </div>
        <div className="nexus-story__content">
          {nexusStages.map((stage, index) => (
            <article
              className={`nexus-story__variant nexus-story__variant--${index + 1}`}
              ref={(element) => { variantRefs.current[index] = element; }}
              key={stage.eyebrow}
            >
              <div className="nexus-story__copy">
                <p>{stage.eyebrow}</p>
                <h2>{stage.title.map((line) => <span key={line}>{line}</span>)}</h2>
              </div>
              <div className="nexus-story__metric">
                <small>{stage.metric}</small>
                <strong>{stage.value}</strong>
                <p><i></i>{stage.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Brand({ inverse = false }) {
  return (
    <a className={`brand ${inverse ? "brand--inverse" : ""}`} href="#inicio" aria-label="Objeto 2A — início">
      <span className="brand-type">OBJETO</span>
      <span className="brand-badge">2A</span>
    </a>
  );
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [formState, setFormState] = useState("idle");
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const heroRef = useRef(null);
  const expansionRef = useRef(null);

  useEffect(() => {
    let lastY = window.scrollY;
    const update = () => {
      const nextY = window.scrollY;
      setScrolled(nextY > window.innerHeight * 0.72);
      if (nextY > 180 && nextY > lastY + 2) setNavHidden(true);
      if (nextY < lastY - 2 || nextY < 120) setNavHidden(false);
      lastY = nextY;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return undefined;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let frame = 0;
    let currentX = hero.clientWidth * 0.68;
    let currentY = hero.clientHeight * 0.52;
    let currentSize = reducedMotion ? 260 : 0;
    let targetX = currentX;
    let targetY = currentY;
    let targetSize = currentSize;

    const render = () => {
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;
      currentSize += (targetSize - currentSize) * 0.12;
      hero.style.setProperty("--scan-x", `${currentX}px`);
      hero.style.setProperty("--scan-y", `${currentY}px`);
      hero.style.setProperty("--scan-size", `${currentSize}px`);
      frame = requestAnimationFrame(render);
    };
    const move = (event) => {
      const rect = hero.getBoundingClientRect();
      targetX = event.clientX - rect.left;
      targetY = event.clientY - rect.top;
    };
    const enter = () => { targetSize = 360; };
    const leave = () => { targetSize = 0; };
    const scroll = () => {
      if (finePointer || reducedMotion) return;
      const progress = clamp(window.scrollY / Math.max(hero.offsetHeight, 1));
      targetX = hero.clientWidth * (0.82 - progress * 0.32);
      targetY = hero.clientHeight * (0.92 - progress * 0.8);
      targetSize = 185;
    };

    if (finePointer && !reducedMotion) {
      hero.addEventListener("pointermove", move);
      hero.addEventListener("pointerenter", enter);
      hero.addEventListener("pointerleave", leave);
    } else {
      scroll();
      window.addEventListener("scroll", scroll, { passive: true });
    }
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerenter", enter);
      hero.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", scroll);
    };
  }, []);

  useEffect(() => {
    const track = expansionRef.current;
    if (!track) return undefined;
    let frame = 0;
    let target = 0;
    let current = 0;
    const update = () => {
      const rect = track.getBoundingClientRect();
      target = clamp((-rect.top + window.innerHeight * 0.78) / (rect.height - window.innerHeight * 0.2));
    };
    const animate = () => {
      current += (target - current) * 0.08;
      const eased = range(current, 0, 0.85);
      track.style.setProperty("--expand-y", `${20 * (1 - eased)}%`);
      track.style.setProperty("--expand-x", `${15 * (1 - eased)}%`);
      const copyProgress = range(current, 0.58, 0.85);
      track.style.setProperty("--expand-copy", copyProgress);
      track.style.setProperty("--expand-shift", `${24 * (1 - copyProgress)}px`);
      frame = requestAnimationFrame(animate);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setFormState("sending");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error();
      form.reset();
      setFormState("sent");
    } catch {
      setFormState("error");
    }
  }

  return (
    <main id="inicio">
      <header className={`site-header ${scrolled ? "site-header--light" : ""} ${navHidden ? "site-header--hidden" : ""}`}>
        <Brand inverse={!scrolled} />
        <nav className={menuOpen ? "nav is-open" : "nav"} aria-label="Navegação principal">
          <a href="#inicio" onClick={() => setMenuOpen(false)}>Início</a>
          <a href="#sobre" onClick={() => setMenuOpen(false)}>Sobre</a>
          <a href="#solucoes" onClick={() => setMenuOpen(false)}>Soluções</a>
          <a href="#trabalhos" onClick={() => setMenuOpen(false)}>Trabalhos</a>
          <a href="#contato" onClick={() => setMenuOpen(false)}>Contato</a>
        </nav>
        <a className="header-action" href="#contato">Vamos conversar</a>
        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <i></i><i></i>
        </button>
      </header>

      <section className="hero" ref={heroRef}>
        <video
          className="hero-image"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/workshop.jpg"
          aria-label="Equipe colaborando durante uma reunião"
        >
          <source src="/hero-collaboration.mp4" type="video/mp4" />
        </video>
        <div className="hero-scan" aria-hidden="true"></div>
        <div className="hero-shade"></div>
        <div className="hero-main">
          <div className="hero-copy">
            <h1>Desenhando futuros,<br />uma relação por vez.</h1>
            <p>
              Conectamos escuta, estratégia e aprendizagem para transformar
              pessoas, equipes e culturas.
            </p>
            <div className="button-row">
              <a className="button button--light" href="#contato">COMEÇAR UMA CONVERSA</a>
              <a className="button button--accent" href="#solucoes">NOSSAS SOLUÇÕES <span>↗</span></a>
            </div>
          </div>

          <div className="hero-proof">
            <div className="hero-stats">
              <div><strong>05<sup>+</sup></strong><span>unidades<br />impactadas</span></div>
              <div><strong>02<sup>×</sup></strong><span>olhares<br />complementares</span></div>
            </div>
            <div className="testimonial-window">
              <div className="testimonial-track">
                {testimonials.map((item) => (
                  <article key={item.quote}>
                    <p>“{item.quote}”</p>
                    <div><span>{item.author}<small>{item.context}</small></span><b>✦</b></div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <NexusScrollStory />

      <section className="about section-pad" id="sobre">
        <p className="overline">SOBRE A OBJETO 2A</p>
        <h2>Desenvolvimento humano<br />com escuta, precisão<br />e profundidade.</h2>
        <div className="about-pillars">
          {pillars.map((pillar, index) => (
            <article key={pillar.title}>
              <span>0{index + 1}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </article>
          ))}
        </div>
        <div className="about-collage">
          <figure className="about-image about-image--portrait">
            <img src="/fundadoras.png" alt="Mônica Miranda e Kátia Puente, fundadoras da Objeto 2A" />
          </figure>
          <div className="about-fragment">
            <img src="/mapa-empatia.jpg" alt="" />
            <p>Combinamos sociologia clínica, psicanálise aplicada, comunicação, gestão e metodologias ativas.</p>
          </div>
          <div className="about-story">
            <img src="/case-redballoon-reuniao.png" alt="Encontro de desenvolvimento com a equipe Red Balloon" />
            <p>
              Não entregamos uma resposta pronta. Entramos no sistema, escutamos
              o contexto e desenhamos a experiência que aquele movimento pede.
            </p>
            <div className="button-row">
              <a className="button button--dark" href="#solucoes">COMO ATUAMOS</a>
              <a className="button button--accent" href="#trabalhos">TRABALHOS <span>↗</span></a>
            </div>
          </div>
        </div>
      </section>

      <section className="works section-pad" id="trabalhos">
        <div className="section-head">
          <div>
            <p className="overline">TRABALHOS & EXPERIÊNCIAS</p>
            <h2>Ideias que ganham corpo no contexto real.</h2>
          </div>
          <a className="button button--dark" href="#contato">DESENHAR UMA JORNADA</a>
        </div>
        <div className="work-grid">
          {cases.map((item) => (
            <article className={`work-card work-card--${item.size}`} key={item.title}>
              <img src={item.image} alt="" />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <span>{item.tag}</span>
            </article>
          ))}
        </div>
        <article className="feature-case">
          <img src="/case-redballoon-reuniao.png" alt="Reunião de diagnóstico e desenvolvimento com a Red Balloon" />
          <div>
            <h3>Ciclo Red Balloon</h3>
            <p>
              Diagnóstico, experiência e desenvolvimento de soft skills para
              fortalecer comunicação, autonomia e inteligência relacional.
            </p>
            <span>RIO DE JANEIRO | 05 UNIDADES</span>
          </div>
        </article>
      </section>

      <section className="solutions section-pad" id="solucoes">
        <div className="section-head section-head--solutions">
          <div>
            <p className="overline">NOSSAS SOLUÇÕES</p>
            <h2>Soluções completas<br />do diagnóstico<br />ao movimento.</h2>
            <p className="section-summary">
              Formatos diferentes, uma mesma premissa: o conhecimento só
              transforma quando encontra o contexto.
            </p>
          </div>
          <a className="button button--dark" href="#contato">VER POSSIBILIDADES</a>
        </div>

        <div className="solution-overview">
          <img src={services[activeService].image} alt="" />
          <div className="solution-accordion">
            {services.map((service, index) => (
              <button
                type="button"
                className={index === activeService ? "is-active" : ""}
                onClick={() => setActiveService(index)}
                aria-expanded={index === activeService}
                key={service.title}
              >
                <span>
                  <b>{service.title}</b>
                  {index === activeService && <small>{service.text}</small>}
                </span>
                <i>{index === activeService ? "×" : "+"}</i>
              </button>
            ))}
          </div>
        </div>

        <div className="service-detail">
          <div>
            <p className="overline">EM DESTAQUE</p>
            <h3>{services[activeService].title}</h3>
            <p>{services[activeService].text}</p>
            <a className="button button--dark" href="#contato">CONVERSAR SOBRE ISSO <span>↗</span></a>
          </div>
          <img src={services[activeService].image} alt="" />
          <div className="key-points">
            <h4>Pontos-chave</h4>
            {services[activeService].points.map((point) => <p key={point}><i>✓</i>{point}</p>)}
          </div>
        </div>

        <div className="service-list">
          {services.map((service, index) => index !== activeService && (
            <button type="button" onClick={() => setActiveService(index)} key={service.title}>
              <h3>{service.title}</h3>
              <img src={service.image} alt="" />
              <span>+</span>
            </button>
          ))}
        </div>
      </section>

      <div className="manifesto-track" ref={expansionRef}>
        <section className="manifesto">
          <img src="/nexo-humano-hero.png" alt="" />
          <div>
            <h2>Transformando relações,<br />ativando futuros.</h2>
            <p>
              Quando pessoas conseguem ler melhor a si mesmas, o outro e o sistema,
              novas formas de trabalhar se tornam possíveis.
            </p>
            <a className="button button--accent" href="#contato">VAMOS CONVERSAR</a>
          </div>
        </section>
      </div>

      <section className="insights section-pad">
        <p className="overline">CAMPOS DE CONVERSA</p>
        <h2>Questões que atravessam o trabalho contemporâneo.</h2>
        <p className="section-summary">
          Liderança, comunicação, saúde relacional e pensamento crítico,
          tratados com profundidade e aplicação.
        </p>
        <div className="insight-grid">
          {insights.map((item) => (
            <article key={item.title}>
              <div className="insight-image">
                <img src={item.image} alt="" />
                <span>{item.eyebrow}</span>
              </div>
              <h3>{item.title}</h3>
              <p>Uma leitura Objeto 2A para ampliar repertório e ação.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact" id="contato">
        <div className="contact-head">
          <h2>Vamos conversar!</h2>
          <div>
            <p>
              Conte o que está pedindo movimento. A primeira conversa é para
              escutar, compreender e encontrar o melhor ponto de partida.
            </p>
            <a className="button button--light" href="#contact-form">INICIAR CONVERSA</a>
          </div>
        </div>

        <div className="contact-body">
          <div className="contact-brand">
            <Brand inverse />
            <p>Desenvolvimento humano,<br />uma relação por vez.</p>
            <a href="mailto:contato@objeto2a.com.br">contato@objeto2a.com.br</a>
            <p>Rio de Janeiro · Brasil</p>
          </div>
          <div className="footer-links">
            <div><b>Atuação</b><a href="#solucoes">Organizações</a><a href="#solucoes">Mentorias</a><a href="#solucoes">Experiências</a></div>
            <div><b>Objeto 2A</b><a href="#sobre">Sobre</a><a href="#trabalhos">Trabalhos</a><a href="#contato">Contato</a></div>
          </div>
          <form id="contact-form" onSubmit={handleSubmit}>
            <h3>Qual transformação você quer ativar?</h3>
            <label>Nome<input name="name" required autoComplete="name" placeholder="Seu nome" /></label>
            <label>E-mail<input name="email" required type="email" autoComplete="email" placeholder="voce@empresa.com" /></label>
            <label>Contexto<textarea name="message" required rows="2" placeholder="Conte em poucas palavras"></textarea></label>
            <input name="organization" type="hidden" value="" />
            <button type="submit" disabled={formState === "sending"}>
              {formState === "sending" ? "ENVIANDO..." : "ENVIAR"} <span>↗</span>
            </button>
            <p className={`form-status ${formState}`} role="status">
              {formState === "sent" && "Mensagem recebida. Em breve, continuamos a conversa."}
              {formState === "error" && "Não foi possível enviar agora. Tente novamente."}
            </p>
          </form>
        </div>

        <footer>
          <span>© {new Date().getFullYear()} Objeto 2A. Todos os direitos reservados.</span>
          <a href="#inicio">Voltar ao início ↑</a>
        </footer>
      </section>
    </main>
  );
}
