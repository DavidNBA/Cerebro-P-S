"use client";

import React, { useState } from 'react';
import { QuickNote } from '@/models/types';
import { saveQuickNote } from '@/lib/localStorage';

const QuickCapture: React.FC = () => {
  const [noteText, setNoteText] = useState('');

  const handleSaveNote = () => {
    if (noteText.trim() === '') {
      alert('Note content cannot be empty.'); // Simple validation
      return;
    }

    const newNote: QuickNote = {
      id: Date.now().toString(),
      content: noteText,
      createdAt: new Date().toISOString(),
    };

    saveQuickNote(newNote);
    setNoteText(''); // Clear textarea

    // Simple feedback - in a real app, this might be a toast notification
    console.log('Quick note saved:', newNote);
    alert('Quick note saved!');
  };

  return (
    <div className="p-4 border-t border-gray-700 mt-auto">
      <h3 className="text-lg font-semibold text-gray-200 mb-2">Captura Rápida</h3>
      <textarea
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        placeholder="Escribe una nota rápida..."
        rows={3}
        className="w-full p-2 mb-2 text-sm text-gray-900 bg-gray-100 rounded-md border border-gray-300 dark:text-gray-100 dark:bg-gray-700 dark:border-gray-500 dark:placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
      />
      <button
        onClick={handleSaveNote}
        className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Guardar Nota
      </button>
    </div>
  );
};

export default QuickCapture;
