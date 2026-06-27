import Navbar from "@/app/components/layout/navbar";
import DateButtons from "@/app/components/ui/dateButtons";
import Court from "@/app/pages/court";

export default async function Courts({ params }) {
    const {id} = await params;
    console.log(id);
    return (
        <div>
            <Navbar/>
            <Court id={id}/>
        </div>
    )
}