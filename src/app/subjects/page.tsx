'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { Modal } from '@/components/Modal';
import { Navbar } from '@/components/Navbar';
import type { Subject } from '@/types/database';

const subjectSchema = z.object({
  name: z.string().min(2, 'Назва предмету має містити щонайменше 2 символи'),
});

type SubjectFormData = z.infer<typeof subjectSchema>;

export default function Subjects() {
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
    try {
      const response = await fetch('/api/subjects');
      if (!response.ok) throw new Error('Не вдалося отримати предмети');
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error('Помилка при отриманні предметів:', error);
    }
  }

  async function onSubmit(data: SubjectFormData) {
    try {
      const url = editingSubject ? `/api/subjects/${editingSubject.id}` : '/api/subjects';
      const method = editingSubject ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Не вдалося зберегти предмет');

      setIsModalOpen(false);
      setEditingSubject(null);
      reset();
      fetchSubjects();
    } catch (error) {
      console.error('Помилка при збереженні предмету:', error);
    }
  }

  async function handleDelete(subject: Subject) {
    if (!confirm('Ви впевнені, що хочете видалити цей предмет?')) return;

    try {
      const response = await fetch(`/api/subjects/${subject.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Не вдалося видалити предмет');

      fetchSubjects();
    } catch (error) {
      console.error('Помилка при видаленні предмету:', error);
    }
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
    { header: 'Назва предмету', accessor: 'name' },
  ];

  return (
    <>
      <Navbar />
      <div className="container p-4 mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Предмети</h1>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
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
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
    </>
  );
}