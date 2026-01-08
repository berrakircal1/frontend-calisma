export async function geocodeAddress(address: string) {
    const url =
        "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=" +
        encodeURIComponent(address);

    const res = await fetch(url, {
        headers: {
            "Accept-Language": "tr",
        },
    });

    if (!res.ok) throw new Error("Geocode isteği başarısız");

    const data = (await res.json()) as any[];
    if (!data.length) return null;

    return {
        lat: Number(data[0].lat),
        lon: Number(data[0].lon),
    };
}
