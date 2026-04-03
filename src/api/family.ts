import { get, post, del } from './request'
import type { FamilyGroup, MemberMenu } from '@/types/family'

export const familyApi = {
  // 获取家庭群组信息
  getGroup: () =>
    get<FamilyGroup>('/v1/families/my'),

  // 创建家庭群组
  create: (name: string) =>
    post<FamilyGroup>('/v1/families', { name }),

  // 加入家庭群组
  join: (inviteCode: string) =>
    post<FamilyGroup>('/v1/families/join', { invite_code: inviteCode }),

  // 离开家庭群组
  leave: () =>
    post('/v1/families/leave'),

  // 移除成员
  removeMember: (memberId: number) =>
    del(`/v1/families/members/${memberId}`),

  // 获取成员菜单
  getMemberMenu: (memberId: number) =>
    get<MemberMenu>(`/v1/families/members/${memberId}/menu`),
}
