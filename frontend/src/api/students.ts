import client from './client'
import type { Student, StudentCreate, ReportCard } from '../types'

export const studentsApi = {
  list: (params?: { name?: string; is_active?: boolean }) =>
    client.get<Student[]>('/students', { params }),

  get: (id: number) =>
    client.get<Student>(`/students/${id}`),

  create: (data: StudentCreate) =>
    client.post<Student>('/students', data),

  update: (id: number, data: StudentCreate) =>
    client.put<Student>(`/students/${id}`, data),

  patch: (id: number, data: Partial<StudentCreate>) =>
    client.patch<Student>(`/students/${id}`, data),

  delete: (id: number) =>
    client.delete<Student>(`/students/${id}`),

  reportCard: (id: number, periodId?: number) =>
    client.get<ReportCard>(`/students/${id}/report-card`, {
      params: periodId ? { period_id: periodId } : undefined,
    }),
}
