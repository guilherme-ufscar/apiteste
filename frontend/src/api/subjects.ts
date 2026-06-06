import client from './client'
import type { Subject, SubjectCreate } from '../types'

export const subjectsApi = {
  list: (params?: { name?: string; code?: string; teacher_id?: number }) =>
    client.get<Subject[]>('/subjects', { params }),

  get: (id: number) =>
    client.get<Subject>(`/subjects/${id}`),

  create: (data: SubjectCreate) =>
    client.post<Subject>('/subjects', data),

  update: (id: number, data: SubjectCreate) =>
    client.put<Subject>(`/subjects/${id}`, data),

  delete: (id: number) =>
    client.delete(`/subjects/${id}`),
}
