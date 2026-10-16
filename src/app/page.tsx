export default function Home() {
  return (
    <main className="shell">
      <svg
        className="mark"
        viewBox="0 0 263 264"
        role="img"
        aria-label="Prisma"
      >
        <rect width="263" height="264" fill="#ffffff" />
        <path
          d="M57.3357 92.5003L0 149.939V53.5L53.2105 0.10425V0H149.524L57.3357 92.5003Z"
          fill="#04d5e7"
        />
        <path
          d="M263 91.7452L91.0537 264H0V172.229L171.92 0H263V91.7452Z"
          fill="#fe4352"
        />
        <path
          d="M209.686 264H113.373L156.453 220.773L263.001 114.034V210.5L209.686 264Z"
          fill="#febe29"
        />
      </svg>
      <p className="lede">Your application will appear here.</p>
      <div className="card" aria-hidden="true">
        <div className="bone" style={{ width: "45%", height: "0.75rem" }} />
        <div className="bone" style={{ width: "90%" }} />
        <div className="bone" style={{ width: "70%" }} />
        <div
          className="bone"
          style={{ height: "2rem", marginTop: "0.25rem" }}
        />
      </div>
    </main>
  );
}
