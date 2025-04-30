import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    await query(
      'UPDATE subjects SET name = ? WHERE id = ?',
      [body.name, params.id]
    );
    return NextResponse.json({ message: 'Subject updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update subject' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await query('DELETE FROM subjects WHERE id = ?', [params.id]);
    return NextResponse.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to delete subject' }, { status: 500 });
  }
}