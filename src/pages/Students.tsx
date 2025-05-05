import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { supabase } from '../lib/supabase';
import type { Student, Group } from '../types/database';

const studentSchema = z.object({
  first_name: z.string().min(2, 'Ім\'я повинно містити щонайменше 2 символи'),
  last_name: z.string().min(2, 'Прізвище повинно містити щонайменше 2 символи'),
  group_id: z.string().uuid('Будь ласка, оберіть групу'),
});

type StudentFormData = z.infer<typeof studentSchema>;

export function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  });

  useEffect(() => {
    fetchStudents();
    fetchGroups();
  }, []);

  async function fetchStudents() {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        group:groups(*)
      `)
      .order('last_name');
    
    if (error) {
      console.error('Помилка завантаження студентів:', error);
      return;
    }

    setStudents(data);
  }

  async function fetchGroups() {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .order('speciality_name');
    
    if (error) {
      console.error('Error fetching groups:', error);
      return;
    }

    setGroups(data);
  }

  async function onSubmit(data: StudentFormData) {
    const operation = editingStudent
      ? supabase
          .from('students')
          .update(data)
          .eq('id', editingStudent.id)
      : supabase
          .from('students')
          .insert([data]);

    const { error } = await operation;

    if (error) {
      console.error('Помилка збереження студента:', error);
      return;
    }

    setIsModalOpen(false);
    setEditingStudent(null);
    reset();
    fetchStudents();
  }

  async function handleDelete(student: Student) {
    if (!confirm('Ви впевнені, що хочете видалити цього студента?')) return;

    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', student.id);

    if (error) {
      console.error('Error deleting student:', error);
      return;
    }

    fetchStudents();
  }

  function handleEdit(student: Student) {
    setEditingStudent(student);
    reset({
      first_name: student.first_name,
      last_name: student.last_name,
      group_id: student.group_id,
    });
    setIsModalOpen(true);
  }

  function handleAdd() {
    setEditingStudent(null);
    reset({});
    setIsModalOpen(true);
  }

  const columns = [
    { header: 'Last Name', accessor: 'last_name' },
    { header: 'First Name', accessor: 'first_name' },
    {
      header: 'Group',
      accessor: (student: Student) => student.group?.speciality_name,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Студенти</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          <Plus size={20} />
          Додати студента
        </button>
      </div>

      <DataTable
        data={students}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStudent(null);
          reset();
        }}
        title={editingStudent ? 'Редагувати студента' : 'Додати студента'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ім'я
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Група
            </label>
            <select
              {...register('group_id')}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Оберіть групу</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.speciality_name}
                </option>
              ))}
            </select>
            {errors.group_id && (
              <p className="mt-1 text-sm text-red-600">
                {errors.group_id.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingStudent(null);
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
              {editingStudent ? 'Оновити' : 'Створити'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}