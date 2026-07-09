"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HomeFeatCards({ id, title, img, description, price }) {
    const router = useRouter();


    return (
        <button onClick={() => router.push(`/courts/${id}`)} className="bg-[var(--background)] border border-gray-800 rounded-2xl w-60 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:border-[var(--primary)] hover:shadow-2xl ">
            <Image alt="court thumbnail" src={img} width={500} height={500} className="w-full h-35 object-cover"/>
            <div className="p-4">
                <p className="text-xl font-bold">{title}</p>
                <p className="text-gray-500">{description}</p>
                <p className="mt-10 text-xl text-gray-400 font-bold"><span className="text-[var(--primary)]">₱{price}</span> /hour</p>
            </div>
        </button>
    )
}