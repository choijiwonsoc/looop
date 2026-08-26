const API_BASE_URL = "http://localhost:8080"

export async function getEvents(): Promise<void>{
    const response = await fetch(`${API_BASE_URL}/get-events`);

    if(!response.ok){
        throw new Error(`Failed to fetch events ${response.status}`);
    }
    return await response.json();
}

export async function createEvent(): Promise<void>{
    const response = await fetch(`${API_BASE_URL}/events`, {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        }, 
        body: JSON.stringify({
        })
    });

    if(!response.ok){
        throw new Error(`Failed to fetch events ${response.status}`);
    }
    return await response.json();
}