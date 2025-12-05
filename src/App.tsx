import { useState } from "react";
import "./App.css";

type Flat = {
  id: number;
  capacity: number;
  used: number;
  address: string;
};

const addressList: string[] = [
  "Musterstraße 12, 12345 Berlin",
  "Hauptweg 7, 98765 München",
  "Gartenallee 3, 54321 Hamburg",
];

// Start: nur die Beispielwohnungen, Rest kannst du selbst hinzufügen
const initialFlats: Flat[] = addressList.map((addr, i) => ({
  id: i + 1,
  capacity: 4,
  used: 0,
  address: addr,
}));

export default function App() {
  const [flats, setFlats] = useState<Flat[]>(initialFlats);

  const getStatusClass = (flat: Flat) => {
    const free = flat.capacity - flat.used;
    if (free <= 0) return "card status-red"; // voll
    if (free <= 2) return "card status-yellow"; // nur 1–2 frei
    return "card status-green"; // viel frei
  };

  const changeUsed = (id: number, delta: number) => {
    setFlats((prev) =>
      prev.map((flat) => {
        if (flat.id !== id) return flat;
        let newUsed = flat.used + delta;
        if (newUsed < 0) newUsed = 0;
        if (newUsed > flat.capacity) newUsed = flat.capacity;
        return { ...flat, used: newUsed };
      })
    );
  };

  const changeCapacity = (id: number, value: number) => {
    setFlats((prev) =>
      prev.map((flat) => {
        if (flat.id !== id) return flat;
        const newCap = value < 0 ? 0 : value;
        const newUsed = Math.min(flat.used, newCap);
        return { ...flat, capacity: newCap, used: newUsed };
      })
    );
  };

  const changeAddress = (id: number, value: string) => {
    setFlats((prev) =>
      prev.map((flat) =>
        flat.id === id ? { ...flat, address: value } : flat
      )
    );
  };

  const addFlat = () => {
    setFlats((prev) => {
      const nextId =
        prev.length > 0 ? Math.max(...prev.map((f) => f.id)) + 1 : 1;
      return [
        ...prev,
        {
          id: nextId,
          capacity: 4,
          used: 0,
          address: "",
        },
      ];
    });
  };

  const removeFlat = (id: number) => {
    setFlats((prev) => prev.filter((flat) => flat.id !== id));
  };

  return (
    <div className="app-container">
      <h1>Wohnungsübersicht</h1>

      <div className="toolbar">
        <button onClick={addFlat}>+ Wohnung hinzufügen</button>
        <span>{flats.length} Wohnungen</span>
      </div>

      <div className="legend">
        <span className="legend-box status-green" /> frei (mehr als 2 Plätze)
        <span className="legend-box status-yellow" /> nur 1–2 frei
        <span className="legend-box status-red" /> voll
      </div>

      <div className="grid">
        {flats.map((flat) => {
          const free = flat.capacity - flat.used;
          return (
            <div key={flat.id} className={getStatusClass(flat)}>
              <div className="card-header">
                <h2>{flat.address ? flat.address : `Whg. ${flat.id}`}</h2>
                <button
                  className="delete-button"
                  onClick={() => removeFlat(flat.id)}
                  title="Wohnung löschen"
                >
                  ✕
                </button>
              </div>

              <label className="field">
                Adresse:
                <input
                  type="text"
                  value={flat.address}
                  placeholder="Adresse eingeben"
                  onChange={(e) => changeAddress(flat.id, e.target.value)}
                />
              </label>

              <label className="field">
                Kapazität:
                <input
                  type="number"
                  value={flat.capacity}
                  onChange={(e) =>
                    changeCapacity(flat.id, Number(e.target.value))
                  }
                />
              </label>

              <p>Frei: {free < 0 ? 0 : free}</p>

              <div className="controls">
                <button onClick={() => changeUsed(flat.id, -1)}>-</button>
                <span>Belegt: {flat.used}</span>
                <button onClick={() => changeUsed(flat.id, 1)}>+</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
