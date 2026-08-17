import { useEffect, useMemo, useState } from "react";
import { Brand } from "./Brand.jsx";
import { SiteFooter } from "./HomePage.jsx";

const siteUrl = "https://objeto2a.com";

export const articles = [
  {
    slug: "quando-a-organizacao-nao-encontra-palavras",
    category: "Cultura & linguagem",
    title: "O que uma organização diz quando não encontra palavras",
    excerpt: "Silêncios, ruídos e repetições não são detalhes da rotina. Eles contam uma parte importante do que está em jogo no trabalho.",
    readingTime: "6 min de leitura",
    image: "/case-redballoon-reuniao-v2.png",
    alt: "Encontro de diagnóstico com lideranças da Red Balloon",
    imageWidth: 1593,
    imageHeight: 987,
    featured: true,
    sections: [
      {
        heading: "Nem todo problema chega como problema",
        paragraphs: [
          "Uma organização raramente anuncia, com precisão, aquilo que a atravessa. Às vezes, o que chega é uma sensação de desgaste, uma reunião que não avança, um conflito que volta com novas pessoas ou uma decisão que nunca se sustenta.",
          "Antes de procurar uma solução, vale escutar o modo como essa questão aparece. A linguagem de uma equipe — inclusive aquilo que ela evita dizer — ajuda a ler a relação entre trabalho, desejo, história e cultura.",
        ],
      },
      {
        heading: "O silêncio também organiza",
        paragraphs: [
          "Silêncio não significa necessariamente ausência de participação. Pode ser proteção, hierarquia, cansaço, discordância sem espaço ou uma tentativa de preservar vínculos. Reduzi-lo a falta de engajamento costuma fechar a conversa justamente onde ela poderia começar.",
          "Por isso, uma boa escuta não procura respostas rápidas. Ela cria condições para que aquilo que ainda não encontrou linguagem possa ganhar forma sem ser simplificado no caminho.",
        ],
      },
      {
        heading: "Dar nome muda o campo de ação",
        paragraphs: [
          "Quando um grupo encontra palavras mais precisas para o que vive, o problema deixa de parecer um traço individual ou um ruído inevitável. Ele pode ser visto, compartilhado e trabalhado coletivamente.",
          "É daí que nasce uma direção possível: não de uma fórmula pronta, mas de uma leitura que respeita o contexto e devolve autoria às pessoas envolvidas.",
        ],
      },
    ],
  },
  {
    slug: "nr-1-e-riscos-psicossociais",
    category: "Saúde & trabalho",
    title: "NR-1: riscos psicossociais pedem uma leitura que vá além do checklist",
    excerpt: "Cuidar da saúde no trabalho é olhar para as condições objetivas e para a qualidade das relações que elas produzem.",
    readingTime: "7 min de leitura",
    image: "/case-redballoon-dia2.jpg",
    alt: "Experiência de desenvolvimento com lideranças da Red Balloon",
    imageWidth: 1920,
    imageHeight: 1080,
    sections: [
      {
        heading: "Um tema de gestão, não apenas de conformidade",
        paragraphs: [
          "A atenção aos riscos psicossociais amplia a conversa sobre saúde e segurança. Ela convida as organizações a observar como ritmo, reconhecimento, autonomia, relações e modos de liderança afetam a experiência cotidiana de trabalho.",
          "Cumprir a norma é necessário. Mas a transformação acontece quando esse cuidado deixa de ser uma camada burocrática e passa a informar decisões reais de gestão.",
        ],
      },
      {
        heading: "O risco é vivido em relação",
        paragraphs: [
          "Indicadores, questionários e protocolos são importantes. Eles ganham mais potência quando acompanhados de escuta situada: como as pessoas nomeiam suas pressões? O que torna uma conversa difícil? Onde há sobrecarga, ambiguidade ou perda de sentido?",
          "Essa perspectiva evita respostas genéricas e ajuda a distinguir o que é sintoma de uma situação específica do que é padrão de funcionamento da organização.",
        ],
      },
      {
        heading: "Prevenção também é construir linguagem",
        paragraphs: [
          "Ambientes mais seguros não se criam apenas quando um problema explode. Eles se fortalecem quando equipes e lideranças conseguem reconhecer tensões, conversar sobre elas e combinar formas mais sustentáveis de trabalhar.",
          "Prevenção, nesse sentido, é uma prática contínua de leitura, diálogo e direção compartilhada.",
        ],
      },
    ],
  },
  {
    slug: "lideranca-como-leitura-de-contexto",
    category: "Liderança",
    title: "Liderança não é resposta pronta. É leitura de contexto.",
    excerpt: "Em cenários complexos, liderar começa por compreender o que cada situação pede antes de escolher o próximo movimento.",
    readingTime: "5 min de leitura",
    image: "/mentoring.jpg",
    alt: "Conversa de mentoria e desenvolvimento conduzida pela Objeto 2a",
    imageWidth: 1200,
    imageHeight: 800,
    sections: [
      {
        heading: "A urgência nem sempre pede velocidade",
        paragraphs: [
          "Há decisões que pedem ação imediata. Há outras que parecem urgentes porque ainda não foram suficientemente compreendidas. Misturar as duas coisas pode produzir mais movimento, sem necessariamente produzir direção.",
          "Liderar, em momentos de incerteza, é sustentar a pergunta tempo bastante para entender o campo: quem é afetado, o que se repete, quais interesses estão em jogo e que tipo de conversa ainda falta acontecer.",
        ],
      },
      {
        heading: "Contexto não é desculpa para paralisar",
        paragraphs: [
          "Ler o contexto não significa esperar por todas as certezas. Significa escolher uma intervenção compatível com o que se sabe agora, tornar suas hipóteses explícitas e permanecer disponível para aprender com os efeitos gerados.",
          "Isso troca a fantasia da resposta perfeita por uma postura mais responsável, curiosa e capaz de ajustar o percurso.",
        ],
      },
      {
        heading: "Direção se constrói com os outros",
        paragraphs: [
          "A liderança que dá direção não concentra todo o saber. Ela ajuda a equipe a transformar experiência dispersa em leitura comum e decisão praticável.",
          "Quando essa construção acontece, as pessoas reconhecem seu lugar no movimento e a mudança tem mais chance de ganhar corpo no cotidiano.",
        ],
      },
    ],
  },
];

