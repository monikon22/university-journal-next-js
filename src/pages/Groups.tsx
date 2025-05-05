import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { query } from '../lib/db';
import type { Group } from '../types/database';

const groupSchema = z.object({
  speciality_code: z.string()
    .regex(/^\d{3}$/, 'Код спеціальності повинен містити рівно 3 цифри')
    .transform(val => Number(val)),
  speciality_name: z.string().min(2, 'Назва спеціальності повинна містити щонайменше 2 символи'),
});

type GroupFormData = z.infer<typeof groupSchema>;

export function Groups() {
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
      const data = await query<Group[]>('SELECT * FROM `groups` ORDER BY speciality_name');
      setGroups(data);
    } catch (error) {
      console.error('Помилка завантаження груп:', error);
    }
  }

  async function onSubmit(data: GroupFormData) {
    try {
      if (editingGroup) {
        await query(
          'UPDATE `groups` SET speciality_code = ?, speciality_name = ? WHERE id = ?',
          [data.speciality_code, data.speciality_name, editingGroup.id]
        );
      } else {
        await query(
          'INSERT INTO `groups` (speciality_code, speciality_name) VALUES (?, ?)',
          [data.speciality_code, data.speciality_name]
        );
      }

      setIsModalOpen(false);
      setEditingGroup(null);
      reset();
      fetchGroups();
    } catch (error) {
      console.error('Помилка збереження групи:', error);
    }
  }

  async function handleDelete(group: Group) {
    if (!confirm('Ви впевнені, що хочете видалити цю групу?')) return;

    try {
      await query('DELETE FROM `groups` WHERE id = ?', [group.id]);
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
      header: 'Speciality Code', 
      accessor: (group: Group) => group.speciality_code.toString().padStart(3, '0') 
    },
    { header: 'Speciality Name', accessor: 'speciality_name' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Групи</h1>
        <button
          onClick={handleAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
  );
}