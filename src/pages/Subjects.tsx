import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { supabase } from '../lib/supabase';
import type { Subject } from '../types/database';

const subjectSchema = z.object({
  name: z.string().min(2, 'Назва предмету повинна містити щонайменше 2 символи'),
});

type SubjectFormData = z.infer<typeof subjectSchema>;

export function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  async function fetchSubjects() {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Помилка завантаження предметів:', error);
      return;
    }

    setSubjects(data);
  }

  async function onSubmit(data: SubjectFormData) {
    const operation = editingSubject
      ? supabase
          .from('subjects')
          .update(data)
          .eq('id', editingSubject.id)
      : supabase
          .from('subjects')
          .insert([data]);

    const { error } = await operation;

    if (error) {
      console.error('Помилка збереження предмету:', error);
      return;
    }

    setIsModalOpen(false);
    setEditingSubject(null);
    reset();
    fetchSubjects();
  }

  async function handleDelete(subject: Subject) {
    if (!confirm('Ви впевнені, що хочете видалити цей предмет?')) return;

    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', subject.id);

    if (error) {
      console.error('Error deleting subject:', error);
      return;
    }

    fetchSubjects();
  }

  function handleEdit(subject: Subject) {
    setEditingSubject(subject);
    reset({
      name: subject.name,
    });
    setIsModalOpen(true);
  }

  function handleAdd() {
    setEditingSubject(null);
    reset({});
    setIsModalOpen(true);
  }

  const columns = [
    { header: 'Subject Name', accessor: 'name' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Предмети</h1>
        <button
          onClick={handleAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
        >
          <Plus size={20} />
          Додати предмет
        </button>
      </div>

      <DataTable
        data={subjects}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSubject(null);
          reset();
        }}
        title={editingSubject ? 'Редагувати предмет' : 'Додати предмет'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Назва предмету
            </label>
            <input
              type="text"
              {...register('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingSubject(null);
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
              {editingSubject ? 'Оновити' : 'Створити'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}