"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomeFeatCards({ id, title, img, address, price }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/courts/${id}`)}
      className="group/card bg-background border border-(--line-color) rounded-2xl w-64 overflow-hidden cursor-pointer text-left transition-all duration-300 hover:-translate-y-1 hover:border-(--primary)/50 hover:shadow-xl"
    >
      <div className="overflow-hidden">
        <Image
          alt="court thumbnail"
          src={img}
          width={500}
          height={500}
          className="w-full h-36 object-cover transition-transform duration-500 group-hover/card:scale-110"
        />
      </div>

      <div className="p-4 flex flex-col gap-1">
        <p className="font-display text-lg font-bold leading-tight">
          {title}
        </p>

        <p className="text-sm text-(--foreground)/55 truncate">
          {address}
        </p>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm">
            <span className="font-display font-bold text-(--primary)">
              ₱{price}
            </span>
            <span className="text-(--foreground)/50"> /hour</span>
          </p>

          <ArrowRight
            size={16}
            className="text-(--foreground)/40 transition-transform group-hover/card:translate-x-1 group-hover/card:text-(--primary)"
          />
        </div>
      </div>
    </button>
  );
}