function setMeta(selector, value, attribute = "content") {
  const element = document.head.querySelector(selector);
  if (element) element.setAttribute(attribute, value);
}

function EditorialSeo({ article }) {
  useEffect(() => {
    const path = article ? `/artigos/${article.slug}` : "/artigos";
    const title = article
      ? `${article.title} | Artigos Objeto 2a`
      : "Artigos | Objeto 2a — escuta, cultura e trabalho";
    const description = article
      ? article.excerpt
      : "Reflexões da Objeto 2a sobre cultura, liderança, linguagem, saúde e trabalho.";
    const image = article?.image || "/og-redesign.png";
    const absoluteImage = new URL(image, siteUrl).href;
    const canonical = `${siteUrl}${path}`;

    document.title = title;
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:type"]', article ? "article" : "website");
    setMeta('meta[property="og:url"]', canonical);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:image"]', absoluteImage);
    setMeta('meta[property="og:image:secure_url"]', absoluteImage);
    setMeta('meta[property="og:image:alt"]', article?.alt || "Artigos da Objeto 2a");
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
    setMeta('meta[name="twitter:image"]', absoluteImage);
    setMeta('meta[name="twitter:image:alt"]', article?.alt || "Artigos da Objeto 2a");

    let canonicalElement = document.head.querySelector('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement("link");
      canonicalElement.rel = "canonical";
      document.head.append(canonicalElement);
    }
    canonicalElement.href = canonical;

    document.getElementById("o2-editorial-schema")?.remove();
    const schema = document.createElement("script");
    schema.id = "o2-editorial-schema";
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify(article ? {
      "@context": "https://schema.org",
      "@type": "Article",
      mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
      headline: article.title,
      description: article.excerpt,
      image: { "@type": "ImageObject", url: absoluteImage, width: article.imageWidth, height: article.imageHeight },
      author: { "@type": "Organization", name: "Objeto 2a" },
      publisher: { "@type": "Organization", name: "Objeto 2a", logo: { "@type": "ImageObject", url: `${siteUrl}/favicon.svg` } },
    } : {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Artigos Objeto 2a",
      url: canonical,
      description,
      publisher: { "@type": "Organization", name: "Objeto 2a" },
      blogPost: articles.map((item) => ({ "@type": "BlogPosting", headline: item.title, url: `${siteUrl}/artigos/${item.slug}` })),
    });
    document.head.append(schema);

    return () => schema.remove();
  }, [article]);
  return null;
}

