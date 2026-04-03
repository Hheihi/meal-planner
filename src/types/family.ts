import type { TodayMenu } from './menu'

// 家庭成员
export interface FamilyMember {
  id: number
  nickname: string
  avatarUrl: string
  isCreator: boolean
}

// 家庭群组
export interface FamilyGroup {
  id: number
  name: string
  inviteCode: string
  members: FamilyMember[]
  memberCount: number
  createdAt: string
}

// 成员菜单（只读）
export interface MemberMenu {
  member: FamilyMember
  todayMenu: TodayMenu | null
}
