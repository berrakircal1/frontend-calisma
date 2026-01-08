import * as XLSX from "xlsx";

export function exportRouteToExcel(params: {
    startLabel: string;
    endLabel: string;
    distanceKm: number;
    timeMin: number;
    route: [number, number][]; // [[lat,lon], ...]
}) {
    const { startLabel, endLabel, distanceKm, timeMin, route } = params;

    // 1) Özet sayfası
    const summary = [
        { Alan: "Başlangıç", Deger: startLabel },
        { Alan: "Bitiş", Deger: endLabel },
        { Alan: "Mesafe (km)", Deger: Number(distanceKm.toFixed(2)) },
        { Alan: "Süre (dk)", Deger: Number(timeMin.toFixed(1)) },
        { Alan: "Nokta Sayısı", Deger: route.length },
    ];

    // 2) Rota noktaları sayfası
    const points = route.map(([lat, lon], i) => ({
        Sira: i + 1,
        Lat: lat,
        Lon: lon,
    }));

    const wb = XLSX.utils.book_new();

    const ws1 = XLSX.utils.json_to_sheet(summary);
    XLSX.utils.book_append_sheet(wb, ws1, "Ozet");

    const ws2 = XLSX.utils.json_to_sheet(points);
    XLSX.utils.book_append_sheet(wb, ws2, "RotaNoktalari");

    const safeName = `${startLabel}_to_${endLabel}`
        .replaceAll(" ", "_")
        .replaceAll("/", "_")
        .slice(0, 40);

    XLSX.writeFile(wb, `rota_${safeName}.xlsx`);
}
