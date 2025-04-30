import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    await query(
      'UPDATE teachers SET first_name = ?, last_name = ? WHERE id = ?',
      [body.first_name, body.last_name, params.id]
    );
    return NextResponse.json({ message: 'Teacher updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update teacher' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await query('DELETE FROM teachers WHERE id = ?', [params.id]);
    return NextResponse.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to delete teacher' }, { status: 500 });
  }
}