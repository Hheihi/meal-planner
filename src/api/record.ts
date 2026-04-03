import { get, post, del } from './request'
import type { CalendarMarks, DailyDetail, AddManualRecordParams } from '@/types/record'

export const recordApi = {
  // 获取月度标记
  getCalendar: (year: number, month: number) =>
    get<CalendarMarks>('/v1/records/calendar', { year, month }),

  // 获取日详情
  getDaily: (date: string) =>
    get<DailyDetail>('/v1/records/daily', { date }),

  // 添加手动记录
  addManual: (params: AddManualRecordParams) =>
    post('/v1/records/manual', params),

  // 删除记录
  deleteRecord: (recordId: number) =>
    del(`/v1/records/${recordId}`),
}
