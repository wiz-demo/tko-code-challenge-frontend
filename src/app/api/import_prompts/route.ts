import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
    try {
        const { yaml_content } = await req.json();

        const res = await fetch(`${API_BASE_URL}/api/import_prompts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ yaml_content }),
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error('Error uploading YAML:', error);
        return NextResponse.json({ error: 'Failed to upload YAML file' }, { status: 500 });
    }
}