function EditorialHeader() {
  const [open, setOpen] = useState(false);
  const [onReading, setOnReading] = useState(false);
  const links = [
    ["/sobre", "Sobre"],
    ["/solucoes", "Atuação"],
    ["/artigos", "Artigos"],
    ["/#contato", "Contato"],
  ];
  useEffect(() => {
    const update = () => {
      const reading = document.querySelector(".article-detail__content--field");
      setOnReading(Boolean(reading && reading.getBoundingClientRect().top <= 92));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return (
    <header className={`o2-header editorial-site-header is-solid ${onReading ? "is-on-reading" : "is-on-cover"} ${open ? "is-menu-open" : ""}`}>
      <Brand href="/" />
      <nav className={open ? "is-open" : ""} aria-label="Navegação editorial">
        {links.map(([href, label]) => <a className={href === "/artigos" ? "is-current" : ""} href={href} onClick={() => setOpen(false)} key={href}>{label}</a>)}
        <a className="o2-nav__mobile-cta" href="/#contato" onClick={() => setOpen(false)}>Agende uma conversa</a>
      </nav>
      <a className="o2-header__cta" href="/#contato">Agende uma conversa</a>
      <button className="o2-menu" type="button" aria-expanded={open} aria-label={open ? "Fechar menu" : "Abrir menu"} onClick={() => setOpen((value) => !value)}><i /><i /></button>
    </header>
  );
}

function ArticleToc({ sections, readingTime }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const elements = sections.map((_, index) => document.getElementById(`artigo-secao-${index + 1}`)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(elements.indexOf(visible[0].target));
      },
      { rootMargin: "-18% 0px -62%", threshold: 0 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <aside className="article-detail__toc" aria-label="Sumário do artigo">
      <p>Sumário</p>
      <ol>
        {sections.map((section, index) => (
          <li className={active === index ? "is-active" : ""} key={section.heading}>
            <a href={`#artigo-secao-${index + 1}`} aria-current={active === index ? "location" : undefined}>
              <span>0{index + 1}</span>{section.heading}
            </a>
          </li>
        ))}
      </ol>
      <small>Tempo de leitura<br /><strong>{readingTime}</strong></small>
    </aside>
  );
}

function ArticleCard({ article, priority = false }) {
  return (
    <article className={`article-card${priority ? " article-card--priority" : ""}`}>
      <a className="article-card__media" href={`/artigos/${article.slug}`} aria-label={`Ler ${article.title}`}>
        <img src={article.image} alt={article.alt} width={article.imageWidth} height={article.imageHeight} loading={priority ? "eager" : "lazy"} decoding="async" />
      </a>
      <div className="article-card__body">
        <p className="article-card__meta"><span>{article.category}</span>{article.readingTime}</p>
        <h2><a href={`/artigos/${article.slug}`}>{article.title}</a></h2>
        <p>{article.excerpt}</p>
        <a className="article-card__link" href={`/artigos/${article.slug}`}>Ler artigo <span aria-hidden="true">↗</span></a>
      </div>
    </article>
  );
}

function LayoutSwitch({ current }) {
  return (
    <nav className="layout-switch" aria-label="Prévia de opções de layout">
      <span>Prévia</span>
      {[["a", "A"], ["b", "B"], ["c", "C"]].map(([id, label]) => (
        <a className={current === id ? "is-active" : ""} href={`/artigos?layout=${id}`} key={id} aria-label={`Ver layout ${label}`}>{label}</a>
      ))}
    </nav>
  );
}

function ArticleIndex({ preview = false }) {
  const [category, setCategory] = useState("Todos");
  const categories = ["Todos", ...articles.map((article) => article.category)];
  const visibleArticles = useMemo(() => category === "Todos" ? articles : articles.filter((article) => article.category === category), [category]);
  const featured = visibleArticles[0];
  const remaining = visibleArticles.slice(1);

  return (
    <>
      <EditorialSeo />
      <main className="editorial-page" id="inicio">
        <EditorialHeader />
        {preview && <LayoutSwitch current="a" />}
        <section className="editorial-intro" aria-labelledby="editorial-title">
          <div>
            <p className="editorial-eyebrow">Caderno Objeto 2a</p>
            <h1 id="editorial-title">Ideias para ler<br />o que está em jogo.</h1>
          </div>
          <p>Reflexões sobre linguagem, cultura, liderança e as relações que dão forma ao trabalho.</p>
        </section>
        <section className="editorial-featured" aria-labelledby="featured-title">
          <ArticleCard article={featured} priority />
        </section>
        <section className="editorial-list" aria-labelledby="all-articles-title">
          <header>
            <div><p className="editorial-eyebrow">Mais leituras</p><h2 id="all-articles-title">Para continuar a conversa.</h2></div>
            <div className="editorial-filter" aria-label="Filtrar artigos por tema">
              {categories.map((item) => <button className={category === item ? "is-active" : ""} type="button" onClick={() => setCategory(item)} key={item}>{item}</button>)}
            </div>
          </header>
          {remaining.length ? <div className="editorial-grid">{remaining.map((article) => <ArticleCard article={article} key={article.slug} />)}</div> : <p className="editorial-empty">Este é o único artigo deste tema por enquanto.</p>}
        </section>
        <section className="editorial-signup">
          <p className="editorial-eyebrow">Uma conversa para começar</p>
          <h2>O que no seu contexto está pedindo novas palavras?</h2>
          <a href="/#contato">Falar com a Objeto 2a <span aria-hidden="true">↗</span></a>
        </section>
        <SiteFooter reveal rootLinks flow />
      </main>
    </>
  );
}

function ArchiveLayout() {
  return (
    <>
      <EditorialSeo />
      <main className="editorial-page layout-archive" id="inicio">
        <EditorialHeader />
        <section className="archive-hero">
          <div><p className="editorial-eyebrow">Caderno Objeto 2a</p><h1>O trabalho<br />também tem<br /><em>entrelinhas.</em></h1></div>
          <p>Artigos para acompanhar as palavras, os impasses e as relações que organizam a vida nas empresas.</p>
          <span className="archive-hero__number">03<br /><small>leituras</small></span>
        </section>
        <section className="archive-lead">
          <a href={`/artigos/${articles[0].slug}`}><img src={articles[0].image} alt={articles[0].alt} /></a>
          <article><p className="article-card__meta"><span>{articles[0].category}</span>{articles[0].readingTime}</p><h2>{articles[0].title}</h2><p>{articles[0].excerpt}</p><a href={`/artigos/${articles[0].slug}`}>Abrir leitura <span>↗</span></a></article>
        </section>
        <section className="archive-index"><header><p className="editorial-eyebrow">Índice de campo</p><span>02 — 03</span></header>{articles.slice(1).map((article, index) => <article key={article.slug}><span>0{index + 2}</span><div><p>{article.category}</p><h2><a href={`/artigos/${article.slug}`}>{article.title}</a></h2></div><a href={`/artigos/${article.slug}`} aria-label={`Ler ${article.title}`}>↗</a></article>)}</section>
        <section className="archive-note"><p>Leitura que não simplifica o que está em jogo.</p><a href="/#contato">Conversar com a Objeto 2a ↗</a></section>
        <SiteFooter reveal rootLinks flow />
      </main>
    </>
  );
}

function SalonLayout() {
  return (
    <>
      <EditorialSeo />
      <main className="editorial-page layout-salon" id="inicio">
        <EditorialHeader />
        <LayoutSwitch current="c" />
        <section className="salon-hero"><p className="editorial-eyebrow">Artigos · opção C</p><span className="salon-hero__tag">Um lugar para demorar o olhar</span><h1>Uma ideia<br />pode abrir<br />uma conversa.</h1><p>Perspectivas para ler cultura, liderança e saúde relacional sem separar as pessoas do trabalho.</p></section>
        <section className="salon-feature"><figure><img src={articles[0].image} alt={articles[0].alt} /><figcaption>Em foco</figcaption></figure><article><p className="article-card__meta"><span>{articles[0].category}</span>{articles[0].readingTime}</p><h2>{articles[0].title}</h2><p>{articles[0].excerpt}</p><a href={`/artigos/${articles[0].slug}`}>Ler com calma <span>↗</span></a></article></section>
        <section className="salon-shelf"><p className="editorial-eyebrow">Na estante</p><div>{articles.slice(1).map((article) => <article key={article.slug}><a href={`/artigos/${article.slug}`}><img src={article.image} alt={article.alt} /></a><p>{article.category}</p><h2><a href={`/artigos/${article.slug}`}>{article.title}</a></h2><span>{article.readingTime}</span></article>)}</div></section>
        <section className="salon-closing"><p>O que merece encontrar linguagem no seu contexto?</p><a href="/#contato">Começar uma conversa ↗</a></section>
        <SiteFooter reveal rootLinks flow />
      </main>
    </>
  );
}

function ArticlePage({ article }) {
  const related = articles.filter((item) => item.slug !== article.slug).slice(0, 2);
  const fieldImage = article.slug === "quando-a-organizacao-nao-encontra-palavras" ? "/mapa-empatia.jpg" : article.image;
  const fieldAlt = article.slug === "quando-a-organizacao-nao-encontra-palavras" ? "Registro de uma matriz de escuta usada em trabalho de campo" : article.alt;
  return (
    <>
      <EditorialSeo article={article} />
      <main className="editorial-page article-page" id="inicio">
        <EditorialHeader />
        <article className="article-detail">
          <header className="article-detail__cover">
            <div className="article-detail__cover-inner">
              <a className="article-detail__back" href="/artigos">← Todos os artigos</a>
              <div className="article-detail__cover-meta">
                <p className="article-detail__kicker">Caderno de campo</p>
                <p className="article-card__meta"><span>{article.category}</span>{article.readingTime}</p>
              </div>
              <h1>{article.title}</h1>
              <p className="article-detail__lede">{article.excerpt}</p>
              <p className="article-detail__signature">Objeto 2a <i /> Psicanálise aplicada às organizações</p>
            </div>
          </header>
          <figure className="article-detail__field-image"><img src={fieldImage} alt={fieldAlt} width={article.imageWidth} height={article.imageHeight} fetchPriority="high" /><figcaption>Registro de campo · Objeto 2a</figcaption></figure>
          <div className="article-detail__content article-detail__content--field">
            <ArticleToc sections={article.sections} readingTime={article.readingTime} />
            <div>{article.sections.map((section, index) => <section id={`artigo-secao-${index + 1}`} key={section.heading}><p className="article-detail__section-number">0{index + 1}</p><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{index === 0 && <figure className="article-detail__inline-evidence"><img src={article.image} alt={article.alt} loading="lazy" /><figcaption>O trabalho de escuta acontece no contexto real.</figcaption></figure>}</section>)}</div>
          </div>
        </article>
        <section className="article-related" aria-labelledby="related-title"><p className="editorial-eyebrow">Continue lendo</p><h2 id="related-title">Outras perspectivas.</h2><div className="editorial-grid">{related.map((item) => <ArticleCard article={item} key={item.slug} />)}</div></section>
        <SiteFooter reveal rootLinks flow />
      </main>
    </>
  );
}

export function ArticlesPage({ path }) {
  const slug = path.replace("/artigos/", "");
  const article = articles.find((item) => item.slug === slug);
  const layout = new URLSearchParams(window.location.search).get("layout");
  if (article) return <ArticlePage article={article} />;
  if (layout === "b") return <ArchiveLayout />;
  if (layout === "c") return <SalonLayout />;
  if (layout === "a") return <ArticleIndex preview />;
  return <ArchiveLayout />;
}
