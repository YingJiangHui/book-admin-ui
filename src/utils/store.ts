export const storage = {
  get: (name: string) => {
    return localStorage.getItem(name);
  },
  set: (key: string, value: string) => {
    localStorage.setItem(key, value);
  },
  clearItem: (name: string) => {
    localStorage.removeItem(name);
  },
  clear: () => {
    localStorage.clear();
  },
};
