import React, { useState } from 'react';
import UploadView from './UploadView';
import ChatView from './ChatView';
import GraphView from './GraphView';
import { login } from './api';

function App() {
  const [token, setToken] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    const result = await login(username, password);
    setToken(result.access_token);
  };

  if (!token) {
    return (
      <form onSubmit={handleLogin} className="flex flex-col items-center mt-10">
        <input name="username" placeholder="Username" className="border m-2 p-2" />
        <input name="password" type="password" placeholder="Password" className="border m-2 p-2" />
        <button type="submit" className="bg-blue-500 text-white p-2">Login</button>
      </form>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div>
        <UploadView token={token} />
        <ChatView token={token} />
      </div>
      <div>
        <GraphView />
      </div>
    </div>
  );
}

export default App;
