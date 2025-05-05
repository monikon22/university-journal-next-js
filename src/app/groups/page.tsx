'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { Modal } from '@/components/Modal';
import { Navbar } from '@/components/Navbar';
import type { Group } from '@/types/database';

const groupSchema = z.object({
  speciality_code: z.string()
    .regex(/^\d{3}$/, 'Код спеціальності має складатися рівно з 3 цифр')
    .transform(val => Number(val)),
  speciality_name: z.string().min(2, 'Назва спеціальності має містити щонайменше 2 символи'),
});

type GroupFormData = z.infer<typeof groupSchema>;

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  async function fetchGroups() {
    try {
      const response = await fetch('/api/groups');
      if (!response.ok) throw new Error('Не вдалося отримати групи');
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  }

  async function onSubmit(data: GroupFormData) {
    try {
      const url = editingGroup ? `/api/groups/${editingGroup.id}` : '/api/groups';
      const method = editingGroup ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Не вдалося зберегти групу');

      setIsModalOpen(false);
      setEditingGroup(null);
      reset();
      fetchGroups();
    } catch (error) {
      console.error('Error saving group:', error);
    }
  }

  async function handleDelete(group: Group) {
    if (!confirm('Ви впевнені, що хочете видалити цю групу?')) return;

    try {
      const response = await fetch(`/api/groups/${group.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Не вдалося видалити групу');

      fetchGroups();
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  }

  function handleEdit(group: Group) {
    setEditingGroup(group);
    reset({
      speciality_code: group.speciality_code.toString().padStart(3, '0'),
      speciality_name: group.speciality_name,
    });
    setIsModalOpen(true);
  }

  function handleAdd() {
    setEditingGroup(null);
    reset({});
    setIsModalOpen(true);
  }

  const columns = [
    {
      header: 'Код спеціальності',
      accessor: (group: Group) => group.speciality_code.toString().padStart(3, '0'),
    },
    { header: 'Назва спеціальності', accessor: 'speciality_name' },
  ];

  return (
    <>
      <Navbar />
      <div className="container p-4 mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Групи</h1>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            <Plus size={20} />
            Додати групу
          </button>
        </div>

        <DataTable
          data={groups}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          title="Групи"
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingGroup(null);
            reset();
          }}
          title={editingGroup ? 'Редагувати групу' : 'Додати групу'}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Код спеціальності
              </label>
              <input
                type="text"
                {...register('speciality_code')}
                placeholder="123"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {errors.speciality_code && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.speciality_code.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Назва спеціальності
              </label>
              <input
                type="text"
                {...register('speciality_name')}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {errors.speciality_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.speciality_name.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingGroup(null);
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
                {editingGroup ? 'Оновити' : 'Створити'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
}