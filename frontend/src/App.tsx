import { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Replace with your backend URL if different
const socket = io('http://localhost:3001');

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');

  useEffect(() => {
    socket.on('chat message', (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('chat message', input);
      setInput('');
    }
  };

  return (
    <div className="App">
      <h1>Chat App</h1>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
