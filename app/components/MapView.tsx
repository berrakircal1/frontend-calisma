"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";

type Point = {
    id: string;
    title: string;
    lat: number;
    lon: number;
};

type Props = {
    points: Point[];
    route?: [number, number][]; // [[lat, lon], ...]
};

// Global prototype değiştirmek yerine icon’u Marker’a veriyoruz
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

export default function MapView({ points, route }: Props) {
    const [mounted, setMounted] = useState(false);

    // DOM hazır olmadan Leaflet başlatma (appendChild hatasını çözer)
    useEffect(() => {
        setMounted(true);
    }, []);

    const center: [number, number] = points.length
        ? [points[0].lat, points[0].lon]
        : [39.92077, 32.85411]; // Ankara

    return (
        <div
            style={{
                height: 420,
                width: "100%",
                borderRadius: 12,
                overflow: "hidden",
                marginTop: 16,
                border: "1px solid #eee",
            }}
        >
            {!mounted ? null : (
                <MapContainer
                    key="leaflet-map"
                    center={center}
                    zoom={6}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        attribution="&copy; OpenStreetMap"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/*  Rota çizgisi */}
                    {route && route.length > 1 && <Polyline positions={route} />}

                    {/*  Marker'lar */}
                    {points.map((p) => (
                        <Marker key={p.id} position={[p.lat, p.lon]} icon={DefaultIcon}>
                            <Popup>
                                <b>{p.title}</b>
                                <br />
                                {p.lat.toFixed(5)}, {p.lon.toFixed(5)}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            )}
        </div>
    );
}
