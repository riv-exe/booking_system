"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HomeFeatCards from "../cards/homeFeatCards";

function HomeFeatCardSkeleton() {
  return (
    <div
      data-card
      className="shrink-0 bg-background border border-(--line-color) rounded-2xl w-64 overflow-hidden animate-pulse"
    >
      <div className="w-full h-36 bg-(--foreground)/10" />

      <div className="p-4 flex flex-col gap-2">
        <div className="h-4 w-3/4 rounded bg-(--foreground)/10" />
        <div className="h-3 w-1/2 rounded bg-(--foreground)/10" />

        <div className="mt-6 flex items-center justify-between">
          <div className="h-4 w-16 rounded bg-(--foreground)/10" />
          <div className="h-4 w-4 rounded-full bg-(--foreground)/10" />
        </div>
      </div>
    </div>
  );
}

export default function FeatCourts() {
  const [courts, setCourts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchCourts();
  }, []);

  async function fetchCourts() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/courts");
      const data = await res.json();
      setCourts(data.courts || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function updateScrollButtons() {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(
      el.scrollLeft + el.clientWidth < el.scrollWidth - 5
    );
  }

  useEffect(() => {
    updateScrollButtons();

    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [courts, isLoading]);

  function scroll(direction) {
    const el = scrollRef.current;
    if (!el) return;

    const card = el.querySelector("[data-card]");
    if (!card) return;

    const amount = card.clientWidth + 24;

    el.scrollTo({
      left: el.scrollLeft + (direction === "left" ? -amount : amount),
      behavior: "smooth",
    });
  }

  return (
    <div className="bg-(--secondary) py-16">
      <div className="px-6 md:px-10 flex flex-col items-center text-center gap-2">
        <span className="font-display text-xs tracking-[0.2em] uppercase text-(--foreground)/50">
          Featured courts
        </span>

        <p className="font-display text-3xl md:text-4xl font-bold">
          No more waiting — just find a court and start playing.
        </p>
      </div>

      <div className="group/carousel relative mt-10">
        {!isLoading && canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background border border-(--line-color) rounded-full shadow-lg p-2.5 opacity-0 group-hover/carousel:opacity-100 transition-opacity cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {!isLoading && canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background border border-(--line-color) rounded-full shadow-lg p-2.5 opacity-0 group-hover/carousel:opacity-100 transition-opacity cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>
        )}

        <div className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-linear-to-r from-(--secondary) to-transparent z-5" />

        <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-linear-to-l from-(--secondary) to-transparent z-5" />

        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide px-7 py-2 flex snap-x snap-mandatory scroll-smooth touch-pan-x"
        >
          <div className="flex gap-6">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <HomeFeatCardSkeleton key={i} />
                ))
              : courts.map((court) => (
                  <div key={court.id} data-card className="shrink-0">
                    <HomeFeatCards
                      id={court.id}
                      title={court.name}
                      img={court.img_url}
                      address={court.address}
                      price={court.price}
                    />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}