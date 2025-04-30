import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Teacher } from '@/types/database';

export async function GET() {
  try {
    const teachers = await query<Teacher[]>('SELECT * FROM teachers ORDER BY last_name');
    return NextResponse.json(teachers);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch teachers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await query(
      'INSERT INTO teachers (first_name, last_name) VALUES (?, ?)',
      [body.first_name, body.last_name]
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create teacher' }, { status: 500 });
  }
}