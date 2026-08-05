# Design System — Objeto 2a

## Product Context

- **What this is:** site institucional de uma consultoria fundamentada no ensino da psicanálise lacaniana, aplicada à leitura de contextos, relações e movimentos organizacionais.
- **Who it is for:** organizações, lideranças e equipes diante de questões de cultura, trabalho, comunicação e desenvolvimento.
- **Project type:** experiência institucional e editorial, com presença documental de trabalhos reais.
- **Memorable idea:** forma mínima, linguagem máxima. Escuta que produz direção.

## Brand Foundation

- **Concept:** o círculo aberto representa o campo do simbólico, nunca fechado e sempre em falta. O “2a” ocupa o ponto de apoio e remete ao objeto a como causa do desejo.
- **Voice:** rigorosa, clara, atenta, profunda e contemporânea.
- **Core vocabulary:** psicanálise, linguagem, sujeito, desejo, escuta, leitura e direção.
- **Logo:** usar o símbolo do círculo aberto com “2a” minúsculo e o lockup “Objeto 2a / CONSULTORIA”. Nunca substituir por “OBJETO” acompanhado de um círculo genérico com “2A”.

## Aesthetic Direction

- **Direction:** minimalismo editorial humano.
- **Decoration:** intencional e contida. A própria marca, a linha de apoio e a fotografia documental sustentam a composição.
- **Mood:** silencioso, preciso e acolhedor, com tensão entre estrutura e subjetividade.
- **Avoid:** gradientes decorativos, cartões genéricos, excesso de pílulas, tipografia ornamental, mudanças de família tipográfica e padrões típicos de landing pages geradas.
- **Hero budget:** tratar o primeiro quadro como um cartaz de marca: lockup oficial, uma frase, uma presença humana, uma frase curta de apoio e uma ação. Um único símbolo oficial ampliado pode existir como assinatura de fundo em baixa opacidade; não o empilhar com grade, trilho de progresso, linhas inferiores e metadados.

## Typography

- **Only family:** Sora.
- **Titles/highlights:** Sora SemiBold, 600.
- **Body/support:** Sora Regular, 400.
- **UI labels:** Sora Medium, 500, with restrained tracking.
- **Loading:** Google Fonts while no licensed self-hosted files are available.
- **Scale:** hero 68–104px; section title 48–92px; card title 24–42px; body 16px; label 10–12px.
- **Rule:** hierarchy comes from size, weight, spacing and placement, never from switching to a decorative serif or italic display face.

## Color

- **Deep navy — `#041833`:** profundidade, confiança e razão. Primary ink and dark surfaces.
- **Green — `#496859`:** equilíbrio, crescimento and cuidado. Supporting surface and state color.
- **Terracotta — `#D46A4A`:** desejo, energia and movimento. Rare directional accent and interaction color.
- **Sand — `#E7DCC8`:** acolhimento, clareza and neutralidade. Warm section and media surface.
- **Light gray — `#F2F2EE`:** silêncio, espaço and respiro. Secondary neutral surface.
- **Off-white — `#FAF9F6`:** pureza, foco and leveza. Primary light surface.
- **Monochrome applications:** `#111111`, `#2B2B2B`, `#6E6A63`, `#BDB7AD`, `#F2EFEA`.
- **Usage:** navy and off-white dominate. Green creates warmth in interactive surfaces. Sand belongs to supporting media or quiet environmental fields, not active-control fills. Terracotta marks action or direction and should not flood the interface.

## Spacing and Layout

- **Base unit:** 8px.
- **Density:** spacious, with deliberate changes of rhythm between editorial statement, evidence and action.
- **Grid:** 12-column desktop logic reduced to four visual columns in the hero; two columns on tablet; one column on mobile.
- **Max content width:** 1760px for full compositions and 1580px for reading sections.
- **Radius:** controls may use restrained asymmetric rounding, while major interactive panels may use selective 48–80px curves on opposing corners. Avoid applying the same radius everywhere.
- **Brand-symbol boundary:** the open-circle mark belongs to the logo and official identity applications. Do not repeat it as a button, tab, progress or navigation affordance.
- **Brand line:** use the horizontal support line with a small downward curve and a terracotta continuation as a recurring divider.

## Media

- Prefer authentic Objeto 2a material to generic stock photography.
- Preserve documentary evidence and visible wording.
- Avoid blurred filler around vertical footage.
- Use calm color treatment: slightly reduced saturation and controlled contrast, with no heavy duotone effects.

## Motion

- **Approach:** intentional and quiet.
- **Duration:** micro 100–160ms; short 200–280ms; narrative transitions 500–700ms.
- **Easing:** `cubic-bezier(.22, 1, .36, 1)` for entrances and natural `ease` for UI states.
- Motion must clarify progression or focus. It must not decorate empty space.

## Decisions Log

| Date | Decision | Rationale |
| --- | --- | --- |
| 2026-08-05 | The supplied color identity is the primary digital system; the neutral board is the monochrome variant. | The color board contains explicit semantic roles for each hue and a broader application system. |
| 2026-08-05 | Sora is the only public-site type family. | It is specified by the supplied identity and removes the artificial variation the user rejected. |
| 2026-08-05 | The identity boards supersede earlier invented palettes and temporary logos. | The supplied brand system is now the source of truth. |
| 2026-08-05 | Interaction styling should feel editorial and art-led rather than like product UI. | The user rejected beige segmented buttons, hard rectangular repetition and the telemetry-like chapter rail. |
| 2026-08-05 | Reserve the open-circle symbol for the identity and keep page content visible without scroll observers. | Repeating the mark across controls fragmented the composition, while observer-dependent reveals produced broken blank sections. |
| 2026-08-05 | Keep the chapter guide nearly invisible until interaction. | A narrow tick rail with labels on hover/focus preserves wayfinding without becoming a second visual subject. |
| 2026-08-05 | Let the hero express the brand through composition, not repeated diagrams and labels. | The user found the layered grid, lines, watermark, rail and metadata confusing; the official lockup, palette, typography and authentic video are enough to carry the identity. |
| 2026-08-05 | Retain one enlarged official symbol as a quiet hero background. | The user clarified that the symbol itself was a successful brand gesture; the problem was the combined excess around it. |
