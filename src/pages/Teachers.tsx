import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { supabase } from '../lib/supabase';
import type { Teacher } from '../types/database';

const teacherSchema = z.object({
  first_name: z.string().min(2, 'Ім\'я повинно містити щонайменше 2 символи'),
  last_name: z.string().min(2, 'Прізвище повинно містити щонайменше 2 символи'),
});

type TeacherFormData = z.infer<typeof teacherSchema>;

export function Teachers() {
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
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .order('last_name');
    
    if (error) {
      console.error('Помилка завантаження викладачів:', error);
      return;
    }

    setTeachers(data);
  }

  async function onSubmit(data: TeacherFormData) {
    const operation = editingTeacher
      ? supabase
          .from('teachers')
          .update(data)
          .eq('id', editingTeacher.id)
      : supabase
          .from('teachers')
          .insert([data]);

    const { error } = await operation;

    if (error) {
      console.error('Помилка збереження викладача:', error);
      return;
    }

    setIsModalOpen(false);
    setEditingTeacher(null);
    reset();
    fetchTeachers();
  }

  async function handleDelete(teacher: Teacher) {
    if (!confirm('Ви впевнені, що хочете видалити цього викладача?')) return;

    const { error } = await supabase
      .from('teachers')
      .delete()
      .eq('id', teacher.id);

    if (error) {
      console.error('Error deleting teacher:', error);
      return;
    }

    fetchTeachers();
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
    { header: 'Last Name', accessor: 'last_name' },
    { header: 'First Name', accessor: 'first_name' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Викладачі</h1>
        <button
          onClick={handleAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
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
              Ім'я
            </label>
            <input
              type="text"
              {...register('first_name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
  );
}