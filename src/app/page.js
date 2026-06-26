import Image from "next/image";
import Navbar from "./components/layout/navbar";
import HomeFeatCards from "./components/cards/homeFeatCards";
import Footer from "./components/layout/footer";
import BookingModal from "./components/modals/book";

export default function Home() {
  return (
    <div>
      <Navbar/>
      
      <div className="relative px-10 h-[calc(100vh-75px)] md:grid grid-cols-2 items-center">
        <svg
          className="absolute top-0 left-0 w-full -z-10"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#293731"
            d="M0,320L48,288C96,256,192,192,288,176C384,160,480,192,576,213.3C672,235,768,245,864,256C960,267,1056,277,1152,261.3C1248,245,1344,203,1392,181.3L1440,160L1440,0L0,0Z"
          />
        </svg>
      
        <div className="flex flex-col gap-5">
          <p className="text-6xl font-extrabold leading-17">Your next game is just a booking away. <span className="text-[var(--primary)]">Book</span> now.</p>
          <p className="text-xl">Find a court, book a slot, and start playing.</p>
        </div>
        <Image className="rounded-3xl justify-self-end hidden md:block" src="/displays/badminton-1.jpg" alt="badminton-picture" width={500} height={500}/>
      </div>

      <div className="bg-[var(--secondary)] py-10 flex flex-col items-center">
        <p className="text-4xl font-bold">No more waiting — just find a court and start playing.</p>
        <div className="my-15 flex gap-10 ">
          <HomeFeatCards id={1} title="Badminton Court 1" img="/courts/badminton-court-1.jpg" description="Badminton Court 1" price={350}/>
          <HomeFeatCards id={2} title="Badminton Court 2" img="/courts/badminton-court-2.jpg" description="Badminton Court 2" price={500}/>
          <HomeFeatCards id={3} title="Badminton Court 3" img="/courts/badminton-court-3.jpg" description="Badminton Court 3" price={400}/>
          <HomeFeatCards id={4} title="Badminton Court 4" img="/courts/badminton-court-4.jpg" description="Badminton Court 4" price={250}/>
        </div>
      </div>

      {/* <BookingModal/> */}

      <Footer/>
    </div>
  );
}
