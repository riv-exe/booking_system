"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import HomeFeatCards from "../cards/homeFeatCards";

export default function FeatCourts() {
    const [courts, setCourts] = useState([]);
    const scrollRef = useRef(null);

    useEffect(function () {
        fetchCourts();
    }, []);

    async function fetchCourts() {
        try {
            const res = await fetch("/api/courts");
            const data = await res.json();

            setCourts(data.courts || []);

            if(data.courts.length <= 6) {
                document.querySelectorAll(".scroll-btn").forEach(function(btn) {
                    btn.style.display = "none";
                });
                document.querySelector(".card-container").style.justifyContent = "center";
                
            }
        } catch (error) {
            console.error(error);
        }
    }

    function scrollLeft() {
        if (!scrollRef.current) return;

        scrollRef.current.scrollBy({
            left: -350,
            behavior: "smooth",
        });
    }

    function scrollRight() {
        if (!scrollRef.current) return;

        scrollRef.current.scrollBy({
            left: 350,
            behavior: "smooth",
        });
    }

    return (
        <div className="bg-[var(--secondary)] py-10">
            <div className="flex flex-col items-center ">
                <p className="text-4xl font-bold text-center">
                    No more waiting — just find a court and start playing.
                </p>
            </div>

            <div className="relative mt-10 ">
                {/* Left Arrow */}
                <button
                    onClick={scrollLeft}
                    className="scroll-btn absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-3 hover:bg-gray-300 text-black transition"
                >
                    <ChevronLeft size={24} />
                </button>

                {/* Scrollable Cards */}
                <div
                    ref={scrollRef}
                    className="overflow-x-auto scrollbar-hide p-7"
                >
                    <div className="card-container flex justify-left gap-8 w-full">
                        {courts.map(function (court) {
                            return (
                                <div
                                    key={court.id}
                                    className="shrink-0"
                                >
                                    <HomeFeatCards
                                        id={court.id}
                                        title={court.name}
                                        img={court.img_url}
                                        description={court.address}
                                        price={court.price}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Arrow */}
                <button
                    onClick={scrollRight}
                    className="scroll-btn absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-3 hover:bg-gray-300 text-black transition"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
}