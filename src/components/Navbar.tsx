'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Users, BookOpen, FolderKanban, GrapeIcon as GradeIcon } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-indigo-600 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold flex items-center gap-2">
          <GraduationCap />
          University Journal
        </Link>
        <div className="flex gap-4">
          <Link 
            href="/groups" 
            className={`flex items-center gap-1 hover:text-indigo-200 ${pathname === '/groups' ? 'text-indigo-200' : ''}`}
          >
            <FolderKanban size={20} />
            Groups
          </Link>
          <Link 
            href="/students" 
            className={`flex items-center gap-1 hover:text-indigo-200 ${pathname === '/students' ? 'text-indigo-200' : ''}`}
          >
            <Users size={20} />
            Students
          </Link>
          <Link 
            href="/teachers" 
            className={`flex items-center gap-1 hover:text-indigo-200 ${pathname === '/teachers' ? 'text-indigo-200' : ''}`}
          >
            <GraduationCap size={20} />
            Teachers
          </Link>
          <Link 
            href="/subjects" 
            className={`flex items-center gap-1 hover:text-indigo-200 ${pathname === '/subjects' ? 'text-indigo-200' : ''}`}
          >
            <BookOpen size={20} />
            Subjects
          </Link>
          <Link 
            href="/grades" 
            className={`flex items-center gap-1 hover:text-indigo-200 ${pathname === '/grades' ? 'text-indigo-200' : ''}`}
          >
            <GradeIcon size={20} />
            Grades
          </Link>
        </div>
      </div>
    </nav>
  );
}