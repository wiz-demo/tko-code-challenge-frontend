'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await axios.post('/api/chat', {
        message: userMessage,
        sessionId: sessionId || undefined,
      });

      const { sessionId: newSessionId, answer } = response.data;
      
      if (!sessionId) {
        setSessionId(newSessionId);
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: answer }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Oops! The magical assistant is unavailable. Try again later.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-[#0254EC] to-[#173AAA] hover:from-[#173AAA] hover:to-[#0254EC] text-white rounded-full p-4 shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center gap-2 animate-bounce"
          aria-label="Open chat"
        >
          <span className="text-2xl">💬</span>
          <span className="font-semibold">Ask Beyond AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-gradient-to-b from-[#01123F] to-[#0a1e5c] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/10">
          {/* Header */}
          <div className="bg-black/30 backdrop-blur-sm p-4 flex justify-between items-center border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔮</span>
              <h3 className="text-white font-bold text-lg">Beyond AI</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white text-2xl transition-colors"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-[#97BBFF] text-sm mt-8">
                <p className="mb-2">Welcome to Beyond AI</p>
                <p className="text-white/40">Ask me anything — I'm here to help you learn.</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-[#0254EC] text-white rounded-br-none'
                      : 'bg-white/10 text-[#97BBFF] rounded-bl-none'
                  } shadow-lg`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-[#97BBFF] p-3 rounded-2xl rounded-bl-none shadow-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-[#6197FF] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#6197FF] rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-[#6197FF] rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-black/30 backdrop-blur-sm border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything..."
                disabled={loading}
                className="flex-1 bg-white/5 border border-white/15 text-white placeholder-white/40 rounded-xl px-4 py-2 focus:outline-none focus:border-[#6197FF] disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-[#0254EC] to-[#173AAA] hover:from-[#173AAA] hover:to-[#0254EC] text-white px-6 py-2 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
