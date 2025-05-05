'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Users, BookOpen, FolderKanban, GrapeIcon as GradeIcon } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="p-4 text-white bg-indigo-600">
      <div className="container flex items-center justify-between mx-auto">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <GraduationCap />
          Університетський журнал
        </Link>
        <div className="flex gap-4">
          <Link 
            href="/groups" 
            className={`flex items-center gap-1 hover:text-indigo-200 ${pathname === '/groups' ? 'text-indigo-200' : ''}`}
          >
            <FolderKanban size={20} />
            Групи
          </Link>
          <Link 
            href="/students" 
            className={`flex items-center gap-1 hover:text-indigo-200 ${pathname === '/students' ? 'text-indigo-200' : ''}`}
          >
            <Users size={20} />
            Студенти
          </Link>
          <Link 
            href="/teachers" 
            className={`flex items-center gap-1 hover:text-indigo-200 ${pathname === '/teachers' ? 'text-indigo-200' : ''}`}
          >
            <GraduationCap size={20} />
            Викладачі
          </Link>
          <Link 
            href="/subjects" 
            className={`flex items-center gap-1 hover:text-indigo-200 ${pathname === '/subjects' ? 'text-indigo-200' : ''}`}
          >
            <BookOpen size={20} />
            Предмети
          </Link>
          <Link 
            href="/grades" 
            className={`flex items-center gap-1 hover:text-indigo-200 ${pathname === '/grades' ? 'text-indigo-200' : ''}`}
          >
            <GradeIcon size={20} />
            Оцінки
          </Link>
        </div>
      </div>
    </nav>
  );
}