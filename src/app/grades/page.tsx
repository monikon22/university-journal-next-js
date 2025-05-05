'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { Modal } from '@/components/Modal';
import { Navbar } from '@/components/Navbar';
import type { Grade, Student, Teacher, Subject } from '@/types/database';

const gradeSchema = z.object({
  student_id: z.string().min(1, 'Будь ласка, оберіть студента'),
  teacher_id: z.string().min(1, 'Будь ласка, оберіть викладача'),
  subject_id: z.string().min(1, 'Будь ласка, оберіть предмет'),
  grade: z.string()
    .regex(/^\d+$/, 'Оцінка повинна бути числом')
    .refine(val => {
      const num = parseInt(val);
      return num >= 0 && num <= 100;
    }, 'Оцінка повинна бути в межах від 0 до 100')
    .transform(val => parseInt(val)),
  note: z.string().optional(),
});

type GradeFormData = z.infer<typeof gradeSchema>;

export default function Grades() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GradeFormData>({
    resolver: zodResolver(gradeSchema),
  });

  useEffect(() => {
    fetchGrades();
    fetchStudents();
    fetchTeachers();
    fetchSubjects();
  }, []);

  async function fetchGrades() {
    try {
      const response = await fetch('/api/grades');
      if (!response.ok) throw new Error('Failed to fetch grades');
      const data = await response.json();
      setGrades(data);
    } catch (error) {
      console.error('Помилка завантаження оцінок:', error);
    }
  }

  async function fetchStudents() {
    try {
      const response = await fetch('/api/students');
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  }

  async function fetchTeachers() {
    try {
      const response = await fetch('/api/teachers');
      if (!response.ok) throw new Error('Failed to fetch teachers');
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  }

  async function fetchSubjects() {
    try {
      const response = await fetch('/api/subjects');
      if (!response.ok) throw new Error('Failed to fetch subjects');
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  }

  async function onSubmit(data: GradeFormData) {
    try {
      const url = editingGrade ? `/api/grades/${editingGrade.id}` : '/api/grades';
      const method = editingGrade ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to save grade');

      setIsModalOpen(false);
      setEditingGrade(null);
      reset();
      fetchGrades();
    } catch (error) {
      console.error('Помилка збереження оцінки:', error);
    }
  }

  async function handleDelete(grade: Grade) {
    if (!confirm('Ви впевнені, що хочете видалити цю оцінку?')) return;

    try {
      const response = await fetch(`/api/grades/${grade.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete grade');

      fetchGrades();
    } catch (error) {
      console.error('Error deleting grade:', error);
    }
  }

  function handleEdit(grade: Grade) {
    setEditingGrade(grade);
    reset({
      student_id: grade.student_id.toString(),
      teacher_id: grade.teacher_id.toString(),
      subject_id: grade.subject_id.toString(),
      grade: grade.grade.toString(),
      note: grade.note || '',
    });
    setIsModalOpen(true);
  }

  function handleAdd() {
    setEditingGrade(null);
    reset({});
    setIsModalOpen(true);
  }

  const columns = [
    {
      header: 'Студент',
      accessor: (grade: Grade) => 
        `${grade.student?.last_name} ${grade.student?.first_name}`,
    },
    {
      header: 'Викладач',
      accessor: (grade: Grade) => 
        `${grade.teacher?.last_name} ${grade.teacher?.first_name}`,
    },
    {
      header: 'Предмет',
      accessor: (grade: Grade) => grade.subject?.name,
    },
    { header: 'Оцінка', accessor: 'grade' },
    { header: 'Примітка', accessor: 'note' },
    {
      header: 'Дата',
      accessor: (grade: Grade) => 
        new Date(grade.created_at).toLocaleDateString(),
    },
  ];

  return (
    <>
      <Navbar />
      <div className="container p-4 mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Оцінки</h1>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            <Plus size={20} />
            Додати оцінку
          </button>
        </div>

        <DataTable
          data={grades}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          title="Grades"
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingGrade(null);
            reset();
          }}
          title={editingGrade ? 'Редагувати оцінку' : 'Додати оцінку'}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Студент
              </label>
              <select
                {...register('student_id')}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Оберіть студента</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.last_name} {student.first_name}
                  </option>
                ))}
              </select>
              {errors.student_id && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.student_id.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Викладач
              </label>
              <select
                {...register('teacher_id')}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Оберіть викладача</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.last_name} {teacher.first_name}
                  </option>
                ))}
              </select>
              {errors.teacher_id && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.teacher_id.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Предмет
              </label>
              <select
                {...register('subject_id')}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Оберіть предмет</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
              {errors.subject_id && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.subject_id.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Оцінка (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                {...register('grade')}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {errors.grade && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.grade.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Примітка
              </label>
              <textarea
                {...register('note')}
                rows={3}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {errors.note && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.note.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingGrade(null);
                  reset();
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Скасувати
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                {editingGrade ? 'Оновити' : 'Створити'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
}