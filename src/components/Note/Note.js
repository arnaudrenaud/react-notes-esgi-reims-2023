import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";

import "./Note.css";

const Note = ({ onSubmit }) => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const fetchNote = useCallback(async () => {
    const response = await fetch(`/notes/${id}`);
    const result = await response.json();
    setNote(result);
  }, [id]);

  useEffect(() => {
    setIsSaved(false);
    fetchNote();
  }, [id, fetchNote]);

  const updateNote = async () => {
    await fetch(`/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    });
    onSubmit();
    setIsSaved(true);
  };

  return (
    <form
      className="Form"
      onSubmit={(event) => {
        event.preventDefault();
        updateNote();
      }}
    >
      <input
        className="Note-editable Note-title"
        type="text"
        value={note ? note.title : ""}
        onChange={(event) => {
          setNote({ ...note, title: event.target.value });
          setIsSaved(false);
        }}
      />
      <textarea
        className="Note-editable Note-content"
        value={note ? note.content : ""}
        onChange={(event) => {
          setNote({ ...note, content: event.target.value });
          setIsSaved(false);
        }}
      />
      <div className="Note-actions">
        <button className="Button">Enregistrer</button>
        {isSaved && "✓ Enregistré"}
      </div>
    </form>
  );
};

export default Note;
