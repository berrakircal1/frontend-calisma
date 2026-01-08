"use client";

import { Person } from "../types";

export default function PeopleTable({
                                        people,
                                        onDelete,
                                        onEdit,
                                        onGeocode,
                                    }: {
    people: Person[];
    onDelete: (id: string) => void;
    onEdit: (p: Person) => void;
    onGeocode: (id: string) => void;
}) {
    return (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
            <thead>
            <tr>
                <th style={th}>Ad</th>
                <th style={th}>Soyad</th>
                <th style={th}>GSM</th>
                <th style={th}>Adres</th>
                <th style={th}>Koordinat</th>
                <th style={th}>İşlem</th>
            </tr>
            </thead>

            <tbody>
            {(people ?? []).map((p) => (
                <tr key={p.id}>
                    <td style={td}>{p.name}</td>
                    <td style={td}>{p.surname}</td>
                    <td style={td}>{p.gsm}</td>
                    <td style={td}>{p.address}</td>

                    <td style={td}>
                        {p.lat && p.lon ? (
                            <>
                                {p.lat.toFixed(5)}, {p.lon.toFixed(5)}
                            </>
                        ) : (
                            "-"
                        )}
                    </td>

                    <td style={td}>
                        <button onClick={() => onEdit(p)}>Düzenle</button>

                        <button
                            onClick={() => onDelete(p.id)}
                            style={{ marginLeft: 8 }}
                        >
                            Sil
                        </button>

                        <button
                            onClick={() => onGeocode(p.id)}
                            style={{ marginLeft: 8 }}
                        >
                            Koordinat Bul
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

const th: React.CSSProperties = {
    borderBottom: "1px solid #ccc",
    textAlign: "left",
    padding: 8,
};

const td: React.CSSProperties = {
    borderBottom: "1px solid #eee",
    padding: 8,
};
