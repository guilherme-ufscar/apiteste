import client from './client'
import type { Grade, GradeCreate } from '../types'

export const gradesApi = {
  get: (id: number) =>
    client.get<Grade>(`/grades/${id}`),

  update: (id: number, data: GradeCreate) =>
    client.put<Grade>(`/grades/${id}`, data),

  delete: (id: number) =>
    client.delete(`/grades/${id}`),
}
