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
  name: z.string().min(2, 'Subject name must be at least 2 characters'),
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
      if (!response.ok) throw new Error('Failed to fetch subjects');
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
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

      if (!response.ok) throw new Error('Failed to save subject');

      setIsModalOpen(false);
      setEditingSubject(null);
      reset();
      fetchSubjects();
    } catch (error) {
      console.error('Error saving subject:', error);
    }
  }

  async function handleDelete(subject: Subject) {
    if (!confirm('Are you sure you want to delete this subject?')) return;

    try {
      const response = await fetch(`/api/subjects/${subject.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete subject');

      fetchSubjects();
    } catch (error) {
      console.error('Error deleting subject:', error);
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
    { header: 'Subject Name', accessor: 'name' },
  ];

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Subjects</h1>
          <button
            onClick={handleAdd}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
          >
            <Plus size={20} />
            Add Subject
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
          title={editingSubject ? 'Edit Subject' : 'Add Subject'}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subject Name
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
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                {editingSubject ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
}