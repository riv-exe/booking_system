import Navbar from "@/app/components/layout/navbar";
import Court from "@/app/pages/court";

export default async function Courts({ params }) {
    const {id} = await params;
    
    return (
        <div>
            <Navbar/>
            <Court id={id}/>
        </div>
    )
}