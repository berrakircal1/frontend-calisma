export async function getRoute(points: [number, number][]) {
    const key = process.env.NEXT_PUBLIC_GRAPHHOPPER_KEY;
    if (!key) throw new Error("GraphHopper API key bulunamadı (.env.local)");

    const res = await fetch(`https://graphhopper.com/api/1/route?key=${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            points, // [[lon,lat], [lon,lat]]
            vehicle: "car",
            locale: "tr",
            points_encoded: false,
        }),
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error("Rota alınamadı: " + text);
    }

    return res.json();
}
