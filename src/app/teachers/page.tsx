'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { Modal } from '@/components/Modal';
import { Navbar } from '@/components/Navbar';
import type { Teacher } from '@/types/database';

const teacherSchema = z.object({
  first_name: z.string().min(2, 'Ім’я повинно містити щонайменше 2 символи'),
  last_name: z.string().min(2, 'Прізвище повинно містити щонайменше 2 символи'),
});

type TeacherFormData = z.infer<typeof teacherSchema>;

export default function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  async function fetchTeachers() {
    try {
      const response = await fetch('/api/teachers');
      if (!response.ok) throw new Error('Не вдалося отримати список викладачів');
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error('Помилка при отриманні викладачів:', error);
    }
  }

  async function onSubmit(data: TeacherFormData) {
    try {
      const url = editingTeacher ? `/api/teachers/${editingTeacher.id}` : '/api/teachers';
      const method = editingTeacher ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Не вдалося зберегти викладача');

      setIsModalOpen(false);
      setEditingTeacher(null);
      reset();
      fetchTeachers();
    } catch (error) {
      console.error('Помилка при збереженні викладача:', error);
    }
  }

  async function handleDelete(teacher: Teacher) {
    if (!confirm('Ви впевнені, що хочете видалити цього викладача?')) return;

    try {
      const response = await fetch(`/api/teachers/${teacher.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Не вдалося видалити викладача');

      fetchTeachers();
    } catch (error) {
      console.error('Помилка при видаленні викладача:', error);
    }
  }

  function handleEdit(teacher: Teacher) {
    setEditingTeacher(teacher);
    reset({
      first_name: teacher.first_name,
      last_name: teacher.last_name,
    });
    setIsModalOpen(true);
  }

  function handleAdd() {
    setEditingTeacher(null);
    reset({});
    setIsModalOpen(true);
  }

  const columns = [
    { header: 'Прізвище', accessor: 'last_name' },
    { header: 'Ім’я', accessor: 'first_name' },
  ];

  return (
    <>
      <Navbar />
      <div className="container p-4 mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Викладачі</h1>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            <Plus size={20} />
            Додати викладача
          </button>
        </div>

        <DataTable
          data={teachers}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTeacher(null);
            reset();
          }}
          title={editingTeacher ? 'Редагувати викладача' : 'Додати викладача'}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ім’я
              </label>
              <input
                type="text"
                {...register('first_name')}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {errors.first_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Прізвище
              </label>
              <input
                type="text"
                {...register('last_name')}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {errors.last_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.last_name.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingTeacher(null);
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
                {editingTeacher ? 'Оновити' : 'Створити'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
}