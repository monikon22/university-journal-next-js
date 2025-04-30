import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Subject } from '@/types/database';

export async function GET() {
  try {
    const subjects = await query<Subject[]>('SELECT * FROM subjects ORDER BY name');
    return NextResponse.json(subjects);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await query(
      'INSERT INTO subjects (name) VALUES (?)',
      [body.name]
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create subject' }, { status: 500 });
  }
}