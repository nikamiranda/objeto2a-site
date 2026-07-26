import { useMemo, useState } from "react";

const navigation = [
  ["/", "Início"],
  ["/metodo", "Método"],
  ["/solucoes", "Soluções"],
  ["/trabalhos", "Trabalhos"],
  ["/sobre", "Sobre"],
];

const methodSteps = [
  {
    number: "01",
    verb: "Escutar",
    title: "Entrar no contexto real",
    image: "/fundadoras-v2.png",
    caption: "Leitura situada",
    text: "Conversas, observação e perguntas que revelam como o trabalho e as relações acontecem de verdade.",
    outputs: ["Escuta de atores-chave", "Leitura de contexto", "Questão central compartilhada"],
  },
  {
    number: "02",
    verb: "Compreender",
    title: "Ler o sistema por inteiro",
    image: "/case-redballoon-reuniao-v2.png",
    caption: "Diagnóstico vivo",
    text: "Conectamos cultura, rotina, afetos e estratégia para reconhecer padrões e possibilidades de movimento.",
    outputs: ["Hipóteses de trabalho", "Mapa de tensões", "Desenho singular da jornada"],
  },
  {
    number: "03",
    verb: "Ativar",
    title: "Fazer a mudança ganhar corpo",
    image: "/case-redballoon-dia2.jpg",
    caption: "Experiência aplicada",
    text: "Criamos situações de aprendizagem que ampliam autonomia, repertório e inteligência relacional.",
    outputs: ["Experiências práticas", "Acompanhamento qualitativo", "Próximos movimentos"],
  },
];

const solutionCards = [
  {
    id: "programas",
    number: "01",
    title: "Programas para organizações",
    audience: "Organizações",
    need: "Cultura",
    image: "/case-redballoon-reuniao-v2.png",
    summary: "Jornadas completas, do diagnóstico ao acompanhamento.",
    formats: ["Diagnóstico organizacional", "Liderança e cultura", "Soft skills e CNV", "Relatório qualitativo"],
  },
  {
    id: "mentorias",
    number: "02",
    title: "Mentorias",
    audience: "Lideranças",
    need: "Desenvolvimento",
    image: "/mentoring.jpg",
    summary: "Percursos individuais ou coletivos com profundidade e aplicação.",
    formats: ["Liderança", "Carreira e reinvenção", "Marca pessoal", "Autoconhecimento aplicado"],
  },
  {
    id: "workshops",
    number: "03",
    title: "Workshops & masterclasses",
    audience: "Equipes",
    need: "Comunicação",
    image: "/case-redballoon-katia.png",
    summary: "Experiências concentradas para abrir repertórios e novas práticas.",
    formats: ["Comunicação e feedback", "Inteligência emocional", "Pensamento crítico", "Metodologias ativas"],
  },
  {
    id: "laboratorios",
    number: "04",
    title: "Facilitação & laboratórios",
    audience: "Equipes",
    need: "Estratégia",
    image: "/facilitation.jpg",
    summary: "Construção coletiva para questões que não cabem em respostas prontas.",
    formats: ["Desenho de futuros", "Alinhamento de equipes", "Clínicas de ideias", "Learning sprints"],
  },
];

function Brand({ inverse = false }) {
  return (
    <a className={`brand ${inverse ? "brand--inverse" : ""}`} href="/" aria-label="Objeto 2A — início">
      <span className="brand-type">OBJETO</span>
      <span className="brand-badge">2A</span>
    </a>
  );
}

function SubHeader({ path }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sub-header">
      <Brand />
      <nav className={open ? "sub-nav is-open" : "sub-nav"} aria-label="Navegação principal">
        {navigation.map(([href, label]) => (
          <a className={path === href ? "is-active" : ""} href={href} key={href}>{label}</a>
        ))}
      </nav>
      <a className="sub-header__action" href="/#contato">Vamos conversar</a>
      <button
        className="sub-menu"
        type="button"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <i></i><i></i>
      </button>
    </header>
  );
}

function PageHero({ eyebrow, title, intro, image, children }) {
  return (
    <section className="page-hero">
      <div className="page-hero__copy">
        <p className="overline">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
        {children}
      </div>
      <figure>
        <img src={image} alt="" />
        <figcaption>OBJETO 2A · RIO DE JANEIRO</figcaption>
      </figure>
    </section>
  );
}

