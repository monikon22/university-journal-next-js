import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    await query(
      'UPDATE students SET first_name = ?, last_name = ?, group_id = ? WHERE id = ?',
      [body.first_name, body.last_name, body.group_id, params.id]
    );
    return NextResponse.json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await query('DELETE FROM students WHERE id = ?', [params.id]);
    return NextResponse.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}