import client from './client'
import type { Teacher, TeacherCreate } from '../types'

export const teachersApi = {
  list: (params?: { name?: string; is_active?: boolean }) =>
    client.get<Teacher[]>('/teachers', { params }),

  get: (id: number) =>
    client.get<Teacher>(`/teachers/${id}`),

  create: (data: TeacherCreate) =>
    client.post<Teacher>('/teachers', data),

  update: (id: number, data: TeacherCreate) =>
    client.put<Teacher>(`/teachers/${id}`, data),

  delete: (id: number) =>
    client.delete<Teacher>(`/teachers/${id}`),
}
