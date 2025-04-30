import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Group } from '@/types/database';

export async function GET() {
  try {
    const groups = await query<Group[]>('SELECT * FROM `groups` ORDER BY speciality_name');
    return NextResponse.json(groups);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await query(
      'INSERT INTO `groups` (speciality_code, speciality_name) VALUES (?, ?)',
      [body.speciality_code, body.speciality_name]
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 });
  }
}