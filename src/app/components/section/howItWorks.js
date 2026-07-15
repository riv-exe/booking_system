const steps = [
  {
    number: "01",
    title: "Pick the court of your interest",
    description:
      "Discover courts that match your location, preferences, and playing style.",
  },
  {
    number: "02",
    title: "Compare & pick a slot",
    description:
      "Filter by price, surface, and time. See real-time availability before you commit.",
  },
  {
    number: "03",
    title: "Book in one tap",
    description:
      "Confirm your slot and you're on the court list instantly — no calls, no waiting.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative px-6 md:px-10 py-24 overflow-hidden scroll-mt-20"
    >
      <svg
        className="absolute inset-0 w-full h-full -z-10 opacity-[0.06] pointer-events-none"
        viewBox="0 0 1200 400"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 350 C300 250, 500 380, 800 260 S 1100 200, 1200 280"
          stroke="var(--shuttle)"
          strokeWidth="2"
          strokeDasharray="6 10"
          strokeLinecap="round"
        />
      </svg>

      <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-4 mb-16">
        <span className="text-xs uppercase tracking-widest text-(--foreground)/50">
          The process
        </span>
        <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
          How it works
        </h2>
        <p className="text-lg text-(--foreground)/70 max-w-md">
          Three steps between you and your next match.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <div
            key={step.number}
            className="relative flex flex-col gap-3 p-6 rounded-2xl border border-(--line-color) hover:border-(--primary)/40 transition-colors"
          >
            <span className="font-display text-3xl font-bold text-(--primary)/30">
              {step.number}
            </span>
            <h3 className="text-lg font-semibold">{step.title}</h3>
            <p className="text-(--foreground)/70 text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}