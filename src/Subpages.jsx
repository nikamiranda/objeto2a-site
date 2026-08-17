import { useMemo, useState } from "react";
import { Brand, BrandLine } from "./Brand.jsx";
import { SiteFooter, SiteHeader } from "./HomePage.jsx";

const navigation = [
  ["/", "Início"],
  ["/metodo", "Método"],
  ["/solucoes", "Soluções"],
  ["/trabalhos", "Trabalhos"],
  ["/sobre", "Sobre"],
  ["/artigos", "Artigos"],
];

const methodSteps = [
  {
    number: "01",
    verb: "Escutar",
    title: "Entrar no contexto real",
    image: "/fundadoras-v2.png",
    alt: "Mônica Miranda e Kátia Puente em uma experiência da Objeto 2a",
    caption: "Leitura situada",
    text: "Conversas, observação e perguntas que revelam como o trabalho e as relações acontecem de verdade.",
    outputs: ["Escuta de atores-chave", "Leitura de contexto", "Questão central compartilhada"],
  },
  {
    number: "02",
    verb: "Compreender",
    title: "Ler o sistema por inteiro",
    image: "/case-redballoon-reuniao-v2.png",
    alt: "Encontro remoto de diagnóstico com lideranças da Red Balloon",
    caption: "Diagnóstico vivo",
    text: "Conectamos cultura, rotina, afetos e estratégia para reconhecer padrões e possibilidades de movimento.",
    outputs: ["Hipóteses de trabalho", "Mapa de tensões", "Desenho singular da jornada"],
  },
  {
    number: "03",
    verb: "Ativar",
    title: "Fazer a mudança ganhar corpo",
    image: "/case-redballoon-dia2.jpg",
    alt: "Experiência de desenvolvimento com lideranças da Red Balloon",
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
    alt: "Encontro de diagnóstico com lideranças da Red Balloon",
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
    alt: "Conversa de mentoria conduzida pela Objeto 2a",
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
    alt: "Workshop facilitado por Kátia Puente",
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
    alt: "Facilitação estratégica com uma equipe",
    summary: "Construção coletiva para questões que não cabem em respostas prontas.",
    formats: ["Desenho de futuros", "Alinhamento de equipes", "Clínicas de ideias", "Learning sprints"],
  },
  {
    id: "lideranca-2026",
    number: "05",
    title: "Liderança sustentável 2026",
    audience: "Organizações",
    need: "Saúde relacional",
    image: "/nexo-humano-hero.png",
    alt: "Material visual do programa Liderança sustentável 2026",
    summary: "Liderança, riscos psicossociais e autonomia humana no novo cenário organizacional.",
    formats: ["Inteligência emocional", "Comunicação não violenta", "NR-1 e riscos psicossociais", "Pensamento crítico na era da IA"],
  },
];

