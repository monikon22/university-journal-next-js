import Link from 'next/link';
import { GraduationCap, Users, BookOpen, FolderKanban } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="container p-4 mx-auto">
        <div className="mt-10 text-center">
          <h1 className="mb-6 text-4xl font-bold text-gray-800">Ласкаво просимо до Університетського журналу</h1>
          <p className="mb-8 text-xl text-gray-600">Керуйте оцінками, студентами та курсами в одному місці</p>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/groups" className="p-6 transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg">
              <FolderKanban className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
              <h2 className="mb-2 text-xl font-semibold">Групи</h2>
              <p className="text-gray-600">Керуйте студентськими групами та спеціальностями</p>
            </Link>

            <Link href="/students" className="p-6 transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg">
              <Users className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
              <h2 className="mb-2 text-xl font-semibold">Студенти</h2>
              <p className="text-gray-600">Керуйте записами та інформацією про студентів</p>
            </Link>
            
            <Link href="/teachers" className="p-6 transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg">
              <GraduationCap className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
              <h2 className="mb-2 text-xl font-semibold">Викладачі</h2>
              <p className="text-gray-600">Переглядайте та керуйте викладацьким складом</p>
            </Link>
            
            <Link href="/subjects" className="p-6 transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
              <h2 className="mb-2 text-xl font-semibold">Предмети</h2>
              <p className="text-gray-600">Переглядайте доступні курси та предмети</p>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}