import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Student } from '@/types/database';

export async function GET() {
  try {
    const students = await query<Student[]>(`
      SELECT 
        students.*,
        groups.speciality_name as group_speciality_name,
        groups.speciality_code as group_speciality_code
      FROM students
      LEFT JOIN groups ON students.group_id = groups.id
      ORDER BY students.last_name
    `);

    // Transform the flat result into nested objects
    const formattedStudents = students.map(student => ({
      ...student,
      group: student.group_speciality_name ? {
        id: student.group_id,
        speciality_name: student.group_speciality_name,
        speciality_code: student.group_speciality_code,
      } : null,
    }));

    return NextResponse.json(formattedStudents);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await query(
      'INSERT INTO students (first_name, last_name, group_id) VALUES (?, ?, ?)',
      [body.first_name, body.last_name, body.group_id]
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}