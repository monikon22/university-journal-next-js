import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    await query(
      'UPDATE grades SET student_id = ?, teacher_id = ?, subject_id = ?, grade = ?, note = ? WHERE id = ?',
      [body.student_id, body.teacher_id, body.subject_id, body.grade, body.note, params.id]
    );
    return NextResponse.json({ message: 'Grade updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update grade' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await query('DELETE FROM grades WHERE id = ?', [params.id]);
    return NextResponse.json({ message: 'Grade deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to delete grade' }, { status: 500 });
  }
}