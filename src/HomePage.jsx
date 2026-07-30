import { useEffect, useRef, useState } from "react";

const whatsapp = "https://wa.me/5521986287957";

const navItems = [
  { label: "Soluções", href: "#solucoes" },
  { label: "Trabalhos", href: "#trabalhos" },
  { label: "Método", href: "#metodo" },
  { label: "Sobre", href: "#sobre" },
];

const methodStages = [
  {
    number: "01",
    eyebrow: "Diagnosticar",
    title: "Entrar no contexto real.",
    text: "Escutamos pessoas, lemos indicadores e observamos o trabalho como ele realmente acontece.",
    image: "/fundadoras-v2.png",
    alt: "Mônica Miranda e Kátia Puente, fundadoras da Objeto 2A",
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
    image: "/case-redballoon-reuniao-v2.png",
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

function Brand({ inverse = false }) {
  return (
    <a className={`o2-brand ${inverse ? "is-inverse" : ""}`} href="#inicio" aria-label="Objeto 2A — início">
      <span>OBJETO</span>
      <b>2A</b>
    </a>
  );
}

function Arrow({ down = false }) {
  return <span aria-hidden="true">{down ? "↓" : "↗"}</span>;
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
                <img data-cms-key={`method-${stage.number}-image`} src={stage.image} alt={stage.alt} />
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
            <figure><img data-cms-key={`method-${stage.number}-image`} src={stage.image} alt={stage.alt} /></figure>
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [formState, setFormState] = useState("idle");

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 48);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const items = document.querySelectorAll(".o2-reveal");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12 },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const message = encodeURIComponent(`Nome: ${data.name}\nE-mail: ${data.email}\n\nContexto:\n${data.message}`);
    setFormState("sent");
    window.open(`${whatsapp}?text=${message}`, "_blank", "noopener,noreferrer");
  }

  const service = services[activeService];

  return (
    <main className="o2-home" id="inicio">
      <header className={`o2-header ${scrolled || menuOpen ? "is-solid" : ""}`}>
        <Brand inverse={!scrolled && !menuOpen} />
        <nav className={menuOpen ? "is-open" : ""} aria-label="Navegação principal">
          {navItems.map((item) => (
            <a href={item.href} onClick={() => setMenuOpen(false)} key={item.href}>{item.label}</a>
          ))}
        </nav>
        <a className="o2-header__cta" href="#contato">Agendar conversa <Arrow /></a>
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

      <section className="o2-hero" data-cms-section-key="hero">
        <div className="o2-hero__copy">
          <p className="o2-kicker">Consultoria e desenvolvimento organizacional</p>
          <h1>Relações mais<br />saudáveis.<br /><em>Organizações</em><br /><em>mais vivas.</em></h1>
          <div className="o2-hero__summary">
            <p>Diagnóstico organizacional, programas de liderança, mentorias, workshops e facilitação para equipes e culturas em transformação.</p>
            <div className="o2-actions">
              <a className="o2-button is-coral" href="#contato">Agendar conversa de 30 min <Arrow /></a>
              <a className="o2-text-link" href="#solucoes">Explorar soluções <Arrow down /></a>
            </div>
          </div>
        </div>

        <div className="o2-hero__media">
          <video data-cms-key="hero-video" autoPlay muted loop playsInline preload="metadata" poster="/workshop.jpg" aria-label="Workshop colaborativo da Objeto 2A">
            <source src="/hero-objeto2a.mp4" type="video/mp4" />
          </video>
          <div className="o2-hero__caption">
            <span>Objeto 2A em campo</span>
            <span>Rio de Janeiro · Brasil</span>
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
          <div className="o2-solution-browser__tabs" role="tablist" aria-label="Soluções Objeto 2A">
            {services.map((item, index) => (
              <button
                type="button"
                role="tab"
                aria-selected={index === activeService}
                className={index === activeService ? "is-active" : ""}
                onClick={() => setActiveService(index)}
                key={item.title}
              >
                <span>0{index + 1}</span>
                <strong>{item.title}</strong>
                <i>{index === activeService ? "−" : "+"}</i>
              </button>
            ))}
          </div>
          <article className="o2-solution-browser__panel" role="tabpanel">
            <figure><img data-cms-key={`solution-${activeService + 1}-image`} src={service.image} alt={service.alt} /></figure>
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
          <h2>Da escuta à<br /><em>maturidade tática.</em></h2>
        </header>
        <div className="o2-case__body o2-reveal">
          <figure>
            <img data-cms-key="red-balloon-case-image" src="/case-redballoon-dia2.jpg" alt="Lideranças da Red Balloon em atividade de desenvolvimento" />
          </figure>
          <div className="o2-case__copy">
            <span>Red Balloon · 2025</span>
            <h3>Programa de desenvolvimento de lideranças</h3>
            <p>Diagnóstico organizacional e desenvolvimento de soft skills com lideranças de cinco unidades no Rio de Janeiro.</p>
            <blockquote>“O grupo demonstrou maturidade tática e inteligência relacional para lidar com os desafios.”</blockquote>
            <small>Relatório qualitativo do ciclo</small>
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
          <img data-cms-key="founders-image" src="/fundadoras-v2.png" alt="Mônica Miranda e Kátia Puente, fundadoras da Objeto 2A" />
          <figcaption>Mônica Miranda + Kátia Puente</figcaption>
        </figure>
        <div className="o2-about__copy o2-reveal">
          <p className="o2-kicker">Sobre a Objeto 2A</p>
          <h2>Dois olhares.<br /><em>Uma leitura inteira.</em></h2>
          <p>
            A Objeto 2A nasce do encontro entre repertórios complementares e de uma convicção:
            nenhuma transformação se sustenta sem escutar as relações que dão forma ao trabalho.
          </p>
          <p>
            Por isso, entramos em cada projeto com método, presença e curiosidade — para criar
            experiências que façam sentido naquele contexto, para aquelas pessoas.
          </p>
          <a className="o2-button is-outline" href="/sobre">Conheça nossa história <Arrow /></a>
        </div>
      </section>

      <section className="o2-cta" data-cms-section-key="cta">
        <p className="o2-kicker">Próximo passo</p>
        <h2>Traga o desafio.<br /><em>A gente começa pela escuta.</em></h2>
        <a className="o2-button is-light" href={whatsapp} target="_blank" rel="noreferrer">Agendar conversa no WhatsApp <Arrow /></a>
      </section>

      <section className="o2-contact" id="contato" data-cms-section-key="contato">
        <div className="o2-contact__lead">
          <Brand inverse />
          <h2>Conversa inicial, sem compromisso.</h2>
          <p>Em 30 minutos, entendemos o contexto e identificamos juntos o melhor ponto de partida.</p>
          <a href={whatsapp} target="_blank" rel="noreferrer">(21) 98628-7957 <Arrow /></a>
          <span>Rio de Janeiro · Brasil</span>
        </div>

        <form onSubmit={handleSubmit}>
          <h3>Qual desafio sua organização está vivendo?</h3>
          <label>Nome<input name="name" required autoComplete="name" placeholder="Seu nome" /></label>
          <label>E-mail<input name="email" required type="email" autoComplete="email" placeholder="voce@empresa.com" /></label>
          <label>O que precisa se mover?<textarea name="message" required rows="3" placeholder="Conte em poucas palavras" /></label>
          <button type="submit">Enviar pelo WhatsApp <Arrow /></button>
          <p className="o2-form-status" role="status">
            {formState === "sent" ? "O WhatsApp será aberto com a mensagem preenchida." : " "}
          </p>
        </form>

        <div className="o2-contact__links">
          <div>
            <b>Navegação</b>
            {navItems.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}
          </div>
          <div>
            <b>Social</b>
            <a href="https://www.instagram.com/objeto2a/" target="_blank" rel="noreferrer">Instagram <Arrow /></a>
            <a href="https://www.linkedin.com/company/objeto2a" target="_blank" rel="noreferrer">LinkedIn <Arrow /></a>
          </div>
        </div>

        <footer>
          <span>© {new Date().getFullYear()} Objeto 2A</span>
          <a href="#inicio">Voltar ao início ↑</a>
        </footer>
      </section>
    </main>
  );
}
