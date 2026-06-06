import client from './client'
import type { Enrollment, EnrollmentCreate, Grade, GradeCreate } from '../types'

export const enrollmentsApi = {
  list: (params?: { student_id?: number; subject_id?: number; period_id?: number; status_filter?: string }) =>
    client.get<Enrollment[]>('/enrollments', { params }),

  get: (id: number) =>
    client.get<Enrollment>(`/enrollments/${id}`),

  create: (data: EnrollmentCreate) =>
    client.post<Enrollment>('/enrollments', data),

  patch: (id: number, data: { status: string }) =>
    client.patch<Enrollment>(`/enrollments/${id}`, data),

  delete: (id: number) =>
    client.delete(`/enrollments/${id}`),

  getGrades: (id: number) =>
    client.get<Grade[]>(`/enrollments/${id}/grades`),

  addGrade: (id: number, data: GradeCreate) =>
    client.post<Grade>(`/enrollments/${id}/grades`, data),
}
