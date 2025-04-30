export interface Group {
  id: number;
  speciality_code: number;
  speciality_name: string;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  group_id: number;
  created_at: string;
  updated_at: string;
  group?: Group;
}

export interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: number;
  name: string;
}

export interface Grade {
  id: number;
  student_id: number;
  teacher_id: number;
  grade: number;
  subject_id: number;
  note?: string;
  created_at: string;
  updated_at: string;
  student?: Student;
  teacher?: Teacher;
  subject?: Subject;
}