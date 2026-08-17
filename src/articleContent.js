export function slugifyArticle(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function normalizeArticle(value, fallbackSlug = "artigo") {
  const input = value && typeof value === "object" ? value : {};
  const title = String(input.title || "").trim().slice(0, 180);
  const slug = slugifyArticle(input.slug || title || fallbackSlug) || fallbackSlug;
  const sections = (Array.isArray(input.sections) ? input.sections : []).slice(0, 20).map((section) => ({
    heading: String(section?.heading || "").trim().slice(0, 180),
    paragraphs: (Array.isArray(section?.paragraphs) ? section.paragraphs : [])
      .map((paragraph) => String(paragraph || "").trim().slice(0, 12000))
      .filter(Boolean)
      .slice(0, 40),
  })).filter((section) => section.heading || section.paragraphs.length);

  return {
    id: String(input.id || slug).replace(/[^a-z0-9-]/gi, "").slice(0, 120) || slug,
    slug,
    category: String(input.category || "Pensamento").trim().slice(0, 80),
    title,
    excerpt: String(input.excerpt || "").trim().slice(0, 500),
    readingTime: String(input.readingTime || "5 min de leitura").trim().slice(0, 50),
    image: String(input.image || "/og-redesign.png").trim().slice(0, 2000),
    fieldImage: String(input.fieldImage || input.image || "/og-redesign.png").trim().slice(0, 2000),
    alt: String(input.alt || "").trim().slice(0, 500),
    fieldAlt: String(input.fieldAlt || input.alt || "").trim().slice(0, 500),
    imageWidth: Math.max(1, Math.min(10000, Number(input.imageWidth) || 1200)),
    imageHeight: Math.max(1, Math.min(10000, Number(input.imageHeight) || 800)),
    featured: Boolean(input.featured),
    author: String(input.author || "Objeto 2a").trim().slice(0, 120),
    sections,
    seo: {
      title: String(input.seo?.title || "").trim().slice(0, 120),
      description: String(input.seo?.description || "").trim().slice(0, 320),
      image: String(input.seo?.image || "").trim().slice(0, 2000),
    },
    publishedAt: input.publishedAt ? String(input.publishedAt).slice(0, 40) : "",
  };
}

export const defaultArticles = [
  normalizeArticle({
    id: "quando-a-organizacao-nao-encontra-palavras",
    slug: "quando-a-organizacao-nao-encontra-palavras",
    category: "Cultura & linguagem",
    title: "O que uma organização diz quando não encontra palavras",
    excerpt: "Silêncios, ruídos e repetições não são detalhes da rotina. Eles contam uma parte importante do que está em jogo no trabalho.",
    readingTime: "6 min de leitura",
    image: "/case-redballoon-reuniao-v2.png",
    fieldImage: "/mapa-empatia.jpg",
    alt: "Encontro de diagnóstico com lideranças da Red Balloon",
    fieldAlt: "Registro de uma matriz de escuta usada em trabalho de campo",
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
  }),
  normalizeArticle({
    id: "nr-1-e-riscos-psicossociais",
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
  }),
  normalizeArticle({
    id: "lideranca-como-leitura-de-contexto",
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
  }),
];

export function blankArticle() {
  return normalizeArticle({
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `artigo-${Date.now()}`,
    title: "Novo artigo",
    slug: "novo-artigo",
    excerpt: "",
    category: "Pensamento",
    readingTime: "5 min de leitura",
    image: "/og-redesign.png",
    alt: "",
    sections: [{ heading: "Primeira seção", paragraphs: [""] }],
  });
}
