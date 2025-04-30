import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Grade } from '@/types/database';

export async function GET() {
  try {
    const grades = await query<Grade[]>(`
      SELECT 
        grades.*,
        students.first_name as student_first_name,
        students.last_name as student_last_name,
        teachers.first_name as teacher_first_name,
        teachers.last_name as teacher_last_name,
        subjects.name as subject_name
      FROM grades
      LEFT JOIN students ON grades.student_id = students.id
      LEFT JOIN teachers ON grades.teacher_id = teachers.id
      LEFT JOIN subjects ON grades.subject_id = subjects.id
      ORDER BY grades.created_at DESC
    `);

    const formattedGrades = grades.map(grade => ({
      ...grade,
      student: {
        id: grade.student_id,
        first_name: grade.student_first_name,
        last_name: grade.student_last_name,
      },
      teacher: {
        id: grade.teacher_id,
        first_name: grade.teacher_first_name,
        last_name: grade.teacher_last_name,
      },
      subject: {
        id: grade.subject_id,
        name: grade.subject_name,
      },
    }));

    return NextResponse.json(formattedGrades);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch grades' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await query(
      'INSERT INTO grades (student_id, teacher_id, subject_id, grade, note) VALUES (?, ?, ?, ?, ?)',
      [body.student_id, body.teacher_id, body.subject_id, body.grade, body.note]
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create grade' }, { status: 500 });
  }
}