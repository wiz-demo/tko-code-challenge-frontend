'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Prompt {
  id: string;
  name: string;
  prompt: string;
}

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const res = await axios.get('/api/prompts');
        setPrompts(res.data);
      } catch (error) {
        console.error('Failed to fetch prompts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#173AAA] to-[#01123F] text-white p-6">
      <nav className="z-20 flex justify-between items-center max-w-5xl mx-auto py-4 px-6 bg-black bg-opacity-30 rounded-xl mb-8 shadow-xl">
        <Link href="/" className="text-2xl font-bold hover:text-[#97BBFF]">🤖 Beyond AI</Link>
        <div className="space-x-4">
          <Link href="/" className="hover:underline hover:text-[#6197FF]">Home</Link>
          <Link href="/prompts" className="hover:underline hover:text-[#6197FF]">Prompt Library</Link>
        </div>
      </nav>

      <h1 className="text-4xl font-bold text-center mb-6">� AI Prompt Library</h1>
      {loading ? (
        <p className="text-center text-lg">Loading prompt templates...</p>
      ) : (
        <div className="max-w-2xl mx-auto space-y-4">
          {prompts.map((prompt) => (
            <div key={prompt.id} className="bg-black bg-opacity-30 p-4 rounded-xl shadow-xl">
              <h2 className="text-2xl font-semibold">💡 {prompt.name}</h2>
              <p className="text-[#97BBFF]">{prompt.prompt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
