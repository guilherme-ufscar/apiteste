import client from './client'
import type { DashboardStats } from '../types'

export const dashboardApi = {
  stats: (periodId?: number) =>
    client.get<DashboardStats>('/dashboard/stats', {
      params: periodId ? { period_id: periodId } : undefined,
    }),
}
