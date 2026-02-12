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
    <div className="min-h-screen bg-gradient-to-b from-[#173AAA] to-[#01123F] text-white p-6 relative overflow-hidden">
      <nav className="z-20 flex justify-between items-center max-w-5xl mx-auto py-4 px-6 bg-black bg-opacity-30 rounded-xl mb-8 shadow-xl">
        <Link href="/" className="text-2xl font-bold hover:text-[#97BBFF]">🤖 Beyond AI</Link>
        <div className="space-x-4">
          <Link href="/" className="hover:underline hover:text-[#6197FF]">Home</Link>
          <Link href="/prompts" className="hover:underline hover:text-[#6197FF]">Prompt Library</Link>
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
            className="absolute bg-white rounded-full animate-pulse"
          ></div>
        ))}
      </div>

      <main className="flex flex-col items-center justify-center z-10">
        <h1 className="text-5xl font-extrabold mb-4 animate-pulse" style={{ textShadow: '2px 2px 8px #000000' }}>Beyond AI</h1>
        <p className="text-xl mb-6 text-center max-w-xl">
          Upskill your team with AI-powered prompt engineering. Master the art of effective communication with AI to unlock your organization's potential.
        </p>

        <div className="bg-black bg-opacity-30 rounded-2xl p-6 shadow-2xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-2">Request a Custom Template</h2>
          {/* Manual Input Form */}
          <form onSubmit={submitForm} className="flex flex-col space-y-4">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              type="text"
              placeholder="Your name"
              className="p-2 rounded-lg bg-gray-200 text-black"
            />
            <input
              value={form.prompt}
              onChange={(e) => setForm({ ...form, prompt: e.target.value })}
              type="text"
              placeholder="Describe your AI use case"
              className="p-2 rounded-lg bg-gray-200 text-black"
            />
            <button type="submit" className="bg-[#FF9BBE] hover:bg-[#C56BA4] text-white py-2 rounded-xl shadow-md">
              ✨ Submit Request
            </button>
          </form>
          {submitted && (
            <div className="mt-4 text-[#97BBFF]">
              ✨ Request submitted successfully! We'll be in touch soon. 📧
            </div>
          )}

          {/* YAML Upload Form */}
          <form onSubmit={handleYamlUpload} className="flex flex-col space-y-4 mt-6">
            <h3 className="text-xl font-bold">Upload Prompt Templates (YAML)</h3>
            <input
              type="file"
              accept=".yaml,.yml"
              onChange={(e) => setYamlFile(e.target.files?.[0] || null)}
              className="p-2 rounded-lg bg-gray-200 text-black"
            />
            <button type="submit" className="bg-[#6197FF] hover:bg-[#173AAA] text-white py-2 rounded-xl shadow-md">
              📁 Upload Templates
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
