const STORAGE_KEY = "my_english_note_itemList";

export function saveItems(items) {
  localStorage.setItem(STORAGE_KEY,JSON.stringify(items));
}

export function loadItems() {
  const savedItems = localStorage.getItem(STORAGE_KEY);
  
  if (savedItems === null) {
    return {
        word: [],
        phrasalVerb: [],
        sentence: [],
    };
  }
  return JSON.parse(savedItems);
}