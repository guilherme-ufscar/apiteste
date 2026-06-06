import client from './client'
import type { Period, PeriodCreate } from '../types'

export const periodsApi = {
  list: (params?: { is_active?: boolean }) =>
    client.get<Period[]>('/periods', { params }),

  get: (id: number) =>
    client.get<Period>(`/periods/${id}`),

  create: (data: PeriodCreate) =>
    client.post<Period>('/periods', data),

  update: (id: number, data: PeriodCreate) =>
    client.put<Period>(`/periods/${id}`, data),

  patch: (id: number, data: Partial<PeriodCreate>) =>
    client.patch<Period>(`/periods/${id}`, data),

  delete: (id: number) =>
    client.delete(`/periods/${id}`),
}
