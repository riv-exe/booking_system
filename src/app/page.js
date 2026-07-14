// app/page.js
import Navbar from "./components/layout/navbar";
import FeatCourts from "./components/section/featCourts";
import TrackStatus from "./components/layout/trackStatus";
import Footer from "./components/layout/footer";

export default function Home() {
  return (
    <div>
      <Navbar />

      <div className="relative px-6 md:px-10 min-h-[calc(100vh-75px)] flex items-center justify-center overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full -z-10 opacity-[0.08] pointer-events-none"
          viewBox="0 0 1200 800"
          fill="none"
        >
          <circle
            cx="950"
            cy="150"
            r="260"
            stroke="var(--primary)"
            strokeWidth="2"
          />
          <circle
            cx="950"
            cy="150"
            r="180"
            stroke="var(--shuttle)"
            strokeWidth="2"
          />

          <path
            d="M-50 650 C200 500, 350 700, 600 550"
            stroke="var(--primary)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <path
            d="M-100 700 C180 540, 360 760, 650 600"
            stroke="var(--foreground)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <path
            d="M720 520 C820 420, 900 300, 1040 220"
            stroke="var(--shuttle)"
            strokeWidth="3"
            strokeDasharray="8 12"
            strokeLinecap="round"
          />

          <circle
            cx="1040"
            cy="220"
            r="8"
            fill="var(--shuttle)"
          />

          <circle
            cx="250"
            cy="180"
            r="6"
            fill="var(--primary)"
          />

          <circle
            cx="350"
            cy="250"
            r="4"
            fill="var(--shuttle)"
          />

          <circle
            cx="850"
            cy="600"
            r="5"
            fill="var(--primary)"
          />

          <path
            d="M100 100 H1100 M100 200 H1100 M100 300 H1100 M100 400 H1100 M100 500 H1100 M100 600 H1100"
            stroke="var(--foreground)"
            strokeWidth="1"
            opacity="0.15"
          />

          <path
            d="M200 50 V750 M400 50 V750 M600 50 V750 M800 50 V750 M1000 50 V750"
            stroke="var(--foreground)"
            strokeWidth="1"
            opacity="0.15"
          />
        </svg>

        <div className="flex flex-col items-center text-center gap-6 py-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 w-fit px-3 py-1 rounded-full border border-(--line-color) text-xs text-(--foreground)/70">
            <span className="live-dot w-1.5 h-1.5 rounded-full bg-(--shuttle]" />
            Live court booking · Philippines
          </div>

          <p className="font-display text-5xl md:text-6xl font-bold leading-[1.05]">
            Your next game is just a{" "}
            <span className="relative inline-block text-(--primary)">
              booking
              <svg
                className="absolute -bottom-4 left-0 w-full"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 8 C 40 2, 80 10, 120 5 S 180 2, 198 6"
                  fill="none"
                  stroke="var(--shuttle)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            away.
          </p>
          <p className="text-lg text-(--foreground)/70">
            Find a court, check real-time availability, and book a slot in under a minute.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button className="px-6 py-3 rounded-full bg-(--primary) text-(--white) font-medium cursor-pointer hover:opacity-90 transition-opacity">
              Find a court
            </button>
            <button className="px-6 py-3 rounded-full border border-(--line-color) font-medium cursor-pointer hover:border-(--foreground)/40 transition-colors">
              How it works
            </button>
          </div>
        </div>
      </div>

      <FeatCourts />
      <TrackStatus />
      <Footer />
    </div>
  );
}