import React, { useEffect, useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";

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

  const createNote = async () => {
    await fetch(`/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Nouvelle note",
        content: "",
        lastUpdatedAt: new Date(),
      }),
    });
    fetchNotes();
  };

  const sortedNotes = notes
    ? notes.sort((noteA, noteB) => {
        return noteB.lastUpdatedAt.localeCompare(noteA.lastUpdatedAt);
      })
    : [];

  return (
    <>
      <aside className="Side">
        {isLoading ? (
          <div className="Loading">Chargement…</div>
        ) : (
          <>
            <button className="Button Button-create-note" onClick={createNote}>
              +
            </button>
            {sortedNotes.map((note) => (
              <NavLink
                key={note.id}
                to={`/notes/${note.id}`}
                className="Note-link"
              >
                {note.title}
                <div className="Note-link-lastUpdatedAt">
                  {new Date(note.lastUpdatedAt).toLocaleString()}
                </div>
              </NavLink>
            ))}
          </>
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
