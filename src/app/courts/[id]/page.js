import Navbar from "@/app/components/layout/navbar";
import DateButtons from "@/app/components/ui/dateButtons";

export default async function Courts({ params }) {
    const {id} = await params;

    return (
        <div>
            <Navbar/>
            <div className="px-5 py-10">
                {/* <div className="bg-[var(--secondary)] p-5 rounded-2xl border border-gray-700">
                    <p className="text-2xl font-bold">Badminton Court {id}</p>
                </div> */}
                <div className="flex items-start gap-5">
                    <div className="w-[65vw] bg-[var(--secondary)] p-5 rounded-2xl border border-gray-700 flex flex-col gap-5">
                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold">Court Availability</p>
                            <div className="flex gap-2">
                                <div className="bg-[var(--primary)] px-2 py-1 text-xs rounded-full">Available</div>
                                <div className="bg-red-900 px-2 py-1 text-xs rounded-full">Occupied</div>
                                <div className="bg-yellow-700 px-2 py-1 text-xs rounded-full">Selected</div>
                            </div>
                        </div>
                        <div className="bg-[var(--background)] border border-gray-700 py-3 px-5 my-3 rounded-2xl cursor-pointer">
                            <p>Badminton Court {id}</p>
                        </div>
                        <div className="grid grid-cols-4 grid-rows-3 gap-5">
                            <DateButtons time={6} isMorning={true}/>
                            <DateButtons time={7} isMorning={true}/>
                            <DateButtons time={8} isMorning={true}/>
                            <DateButtons time={9} isMorning={true}/>
                            <DateButtons time={10} isMorning={true}/>
                            <DateButtons time={11} isMorning={true}/>
                            <DateButtons time={12} isMorning={true}/>
                            <DateButtons time={1} isMorning={false}/>
                            <DateButtons time={2} isMorning={false}/>
                            <DateButtons time={3} isMorning={false}/>
                            <DateButtons time={4} isMorning={false}/>
                            <DateButtons time={5} isMorning={false}/>
                        </div>
                        <div className="bg-[var(--background)] border border-gray-700 py-2 px-5 rounded-2xl cursor-pointer flex justify-between">
                            <p>&lt;</p>
                            <p>June 26, 2026</p>
                            <p>&gt;</p>
                        </div>
                    </div>
                    
                    <div className="w-[35vw] bg-[var(--secondary)] p-5 rounded-2xl border border-gray-700 flex flex-col gap-5">
                        <p className="text-2xl font-bold">Book this Court</p>
                        <div className="p-5 bg-[var(--background)] rounded-2xl flex flex-col gap-2">
                            <p>Standard Rate</p>
                            <p className="text-xl font-semibold">₱300 /hour</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="font-semibold">Booking Date</p>
                            <input type="date"className="bg-[var(--background)] border border-gray-700 py-2 px-5 rounded-2xl cursor-pointer"/>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="font-semibold">Pick a time slot</p>
                            <div className="flex gap-5">
                                <div className="bg-[var(--background)] border border-gray-700 py-2 px-5 rounded-2xl w-full cursor-pointer">
                                    <label>Start Time</label>
                                    <input type="time" />
                                </div>
                                <div className="bg-[var(--background)] border border-gray-700 py-2 px-5 rounded-2xl w-full cursor-pointer">
                                    <label>End Time</label>
                                    <input type="time" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-[var(--primary)] p-3 rounded-2xl flex justify-center">
                            <button>Book Now</button>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    )
}