import Link from 'next/link';
import { GraduationCap, Users, BookOpen, FolderKanban } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4">
        <div className="text-center mt-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to University Journal</h1>
          <p className="text-xl text-gray-600 mb-8">Manage grades, students, and courses all in one place</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/groups" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <FolderKanban className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Groups</h2>
              <p className="text-gray-600">Manage student groups and specialties</p>
            </Link>

            <Link href="/students" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Users className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Students</h2>
              <p className="text-gray-600">Manage student records and information</p>
            </Link>
            
            <Link href="/teachers" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <GraduationCap className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Teachers</h2>
              <p className="text-gray-600">View and manage teaching staff</p>
            </Link>
            
            <Link href="/subjects" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <BookOpen className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Subjects</h2>
              <p className="text-gray-600">Browse available courses and subjects</p>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}