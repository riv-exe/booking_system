
export async function getAdminInfo(){
    const res = await fetch(`/api/auth/me`);
    const data = await res.json();

    return data.user;
};


export async function addActivity(adminInfo, activityMessage){
    const activityData = {
        userId: adminInfo,
        activity: activityMessage 
    };

    try {
        await fetch("/api/activity", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(activityData),
        });
    } catch (error) {
        console.error("Error:", error.message);
    }
};

