import { Person } from "../types";
import { SEED_DATA } from "../data/seed";

const STORAGE_KEY = "frontend_people";

export function loadPeople(): Person[] {
    if (typeof window === "undefined") return SEED_DATA;

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
        return SEED_DATA;
    }
    return JSON.parse(raw);
}

export function savePeople(data: Person[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
