import React, { useState } from 'react';
import { askQuestion } from './api';

function ChatView({ token }) {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = async () => {
    const result = await askQuestion(query, token);
    setAnswer(result.answer);
  };

  return (
    <div className="p-4">
      <h2>Chat</h2>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Ställ en fråga..." className="border p-2 w-full" />
      <button onClick={handleAsk} className="bg-green-500 text-white p-2 m-2">Fråga</button>
      <div className="bg-gray-100 p-4 mt-2">{answer}</div>
    </div>
  );
}

export default ChatView;
