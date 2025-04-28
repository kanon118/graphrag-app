import { useState } from "react";
import axios from "axios";

function Chat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "http://localhost:8000/chat",
        { query: question },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages((prev) => [
        ...prev,
        { role: "user", content: question },
        { role: "assistant", content: res.data.answer },
      ]);
      setQuestion("");
    } catch (error) {
      console.error("Chat error:", error);
      alert("Fel vid chatt!");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded ${
              msg.role === "user" ? "bg-blue-100 self-end" : "bg-gray-200 self-start"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleAsk} className="flex space-x-2">
        <input
          type="text"
          placeholder="Ställ en fråga..."
          className="flex-1 border p-2 rounded"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Skicka
        </button>
      </form>
    </div>
  );
}

export default Chat;
