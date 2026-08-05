export function BrandSymbol({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Símbolo Objeto 2a"
    >
      <path
        d="M18.5 51.5A24 24 0 1 1 52 37"
        fill="none"
        stroke="currentColor"
        strokeWidth="5.5"
        strokeLinecap="butt"
      />
      <text
        x="35.5"
        y="56"
        fill="currentColor"
        fontFamily="Sora, sans-serif"
        fontSize="21"
        fontWeight="600"
        letterSpacing="-1.5"
      >
        2a
      </text>
    </svg>
  );
}

export function Brand({ inverse = false, href = "/", className = "" }) {
  return (
    <a
      className={`o2-signature ${inverse ? "is-inverse" : ""} ${className}`.trim()}
      href={href}
      aria-label="Objeto 2a Consultoria — início"
    >
      <BrandSymbol className="o2-signature__symbol" />
      <span className="o2-signature__lockup">
        <strong>Objeto 2a</strong>
        <small>Consultoria</small>
      </span>
    </a>
  );
}

export function BrandLine({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1000 34"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path className="o2-brand-line__base" d="M0 5H742C742 20 750 29 766 29" />
      <path className="o2-brand-line__accent" d="M766 29H1000" />
    </svg>
  );
}
