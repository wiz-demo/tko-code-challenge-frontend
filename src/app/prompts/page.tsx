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
    <div className="min-h-screen bg-gradient-to-br from-[#01123F] via-[#0a1e5c] to-[#173AAA] text-white px-6 pt-4 pb-16">
      <nav className="z-20 relative flex justify-between items-center max-w-5xl mx-auto py-3 px-8 glass rounded-2xl mb-12 mt-2">
        <Link href="/" className="text-xl font-bold tracking-tight hover:text-[#97BBFF] transition-colors">Beyond AI</Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-[#97BBFF] transition-colors">Home</Link>
          <Link href="/prompts" className="text-sm font-medium hover:text-[#97BBFF] transition-colors">Prompt Library</Link>
        </div>
      </nav>

      <h1 className="text-4xl font-bold text-center mb-8 gradient-text tracking-tight">AI Prompt Library</h1>
      {loading ? (
        <p className="text-center text-lg text-white/60">Loading prompt templates...</p>
      ) : (
        <div className="max-w-2xl mx-auto space-y-5">
          {prompts.map((prompt) => (
            <div key={prompt.id} className="glass glow-hover rounded-2xl p-5">
              <h2 className="text-xl font-semibold mb-2">{prompt.name}</h2>
              <p className="text-[#97BBFF] text-sm leading-relaxed">{prompt.prompt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
