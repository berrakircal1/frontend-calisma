"use client";

import { useEffect, useState } from "react";
import { Person } from "../types";

type Props = {
    initial?: Person | null;
    onSave: (p: Person) => void;
    onCancel: () => void;
};

export default function PersonForm({ initial, onSave, onCancel }: Props) {
    const [form, setForm] = useState<Person>({
        id: "",
        name: "",
        surname: "",
        gsm: "",
        address: "",
    });

    useEffect(() => {
        if (initial) setForm(initial);
        else
            setForm({
                id: "",
                name: "",
                surname: "",
                gsm: "",
                address: "",
            });
    }, [initial]);

    const isEdit = !!initial;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const trimmed: Person = {
            ...form,
            name: form.name.trim(),
            surname: form.surname.trim(),
            gsm: form.gsm.trim(),
            address: form.address.trim(),
        };

        if (!trimmed.name || !trimmed.surname || !trimmed.gsm || !trimmed.address) {
            alert("Lütfen tüm alanları doldurun.");
            return;
        }

        onSave(trimmed);
    };

    return (
        <form onSubmit={submit} style={box}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <h2 style={{ margin: 0 }}>{isEdit ? "Kayıt Düzenle" : "Yeni Kayıt Ekle"}</h2>
                <button type="button" onClick={onCancel} style={btn}>
                    İptal
                </button>
            </div>

            <div style={grid}>
                <label style={label}>
                    Ad
                    <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        style={input}
                    />
                </label>

                <label style={label}>
                    Soyad
                    <input
                        value={form.surname}
                        onChange={(e) => setForm({ ...form, surname: e.target.value })}
                        style={input}
                    />
                </label>

                <label style={label}>
                    GSM
                    <input
                        value={form.gsm}
                        onChange={(e) => setForm({ ...form, gsm: e.target.value })}
                        style={input}
                        placeholder="05xxxxxxxxx"
                    />
                </label>

                <label style={label}>
                    Adres
                    <input
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        style={input}
                        placeholder="Baker Street"
                    />
                </label>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button type="submit" style={{ ...btn, border: "1px solid #333" }}>
                    {isEdit ? "Güncelle" : "Kaydet"}
                </button>
            </div>
        </form>
    );
}

const box: React.CSSProperties = {
    border: "1px solid #ddd",
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
};

const grid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
    marginTop: 12,
};

const label: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 6, fontSize: 14 };

const input: React.CSSProperties = {
    padding: 10,
    borderRadius: 10,
    border: "1px solid #ccc",
};

const btn: React.CSSProperties = {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid #ccc",
    background: "white",
};
