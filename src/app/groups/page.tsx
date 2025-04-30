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
    .regex(/^\d{3}$/, 'Speciality code must be exactly 3 digits')
    .transform(val => Number(val)),
  speciality_name: z.string().min(2, 'Speciality name must be at least 2 characters'),
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
      if (!response.ok) throw new Error('Failed to fetch groups');
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

      if (!response.ok) throw new Error('Failed to save group');

      setIsModalOpen(false);
      setEditingGroup(null);
      reset();
      fetchGroups();
    } catch (error) {
      console.error('Error saving group:', error);
    }
  }

  async function handleDelete(group: Group) {
    if (!confirm('Are you sure you want to delete this group?')) return;

    try {
      const response = await fetch(`/api/groups/${group.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete group');

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
      accessor: (group: Group) => group.speciality_code.toString().padStart(3, '0'),
    },
    { header: 'Speciality Name', accessor: 'speciality_name' },
  ];

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Groups</h1>
          <button
            onClick={handleAdd}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
          >
            <Plus size={20} />
            Add Group
          </button>
        </div>

        <DataTable
          data={groups}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          title="Groups"
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingGroup(null);
            reset();
          }}
          title={editingGroup ? 'Edit Group' : 'Add Group'}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Speciality Code
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
                Speciality Name
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
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                {editingGroup ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
}