function SubHeader({ path }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sub-header">
      <Brand />
      <nav className={open ? "sub-nav is-open" : "sub-nav"} aria-label="Navegação principal">
        {navigation.map(([href, label]) => (
          <a className={path === href ? "is-active" : ""} href={href} target={href === "/artigos" ? "_blank" : undefined} rel={href === "/artigos" ? "noreferrer" : undefined} key={href}>{label}</a>
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

function PageHero({ eyebrow, title, intro, image, imageAlt, children }) {
  return (
    <section className="page-hero">
      <div className="page-hero__copy">
        <p className="overline">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
        {children}
      </div>
      <figure>
        <img src={image} alt={imageAlt} />
        <figcaption>OBJETO 2a · RIO DE JANEIRO</figcaption>
      </figure>
    </section>
  );
}

function ContactBand({ title = "Qual transformação está pedindo movimento?", withFooter = true }) {
  return (
    <section className="sub-contact">
      <p className="overline">PRÓXIMA CONVERSA</p>
      <div>
        <h2>{title}</h2>
        <a className="button button--light" href="https://wa.me/5521986287957" target="_blank" rel="noreferrer">CONTAR O CONTEXTO <span>↗</span></a>
      </div>
      {withFooter && (
        <footer>
          <Brand inverse />
          <div className="sub-contact__links">
            <a href="https://wa.me/5521986287957" target="_blank" rel="noreferrer">WhatsApp ↗</a>
            <a href="https://www.instagram.com/objeto2a/" target="_blank" rel="noreferrer">Instagram ↗</a>
            <a href="https://www.linkedin.com/company/objeto2a" target="_blank" rel="noreferrer">LinkedIn ↗</a>
          </div>
          <span>Rio de Janeiro · CNPJ 36.476.871/0001-23</span>
        </footer>
      )}
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
        imageAlt="Matriz de trabalho usada para mapear escuta e ação"
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
            <img src={step.image} alt={step.alt} />
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
        title={<>A questão vem<br />antes do formato.</>}
        intro="Programas, mentorias, workshops e laboratórios desenhados a partir do contexto, das pessoas e do movimento desejado."
        image="/case-redballoon-dia2.jpg"
        imageAlt="Experiência de desenvolvimento com lideranças da Red Balloon"
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
            <img src={detail.image} alt={detail.alt} />
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
    { label: "Contexto", image: "/case-redballoon-reuniao-v2.png", alt: "Encontro remoto de diagnóstico com lideranças da Red Balloon", title: "Cinco unidades, um sistema de relações", text: "O trabalho partiu da escuta de lideranças e dos desafios vividos na operação." },
    { label: "Experiência", image: "/case-redballoon-katia.png", alt: "Workshop conduzido por Kátia Puente com a Red Balloon", title: "Soft skills no contexto real", text: "Encontros práticos conectaram comunicação, adaptabilidade e liderança às situações cotidianas." },
    { label: "Movimento", image: "/case-redballoon-dia2.jpg", alt: "Experiência de desenvolvimento com lideranças da Red Balloon", title: "Maturidade tática e inteligência relacional", text: "O acompanhamento qualitativo registrou repertórios, ajustes e próximos movimentos." },
  ];
  const item = moments[moment];
  return (
    <>
      <PageHero
        eyebrow="TRABALHOS & EXPERIÊNCIAS"
        title={<>Ideias que ganham corpo<br />no contexto real.</>}
        intro="Projetos desenhados com cada cliente, com atenção à cultura, às relações e ao que precisa mudar na prática."
        image="/case-redballoon-monica.png"
        imageAlt="Mônica Miranda em encontro profissional da Objeto 2a"
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
          <figure><img src={item.image} alt={item.alt} /></figure>
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
          <figure className="is-wide"><img src="/facilitation.jpg" alt="Facilitação estratégica com uma equipe" /><figcaption>Facilitação estratégica</figcaption></figure>
          <figure><img src="/bootcamp.png" alt="Registros de bootcamps da Objeto 2a" /><figcaption>Bootcamps</figcaption></figure>
          <figure><img src="/mentoring.jpg" alt="Conversa de mentoria conduzida pela Objeto 2a" /><figcaption>Mentorias</figcaption></figure>
          <figure className="is-wide"><img src="/mapa-empatia.jpg" alt="Matriz usada em workshop experiencial" /><figcaption>Workshops experienciais</figcaption></figure>
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
      role: "Cofundadora · jornalista · administradora · professora",
      image: "/case-redballoon-monica.png",
      fields: ["Comunicação", "Inovação", "Formação de lideranças", "Design thinking"],
      bio: "Doutora em Psicanálise e Sociedade, atua na interseção entre comunicação, inovação e formação de lideranças. Reúne experiência em cargos C-level, mercado audiovisual, educação corporativa, metodologias ágeis e desenvolvimento pessoal. É diretora de Comunicação da ABT e professora adjunta da UVA-RJ.",
    },
    katia: {
      name: "Kátia Puente",
      role: "Cofundadora · socióloga clínica · antropóloga · educadora",
      image: "/katia.jpg",
      fields: ["Sociologia clínica", "Psicanálise e saúde", "Human leadership", "Neurodiversidade"],
      bio: "Doutora em Psicanálise e Saúde, há 27 anos conecta diferentes áreas do conhecimento, subjetividade e inovação para ativar novas formas de aprender, liderar e conviver. É conselheira científica da ABT, professora adjunta da UVA-RJ e investigadora associada OBD/ESPLAI, em Barcelona.",
    },
  };
  const profile = people[person];
  return (
    <>
      <section className="about-hero" id="inicio">
        <div className="about-shell about-hero__grid">
          <div className="about-hero__copy">
            <p className="overline">SOBRE A OBJETO 2a</p>
            <h1>Dois olhares.<br />Uma escuta que<br />produz direção.</h1>
            <p>A Objeto 2a aproxima psicanálise, sociologia clínica e comunicação para ler o que move pessoas, relações e trabalho.</p>
            <a className="about-text-link" href="#fundadoras">Conheça as fundadoras <span>↓</span></a>
          </div>
          <figure className="about-hero__media">
            <img src="/fundadoras-v2.png" alt="Mônica Miranda e Kátia Puente, fundadoras da Objeto 2a" />
            <figcaption><span>Mônica Miranda · Kátia Puente</span><span>Rio de Janeiro</span></figcaption>
          </figure>
        </div>
        <BrandLine className="about-hero__line" />
      </section>

      <section className="about-founders" id="fundadoras">
        <div className="about-shell">
          <header className="about-heading">
            <div><p className="overline">QUEM FAZ</p><h2>Complementares<br />por escolha.</h2></div>
            <p>Formações distintas que se encontram numa mesma prática: escutar com rigor para produzir leitura, linguagem e movimento.</p>
          </header>
          <div className="about-founder-tabs" role="tablist" aria-label="Conheça as fundadoras">
            {Object.entries(people).map(([key, item], index) => (
              <button
                className={person === key ? "is-active" : ""}
                onClick={() => setPerson(key)}
                type="button"
                role="tab"
                aria-selected={person === key}
                key={key}
              ><span>0{index + 1}</span>{item.name}</button>
            ))}
          </div>
          <article className="about-founder-profile">
            <figure><img src={profile.image} alt={profile.name} /></figure>
            <div className="about-founder-profile__copy">
              <p className="overline">{profile.role}</p>
              <h3>{profile.name}</h3>
              <p>{profile.bio}</p>
              <ul>{profile.fields.map((field) => <li key={field}>{field}</li>)}</ul>
            </div>
          </article>
        </div>
      </section>

      <section className="about-origin">
        <div className="about-shell about-origin__grid">
          <figure><img src="/workshop.jpg" alt="Experiência de aprendizagem facilitada pela Objeto 2a" /></figure>
          <div className="about-origin__copy">
            <p className="overline">NOSSA HISTÓRIA</p>
            <h2>Da Educriative<br />para a Objeto 2a.</h2>
            <p>A empresa nasceu como um laboratório de ativação e criação. Ao longo do caminho, a escuta ganhou mais profundidade e o trabalho encontrou seu eixo: transformar questões humanas e organizacionais em direção possível.</p>
            <div className="about-values">
              {["Escuta ativa", "Singularidade", "Aprendizagem contínua", "Inovação humanizada"].map((value, index) => <span key={value}><i>0{index + 1}</i>{value}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className="about-beliefs">
        <div className="about-shell">
          <div className="about-heading about-heading--beliefs"><p className="overline">NO QUE ACREDITAMOS</p><h2>Princípios que orientam<br />a nossa prática.</h2></div>
          <div className="about-belief-list">
            {[
              ["01", "Toda organização é também uma rede de relações."],
              ["02", "O que não encontra linguagem continua agindo."],
              ["03", "Aprendizagem precisa tocar o trabalho real."],
              ["04", "Não existe transformação sem autoria."],
            ].map(([number, text]) => <article key={number}><span>{number}</span><h3>{text}</h3></article>)}
          </div>
        </div>
      </section>

      <section className="about-manifesto">
        <div className="about-manifesto__media"><img src="/case-redballoon-dia2.jpg" alt="Encontro de desenvolvimento facilitado pela Objeto 2a" /></div>
        <div className="about-manifesto__copy"><p className="overline">O NEXO HUMANO</p><h2>Entre o técnico e o relacional existe o lugar onde o trabalho realmente acontece.</h2><p>É nesse intervalo que escutamos, lemos e construímos direção.</p></div>
      </section>
      <ContactBand title="Boas conversas mudam o desenho das possibilidades." withFooter={false} />
      <SiteFooter reveal rootLinks flow />
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
    <main className={`subpage ${path === "/sobre" ? "about-page" : ""}`.trim()}>
      {path === "/sobre"
        ? <SiteHeader solid staticSolid rootLinks brandHref="/" />
        : <SubHeader path={path} />}
      {pages[path]}
    </main>
  );
}
