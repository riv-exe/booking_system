import Image from "next/image";

export default function BookingModal({ title, description ,price }) {
    return (
        <div className="fixed bg-black/50 inset-0 flex justify-center items-center">
            <div className="bg-[var(--background)] overflow-hidden rounded-2xl w-full max-w-200 p-5">
                {/* <Image alt="court thumbnail" src="/courts/badminton-court-3.jpg" width={500} height={500} className="w-full h-35 object-cover"/> */}
                
            </div>
        </div>
    )
}