function ContactBand({ title = "Qual transformação está pedindo movimento?" }) {
  return (
    <section className="sub-contact">
      <p className="overline">PRÓXIMA CONVERSA</p>
      <div>
        <h2>{title}</h2>
        <a className="button button--light" href="/#contato">CONTAR O CONTEXTO <span>↗</span></a>
      </div>
      <footer>
        <Brand inverse />
        <a href="mailto:contato@objeto2a.com.br">contato@objeto2a.com.br</a>
        <span>Rio de Janeiro · Brasil</span>
      </footer>
    </section>
  );
}

function MethodPage() {
  const [active, setActive] = useState(0);
  const step = methodSteps[active];
  return (
    <>
      <PageHero
        eyebrow="NOSSO MÉTODO"
        title={<>Escuta profunda.<br />Movimento possível.</>}
        intro="Uma jornada não começa pelo formato. Começa pela leitura do contexto e da relação entre pessoas, trabalho e cultura."
        image="/mapa-empatia.jpg"
      >
        <a className="text-link" href="#percurso">EXPLORAR O PERCURSO ↓</a>
      </PageHero>

      <section className="method-lab section-pad" id="percurso">
        <div className="sub-section-head">
          <p className="overline">UM PERCURSO EM TRÊS MOVIMENTOS</p>
          <span>Selecione uma etapa para ver como ela acontece.</span>
        </div>
        <div className="method-tabs" role="tablist" aria-label="Etapas do método">
          {methodSteps.map((item, index) => (
            <button
              className={index === active ? "is-active" : ""}
              type="button"
              role="tab"
              aria-selected={index === active}
              onClick={() => setActive(index)}
              key={item.verb}
            >
              <span>{item.number}</span>
              <b>{item.verb}</b>
            </button>
          ))}
        </div>
        <article className="method-panel">
          <figure>
            <img src={step.image} alt="" />
            <figcaption>{step.caption}</figcaption>
          </figure>
          <div>
            <p className="overline">{step.number} · {step.verb}</p>
            <h2>{step.title}</h2>
            <p>{step.text}</p>
            <ul>
              {step.outputs.map((output) => <li key={output}><i>✓</i>{output}</li>)}
            </ul>
          </div>
        </article>
      </section>

      <section className="foundations section-pad">
        <div className="sub-section-head">
          <p className="overline">REPERTÓRIOS QUE SE ENCONTRAM</p>
          <h2>Rigor para ler.<br />Criatividade para ativar.</h2>
        </div>
        <div className="foundation-grid">
          {[
            ["01", "Sociologia clínica", "A pessoa dentro de sua história e do sistema."],
            ["02", "Psicanálise aplicada", "O que mobiliza, resiste e ainda não ganhou linguagem."],
            ["03", "Liderança adaptativa", "Ação diante de desafios sem respostas prontas."],
            ["04", "Metodologias ativas", "Aprender fazendo, elaborando e experimentando."],
            ["05", "Comunicação & CNV", "Clareza, escuta e acordos nas relações."],
            ["06", "Acompanhamento qualitativo", "Evidências narrativas do progresso real."],
          ].map(([number, title, text]) => (
            <article key={title}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>
      </section>
      <ContactBand title="Um método vivo começa pela sua realidade." />
    </>
  );
}

function SolutionsPage() {
  const [audience, setAudience] = useState("Todos");
  const [selected, setSelected] = useState(solutionCards[0].id);
  const audiences = ["Todos", "Organizações", "Lideranças", "Equipes"];
  const visible = useMemo(
    () => solutionCards.filter((item) => audience === "Todos" || item.audience === audience),
    [audience],
  );
  const detail = solutionCards.find((item) => item.id === selected) || visible[0];

  return (
    <>
      <PageHero
        eyebrow="SOLUÇÕES"
        title={<>Formatos diferentes.<br />Uma mesma profundidade.</>}
        intro="Escolha por contexto. Cada solução é redesenhada a partir da realidade, das pessoas e do movimento desejado."
        image="/workshop.jpg"
      />
      <section className="solution-finder section-pad">
        <div className="sub-section-head">
          <div>
            <p className="overline">ENCONTRE UM PONTO DE PARTIDA</p>
            <h2>Para quem é o movimento?</h2>
          </div>
          <div className="filter-row" aria-label="Filtrar soluções">
            {audiences.map((item) => (
              <button
                className={audience === item ? "is-active" : ""}
                type="button"
                onClick={() => {
                  setAudience(item);
                  const first = solutionCards.find((solution) => item === "Todos" || solution.audience === item);
                  if (first) setSelected(first.id);
                }}
                key={item}
              >{item}</button>
            ))}
          </div>
        </div>

        <div className="solution-browser">
          <div className="solution-browser__list">
            {visible.map((item) => (
              <button
                className={detail.id === item.id ? "is-active" : ""}
                type="button"
                onClick={() => setSelected(item.id)}
                key={item.id}
              >
                <span>{item.number}</span>
                <strong>{item.title}</strong>
                <small>{item.need}</small>
                <i>↗</i>
              </button>
            ))}
          </div>
          <article className="solution-browser__detail">
            <img src={detail.image} alt="" />
            <div>
              <p className="overline">{detail.audience} · {detail.need}</p>
              <h2>{detail.title}</h2>
              <p>{detail.summary}</p>
              <ul>{detail.formats.map((item) => <li key={item}>{item}</li>)}</ul>
              <a className="button button--dark" href="/#contato">CONVERSAR SOBRE ESTA SOLUÇÃO</a>
            </div>
          </article>
        </div>
      </section>

      <section className="compact-process section-pad">
        <p className="overline">O QUE PERMANECE EM TODOS OS FORMATOS</p>
        <div>
          {["Escuta antes da resposta", "Desenho sob medida", "Aplicação no cotidiano", "Leitura qualitativa do progresso"].map((item, index) => (
            <article key={item}><span>0{index + 1}</span><h3>{item}</h3></article>
          ))}
        </div>
      </section>
      <ContactBand title="A solução certa nasce da pergunta certa." />
    </>
  );
}

function WorksPage() {
  const [moment, setMoment] = useState(0);
  const moments = [
    { label: "Contexto", image: "/case-redballoon-reuniao-v2.png", title: "Cinco unidades, um sistema de relações", text: "O trabalho partiu da escuta de lideranças e dos desafios vividos na operação." },
    { label: "Experiência", image: "/case-redballoon-katia.png", title: "Soft skills no contexto real", text: "Encontros práticos conectaram comunicação, adaptabilidade e liderança às situações cotidianas." },
    { label: "Movimento", image: "/case-redballoon-dia2.jpg", title: "Maturidade tática e inteligência relacional", text: "O acompanhamento qualitativo registrou repertórios, ajustes e próximos movimentos." },
  ];
  const item = moments[moment];
  return (
    <>
      <PageHero
        eyebrow="TRABALHOS & EXPERIÊNCIAS"
        title={<>Ideias que ganham corpo<br />no contexto real.</>}
        intro="Projetos desenhados com cada cliente, com atenção à cultura, às relações e ao que precisa mudar na prática."
        image="/case-redballoon-monica.png"
      />
      <section className="case-feature section-pad">
        <div className="case-feature__title">
          <div><p className="overline">CASO DOCUMENTADO · 2025</p><h2>Red Balloon</h2></div>
          <div className="case-stat"><strong>05</strong><span>unidades<br />no Rio</span></div>
        </div>
        <div className="case-switcher">
          <div className="case-switcher__nav">
            {moments.map((entry, index) => (
              <button
                className={moment === index ? "is-active" : ""}
                type="button"
                onClick={() => setMoment(index)}
                key={entry.label}
              >
                <span>0{index + 1}</span>{entry.label}
              </button>
            ))}
          </div>
          <figure><img src={item.image} alt="" /></figure>
          <article><p className="overline">0{moment + 1} · {item.label}</p><h3>{item.title}</h3><p>{item.text}</p></article>
        </div>
      </section>

      <section className="evidence-strip">
        <blockquote>“O grupo demonstrou maturidade tática e inteligência relacional para lidar com os desafios.”</blockquote>
        <span>RELATÓRIO QUALITATIVO · CICLO DE DESENVOLVIMENTO</span>
      </section>

      <section className="work-mosaic section-pad">
        <div className="sub-section-head"><p className="overline">FORMATOS EM AÇÃO</p><h2>Cada encontro é também<br />um protótipo de futuro.</h2></div>
        <div>
          <figure className="is-wide"><img src="/facilitation.jpg" alt="" /><figcaption>Facilitação estratégica</figcaption></figure>
          <figure><img src="/bootcamp.png" alt="" /><figcaption>Bootcamps</figcaption></figure>
          <figure><img src="/mentoring.jpg" alt="" /><figcaption>Mentorias</figcaption></figure>
          <figure className="is-wide"><img src="/mapa-empatia.jpg" alt="" /><figcaption>Workshops experienciais</figcaption></figure>
        </div>
      </section>
      <ContactBand title="Seu contexto pode ser o próximo ponto de partida." />
    </>
  );
}

function AboutPage() {
  const [person, setPerson] = useState("monica");
  const people = {
    monica: {
      name: "Mônica Miranda",
      role: "Fundadora · estratégia, comunicação e desenvolvimento",
      image: "/case-redballoon-monica.png",
      fields: ["Comunicação", "Gestão", "Liderança", "Aprendizagem"],
    },
    katia: {
      name: "Kátia Puente",
      role: "Fundadora · escuta clínica e desenvolvimento humano",
      image: "/katia.jpg",
      fields: ["Sociologia clínica", "Psicanálise aplicada", "Relações", "Facilitação"],
    },
  };
  const profile = people[person];
  return (
    <>
      <PageHero
        eyebrow="SOBRE A OBJETO 2A"
        title={<>Dois olhares.<br />Um campo de possibilidades.</>}
        intro="A Objeto 2A conecta repertórios complementares para trabalhar o que existe entre estratégia e subjetividade, desempenho e saúde relacional."
        image="/fundadoras-v2.png"
      />
      <section className="founder-studio section-pad">
        <div className="sub-section-head">
          <div><p className="overline">QUEM FAZ</p><h2>Complementares<br />por escolha.</h2></div>
          <div className="founder-toggle">
            <button className={person === "monica" ? "is-active" : ""} onClick={() => setPerson("monica")} type="button">Mônica</button>
            <button className={person === "katia" ? "is-active" : ""} onClick={() => setPerson("katia")} type="button">Kátia</button>
          </div>
        </div>
        <article className="founder-card">
          <img src={profile.image} alt={profile.name} />
          <div>
            <p className="overline">{profile.role}</p>
            <h2>{profile.name}</h2>
            <div className="tag-cloud">{profile.fields.map((field) => <span key={field}>{field}</span>)}</div>
            <p>Um olhar que combina profundidade humana, leitura organizacional e capacidade de transformar reflexão em experiência.</p>
          </div>
        </article>
      </section>

      <section className="beliefs section-pad">
        <p className="overline">NO QUE ACREDITAMOS</p>
        <div className="belief-grid">
          {[
            ["01", "Toda organização é também uma rede de relações."],
            ["02", "O que não encontra linguagem continua agindo."],
            ["03", "Aprendizagem precisa tocar o trabalho real."],
            ["04", "Não existe transformação sem autoria."],
          ].map(([number, text]) => <article key={number}><span>{number}</span><h3>{text}</h3></article>)}
        </div>
      </section>

      <section className="about-photo-band">
        <img src="/case-redballoon-dia2.jpg" alt="Encontro de desenvolvimento facilitado pela Objeto 2A" />
        <div><p className="overline">O NEXO HUMANO</p><h2>Entre o técnico e o relacional, existe o lugar onde o trabalho realmente acontece.</h2></div>
      </section>
      <ContactBand title="Boas conversas mudam o desenho das possibilidades." />
    </>
  );
}

function NotFoundPage() {
  return (
    <section className="not-found">
      <Brand />
      <p className="overline">404 · CAMINHO NÃO ENCONTRADO</p>
      <h1>Vamos voltar<br />ao ponto de partida.</h1>
      <a className="button button--dark" href="/">IR PARA O INÍCIO</a>
    </section>
  );
}

export function Subpage({ path }) {
  const pages = {
    "/metodo": <MethodPage />,
    "/solucoes": <SolutionsPage />,
    "/trabalhos": <WorksPage />,
    "/sobre": <AboutPage />,
  };
  if (!pages[path]) return <NotFoundPage />;
  return (
    <main className="subpage">
      <SubHeader path={path} />
      {pages[path]}
    </main>
  );
}
