"use client"

import { useEffect, useState } from "react";
import HomeFeatCards from "../cards/homeFeatCards";

export default function FeatCourts() {
    const [courts, setCourts] = useState([]);

    useEffect(() => {
        async function loadUsers() {
            const res = await fetch(`/api/courts`);
            const data = await res.json();
            console.log(data);
            setCourts(data.courts || []);
        }

        loadUsers();
    }, []);

    return (
        <div className="bg-(--secondary) py-10 flex flex-col items-center">
            <p className="text-4xl font-bold">No more waiting — just find a court and start playing.</p>
            <div className="my-15 flex gap-10 ">
                {
                    courts.map((court) => (
                        <HomeFeatCards
                        key={court.id}
                        id={court.id}
                        title={court.name}
                        img={court.img_url}
                        description={court.address}
                        price={court.price}/>
                    ))
                }
            </div>
        </div>
    )
}   