export type SavedItem = {
  id: string;
  title: string;
  image: string;
  creator: string;
  price: string;
  brand?: string;
  description?: string;
};

const STORAGE_KEY = "saved_items";
const SAVED_CHANGED_EVENT = "saved:changed";

function readSavedFromStorage(): SavedItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function writeSavedToStorage(items: SavedItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(SAVED_CHANGED_EVENT));
}

export function getSaved(): SavedItem[] {
  return readSavedFromStorage();
}

export function isItemSaved(id: string): boolean {
  return readSavedFromStorage().some((it) => it.id === id);
}

export function addSaved(item: SavedItem): void {
  const existing = readSavedFromStorage();
  if (existing.some((it) => it.id === item.id)) return;
  writeSavedToStorage([item, ...existing]);
}

export function removeSaved(id: string): void {
  const existing = readSavedFromStorage();
  const next = existing.filter((it) => it.id !== id);
  writeSavedToStorage(next);
}

export function onSavedChange(handler: () => void): () => void {
  const fn = () => handler();
  window.addEventListener(SAVED_CHANGED_EVENT, fn);
  return () => window.removeEventListener(SAVED_CHANGED_EVENT, fn);
}


