import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    await query(
      'UPDATE `groups` SET speciality_code = ?, speciality_name = ? WHERE id = ?',
      [body.speciality_code, body.speciality_name, params.id]
    );
    return NextResponse.json({ message: 'Group updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update group' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await query('DELETE FROM `groups` WHERE id = ?', [params.id]);
    return NextResponse.json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to delete group' }, { status: 500 });
  }
}