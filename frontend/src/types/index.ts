export interface Student {
  id: number
  name: string
  email: string
  cpf?: string
  birth_date?: string
  phone?: string
  address?: string
  registration?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Teacher {
  id: number
  name: string
  email: string
  cpf?: string
  phone?: string
  hire_date?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Subject {
  id: number
  name: string
  code: string
  description?: string
  workload_hours: number
  teacher_id?: number
  teacher?: Teacher
  created_at: string
  updated_at: string
}

export interface Period {
  id: number
  name: string
  year: number
  semester: 1 | 2
  start_date?: string
  end_date?: string
  is_active: boolean
  created_at: string
}

export interface Enrollment {
  id: number
  student_id: number
  subject_id: number
  period_id: number
  status: string
  enrolled_at: string
  student?: Student
  subject?: Subject
  period?: Period
}

export interface Grade {
  id: number
  enrollment_id: number
  grade_type: string
  value: number
  graded_at: string
  notes?: string
}

export interface AttendanceRecord {
  id: number
  enrollment_id: number
  class_date: string
  present: boolean
  notes?: string
}

export interface DashboardStats {
  total_students: number
  total_teachers: number
  total_subjects: number
  active_enrollments: number
  average_grade: number | null
  pass_rate: number | null
  recent_enrollments: RecentEnrollment[]
  grades_by_subject: GradeBySubject[]
}

export interface RecentEnrollment {
  id: number
  student: string
  subject: string
  enrolled_at: string
}

export interface GradeBySubject {
  subject: string
  average: number
  count: number
}

export interface ReportCard {
  student: { id: number; name: string; email: string; registration?: string }
  report: ReportCardEntry[]
}

export interface ReportCardEntry {
  enrollment_id: number
  subject: { id: number; name: string; code: string }
  period: { id: number; name: string }
  status: string
  grades: Record<string, number>
  average_grade: number | null
  passed: boolean | null
  total_classes: number
  present_count: number
  attendance_rate: number | null
}

export interface StudentCreate {
  name: string
  email: string
  cpf?: string
  birth_date?: string
  phone?: string
  address?: string
  registration?: string
  is_active?: boolean
}

export interface TeacherCreate {
  name: string
  email: string
  cpf?: string
  phone?: string
  hire_date?: string
  is_active?: boolean
}

export interface SubjectCreate {
  name: string
  code: string
  description?: string
  workload_hours?: number
  teacher_id?: number | null
}

export interface PeriodCreate {
  name: string
  year: number
  semester: 1 | 2
  start_date?: string
  end_date?: string
  is_active?: boolean
}

export interface EnrollmentCreate {
  student_id: number
  subject_id: number
  period_id: number
}

export interface GradeCreate {
  grade_type: string
  value: number
  notes?: string
}
