import React, { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";

import "./App.css";
import Note from "./components/Note/Note";

function App() {
  const [notes, setNotes] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotes = async () => {
    const response = await fetch("/notes");
    const result = await response.json();
    setNotes(result);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <>
      <aside className="Side">
        {isLoading ? (
          <div className="Loading">Chargement…</div>
        ) : (
          notes &&
          notes.map((note) => (
            <Link key={note.id} to={`/notes/${note.id}`} className="Note-link">
              {note.title}
            </Link>
          ))
        )}
      </aside>
      <main className="Main">
        <Routes>
          <Route
            path="/"
            element={<div>Sélectionner une note pour l'éditer</div>}
          />
          <Route path="/notes/:id" element={<Note onSubmit={fetchNotes} />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
