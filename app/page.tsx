"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

import { Person } from "./types";
import { loadPeople, savePeople } from "./lib/storage";
import { geocodeAddress } from "./lib/geocode";
import { getRoute } from "./lib/route";
import { exportRouteToExcel } from "./lib/exportRouteExcel";

import PeopleTable from "./components/PeopleTable";
import PersonForm from "./components/PersonForm";

// Leaflet SSR hatası olmaması için:
const MapView = dynamic(() => import("./components/MapView"), { ssr: false });

export default function Home() {
    const [people, setPeople] = useState<Person[]>([]);
    const [editing, setEditing] = useState<Person | null>(null);
    const [showForm, setShowForm] = useState(false);

    //  Rota state'leri
    const [startId, setStartId] = useState<string>("");
    const [endId, setEndId] = useState<string>("");
    const [route, setRoute] = useState<[number, number][]>([]); // [lat,lon][]
    const [routeDistanceKm, setRouteDistanceKm] = useState<number>(0);
    const [routeTimeMin, setRouteTimeMin] = useState<number>(0);

    useEffect(() => {
        setPeople(loadPeople());
    }, []);

    const nextId = useMemo(() => {
        const nums = people.map((p) => Number(p.id)).filter((n) => Number.isFinite(n));
        const max = nums.length ? Math.max(...nums) : 0;
        return String(max + 1);
    }, [people]);

    const peopleWithCoords = useMemo(() => people.filter((p) => p.lat && p.lon), [people]);

    const handleDelete = (id: string) => {
        const updated = people.filter((p) => p.id !== id);
        setPeople(updated);
        savePeople(updated);
    };

    const handleEdit = (p: Person) => {
        setEditing(p);
        setShowForm(true);
    };

    const handleNew = () => {
        setEditing(null);
        setShowForm(true);
    };

    const handleSave = (p: Person) => {
        let updated: Person[];

        if (editing) {
            updated = people.map((x) => (x.id === p.id ? { ...p } : x));
        } else {
            updated = [{ ...p, id: nextId }, ...people];
        }

        setPeople(updated);
        savePeople(updated);
        setShowForm(false);
        setEditing(null);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditing(null);
    };

    //  Adres -> koordinat
    const handleGeocode = async (id: string) => {
        const target = people.find((p) => p.id === id);
        if (!target) return;

        try {
            const result = await geocodeAddress(target.address);
            if (!result) {
                alert("Adres bulunamadı.");
                return;
            }

            const updated = people.map((p) => (p.id === id ? { ...p, lat: result.lat, lon: result.lon } : p));

            setPeople(updated);
            savePeople(updated);
        } catch {
            alert("Geocoding sırasında hata oluştu.");
        }
    };

    //  Rota oluştur
    const handleRoute = async () => {
        const start = people.find((p) => p.id === startId);
        const end = people.find((p) => p.id === endId);

        if (!start || !end) {
            alert("Başlangıç ve bitiş seçmelisin.");
            return;
        }
        if (!start.lat || !start.lon || !end.lat || !end.lon) {
            alert("Seçilen kayıtlarda koordinat yok. Önce 'Koordinat Bul' yap.");
            return;
        }

        try {
            const json = await getRoute([
                [start.lon, start.lat], // [lon,lat]
                [end.lon, end.lat],
            ]);

            const coords: [number, number][] = json.paths[0].points.coordinates.map((c: [number, number]) => [
                c[1],
                c[0],
            ]); // -> [lat,lon]

            const distanceKm = (json.paths[0].distance ?? 0) / 1000; // metre -> km
            const timeMin = (json.paths[0].time ?? 0) / 60000; // ms -> dk

            setRoute(coords);
            setRouteDistanceKm(distanceKm);
            setRouteTimeMin(timeMin);
        } catch (e: any) {
            alert(e?.message || "Rota alınırken hata oldu.");
        }
    };

    const handleRouteExcel = () => {
        const start = people.find((p) => p.id === startId);
        const end = people.find((p) => p.id === endId);

        if (!start || !end || route.length < 2) {
            alert("Önce rota oluşturmalısın.");
            return;
        }

        exportRouteToExcel({
            startLabel: `${start.name} ${start.surname}`,
            endLabel: `${end.name} ${end.surname}`,
            distanceKm: routeDistanceKm,
            timeMin: routeTimeMin,
            route,
        });
    };

    return (
        <main style={{ maxWidth: 1100, margin: "40px auto", padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: "bold", margin: 0 }}>Frontend Çalışması</h1>
                    <p style={{ marginTop: 8 }}>Next.js + localStorage + Harita + Rota</p>
                </div>

                <button onClick={handleNew} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #333" }}>
                    + Yeni Kayıt
                </button>
            </div>

            <hr style={{ margin: "20px 0" }} />

            <PeopleTable people={people} onDelete={handleDelete} onEdit={handleEdit} onGeocode={handleGeocode} />

            {/* ✅ ROTA UI */}
            <div style={{ marginTop: 16, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <b>Rota:</b>

                <select value={startId} onChange={(e) => setStartId(e.target.value)}>
                    <option value="">Başlangıç seç</option>
                    {peopleWithCoords.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name} {p.surname}
                        </option>
                    ))}
                </select>

                <select value={endId} onChange={(e) => setEndId(e.target.value)}>
                    <option value="">Bitiş seç</option>
                    {peopleWithCoords.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name} {p.surname}
                        </option>
                    ))}
                </select>

                <button onClick={handleRoute} style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #333" }}>
                    Rota Oluştur
                </button>

                <button
                    onClick={handleRouteExcel}
                    style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #333" }}
                >
                    Rotayı Excel İndir
                </button>

                <button
                    onClick={() => {
                        setRoute([]);
                        setRouteDistanceKm(0);
                        setRouteTimeMin(0);
                    }}
                    style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #ccc" }}
                >
                    Rotayı Temizle
                </button>

                {route.length > 1 && (
                    <span style={{ marginLeft: 8 }}>
            <b>Mesafe:</b> {routeDistanceKm.toFixed(2)} km &nbsp; | &nbsp;
                        <b>Süre:</b> {routeTimeMin.toFixed(1)} dk
          </span>
                )}
            </div>

            {showForm && <PersonForm initial={editing} onSave={handleSave} onCancel={handleCancel} />}

            <MapView
                points={people
                    .filter((p) => p.lat && p.lon)
                    .map((p) => ({
                        id: p.id,
                        title: `${p.name} ${p.surname}`,
                        lat: p.lat as number,
                        lon: p.lon as number,
                    }))}
                route={route}
            />
        </main>
    );
}
