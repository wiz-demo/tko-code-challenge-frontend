'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import axios from 'axios';
import yaml from 'js-yaml';

interface FormState {
  name: string;
  prompt: string;
}

interface Star {
  id: number;
  x: number;
  y: number;
  delay: number;
  size: number;
}

export default function Home() {
  const [form, setForm] = useState<FormState>({ name: '', prompt: '' });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [stars, setStars] = useState<Star[]>([]);
  const [yamlFile, setYamlFile] = useState<File | null>(null);

  useEffect(() => {
    const starArray: Star[] = Array.from({ length: 30 }, (_, n) => ({
      id: n,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      size: Math.random() * 2 + 1,
    }));
    setStars(starArray);
  }, []);

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/prompts', form);
      setSubmitted(true);
      setForm({ name: '', prompt: '' });
    } catch (err) {
      alert("Oops! The magic scroll failed. Try again later.");
      console.error(err);
    }
  };

  const handleYamlUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!yamlFile) {
      alert("Please select a YAML file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const yamlContent = reader.result;
      try {
        // Validate YAML structure
        const parsedYaml = yaml.load(yamlContent as string);
        if (
          !parsedYaml ||
          typeof parsedYaml !== 'object' ||
          !Array.isArray((parsedYaml as any).prompts) ||
          !(parsedYaml as any).prompts.every(
            (prompt: any) => typeof prompt.name === 'string' && typeof prompt.prompt === 'string'
          )
        ) {
          alert("Invalid YAML structure. Ensure it contains a 'prompts' array with 'name' and 'prompt' fields.");
          return;
        }

        // Send to backend
        await axios.post('/api/import_prompts', { yaml_content: yamlContent });
        alert("YAML file uploaded successfully!");
      } catch (err) {
        alert("Failed to upload YAML file. Ensure the file is valid.");
        console.error(err);
      }
    };
    reader.readAsText(yamlFile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#01123F] via-[#0a1e5c] to-[#173AAA] text-white px-6 pt-4 pb-16 relative overflow-hidden">
      <nav className="z-20 relative flex justify-between items-center max-w-5xl mx-auto py-3 px-8 glass rounded-2xl mb-12 mt-2">
        <Link href="/" className="text-xl font-bold tracking-tight hover:text-[#97BBFF] transition-colors">Neuralworks</Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-[#97BBFF] transition-colors">Home</Link>
          <Link href="/prompts" className="text-sm font-medium hover:text-[#97BBFF] transition-colors">Community</Link>
        </div>
      </nav>

      <div className="absolute inset-0 z-0 pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              animationDelay: `${star.delay}s`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
            className="absolute bg-white rounded-full animate-twinkle opacity-20"
          ></div>
        ))}
      </div>

      <main className="relative flex flex-col items-center justify-center z-10 py-8">
        <h1 className="text-6xl font-extrabold mb-6 gradient-text tracking-tight">Neuralworks</h1>
        <p className="text-lg mb-10 text-center max-w-2xl text-white/70 leading-relaxed">
          Your AI-powered tutor for upskilling in tech. Master prompt engineering, explore AI capabilities, and level up your skills with hands-on learning.
        </p>

        <div className="glass glow-hover rounded-2xl p-8 w-full max-w-lg">
          <h2 className="text-xl font-semibold mb-5 text-white/90">What do you want to learn?</h2>
          {/* Learning Request Form */}
          <form onSubmit={submitForm} className="flex flex-col space-y-4">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              type="text"
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/40 transition-colors focus:border-[#6197FF]"
            />
            <input
              value={form.prompt}
              onChange={(e) => setForm({ ...form, prompt: e.target.value })}
              type="text"
              placeholder="What skill do you want to master?"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/40 transition-colors focus:border-[#6197FF]"
            />
            <button type="submit" className="w-full bg-gradient-to-r from-[#FF9BBE] to-[#C56BA4] hover:from-[#C56BA4] hover:to-[#FF9BBE] text-white py-3 rounded-xl font-semibold btn-transition shadow-lg shadow-pink-500/20">
              Get Started
            </button>
          </form>
          {submitted && (
            <div className="mt-4 text-[#97BBFF] text-sm">
              You're in! We'll build your learning path and reach out soon.
            </div>
          )}

          {/* Curriculum Import Form */}
          <form onSubmit={handleYamlUpload} className="flex flex-col space-y-4 mt-6 pt-6 border-t border-white/10">
            <h3 className="text-lg font-semibold text-white/90">Import a Curriculum</h3>
            <input
              type="file"
              accept=".yaml,.yml"
              onChange={(e) => setYamlFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#0254EC]/30 file:text-white/80 file:text-sm file:font-medium"
            />
            <button type="submit" className="w-full bg-gradient-to-r from-[#0254EC] to-[#173AAA] hover:from-[#173AAA] hover:to-[#0254EC] text-white py-3 rounded-xl font-semibold btn-transition shadow-lg shadow-blue-500/20">
              Import Curriculum
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
