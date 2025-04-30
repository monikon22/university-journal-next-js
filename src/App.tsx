import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { GraduationCap, Users, BookOpen, GraduationCap as GradeIcon, FolderKanban } from 'lucide-react';
import { Students } from './pages/Students';
import { Teachers } from './pages/Teachers';
import { Subjects } from './pages/Subjects';
import { Groups } from './pages/Groups';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-indigo-600 text-white p-4">
          <div className="container mx-auto flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold flex items-center gap-2">
              <GraduationCap />
              University Journal
            </Link>
            <div className="flex gap-4">
              <Link to="/groups" className="flex items-center gap-1 hover:text-indigo-200">
                <FolderKanban size={20} />
                Groups
              </Link>
              <Link to="/students" className="flex items-center gap-1 hover:text-indigo-200">
                <Users size={20} />
                Students
              </Link>
              <Link to="/teachers" className="flex items-center gap-1 hover:text-indigo-200">
                <GraduationCap size={20} />
                Teachers
              </Link>
              <Link to="/subjects" className="flex items-center gap-1 hover:text-indigo-200">
                <BookOpen size={20} />
                Subjects
              </Link>
            </div>
          </div>
        </nav>

        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/students" element={<Students />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/subjects" element={<Subjects />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="text-center mt-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to University Journal</h1>
      <p className="text-xl text-gray-600 mb-8">Manage grades, students, and courses all in one place</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/groups" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <FolderKanban className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Groups</h2>
          <p className="text-gray-600">Manage student groups and specialties</p>
        </Link>

        <Link to="/students" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <Users className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Students</h2>
          <p className="text-gray-600">Manage student records and information</p>
        </Link>
        
        <Link to="/teachers" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <GraduationCap className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Teachers</h2>
          <p className="text-gray-600">View and manage teaching staff</p>
        </Link>
        
        <Link to="/subjects" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <BookOpen className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Subjects</h2>
          <p className="text-gray-600">Browse available courses and subjects</p>
        </Link>
      </div>
    </div>
  );
}

export default App;