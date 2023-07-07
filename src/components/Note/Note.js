import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";

import "./Note.css";
import { useDebouncedEffect } from "../../hooks";

const Note = ({ onSubmit }) => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const [savingInProgress, setSavingInProgress] = useState(false);

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
    if (hasChanged) {
      setSavingInProgress(true);
      await fetch(`/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...note,
          lastUpdatedAt: new Date(),
        }),
      });
      setSavingInProgress(false);
      setIsSaved(true);
      onSubmit();
    }
  };

  // When switching from one note to another, do not save
  useEffect(() => {
    setHasChanged(false);
  }, [id]);
  useDebouncedEffect(updateNote, [note], 1000);

  return (
    <form
      className="Form"
      onSubmit={(event) => {
        event.preventDefault();
        updateNote();
        setHasChanged(true);
      }}
    >
      <input
        className="Note-editable Note-title"
        type="text"
        value={note ? note.title : ""}
        onChange={(event) => {
          setNote({ ...note, title: event.target.value });
          setIsSaved(false);
          setHasChanged(true);
        }}
      />
      <textarea
        className="Note-editable Note-content"
        value={note ? note.content : ""}
        onChange={(event) => {
          setNote({ ...note, content: event.target.value });
          setIsSaved(false);
          setHasChanged(true);
        }}
      />
      <div className="Note-actions">
        <button className="Button">Enregistrer</button>
        {savingInProgress ? "Enregistrement…" : isSaved && "✓ Enregistré"}
      </div>
    </form>
  );
};

export default Note;
