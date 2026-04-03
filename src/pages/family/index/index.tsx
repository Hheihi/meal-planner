import { useState, useCallback } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import { useDidShow, showModal, showToast } from '@tarojs/taro'
import { useRequest } from '@/hooks/useRequest'
import { Skeleton } from '@/components/Skeleton'
import { EmptyState } from '@/components/EmptyState'
import { ErrorRetry } from '@/components/ErrorRetry'
import { familyApi } from '@/api/family'
import { DEFAULT_AVATAR } from '@/utils/constants'
import styles from './index.module.less'

export default function FamilyPage() {
  const [creating, setCreating] = useState(false)
  const [joining, setJoining] = useState(false)

  const { data: family, loading, error, refresh } = useRequest(
    () => familyApi.getGroup(),
    { manual: false }
  )

  useDidShow(() => {
    refresh()
  })

  const handleCreateFamily = useCallback(async () => {
    const { confirm, content } = await showModal({
      title: '创建家庭群组',
      content: '',
      editable: true,
      placeholderText: '请输入家庭名称',
    })
    if (confirm && content) {
      setCreating(true)
      try {
        await familyApi.create(content)
        showToast({ title: '创建成功', icon: 'success' })
        refresh()
      } catch {
        showToast({ title: '创建失败', icon: 'none' })
      } finally {
        setCreating(false)
      }
    }
  }, [refresh])

  const handleJoinFamily = useCallback(async () => {
    const { confirm, content } = await showModal({
      title: '加入家庭群组',
      content: '',
      editable: true,
      placeholderText: '请输入邀请码',
    })
    if (confirm && content) {
      setJoining(true)
      try {
        await familyApi.join(content)
        showToast({ title: '加入成功', icon: 'success' })
        refresh()
      } catch {
        showToast({ title: '加入失败，请检查邀请码', icon: 'none' })
      } finally {
        setJoining(false)
      }
    }
  }, [refresh])

  const handleLeaveFamily = useCallback(async () => {
    const { confirm } = await showModal({
      title: '退出家庭群组',
      content: '确定要退出当前家庭群组吗？',
    })
    if (confirm) {
      try {
        await familyApi.leave()
        showToast({ title: '已退出', icon: 'success' })
        refresh()
      } catch {
        showToast({ title: '退出失败', icon: 'none' })
      }
    }
  }, [refresh])

  const handleShare = useCallback(() => {
    if (family?.inviteCode) {
      showToast({ title: `邀请码: ${family.inviteCode}`, icon: 'none' })
    }
  }, [family?.inviteCode])

  if (loading) {
    return (
      <View className={styles.page}>
        <Skeleton type="detail" />
      </View>
    )
  }

  if (error) {
    return (
      <View className={styles.page}>
        <ErrorRetry onRetry={refresh} />
      </View>
    )
  }

  // 未加入家庭
  if (!family) {
    return (
      <View className={styles.page}>
        <EmptyState
          text="你还没有加入家庭群组"
          actionText="创建家庭"
          onAction={handleCreateFamily}
        />
        <View className={styles.joinSection}>
          <Text className={styles.joinText}>已有邀请码？</Text>
          <Button className={styles.joinBtn} onClick={handleJoinFamily}>
            加入家庭
          </Button>
        </View>
      </View>
    )
  }

  return (
    <View className={styles.page}>
      {/* 家庭信息 */}
      <View className={styles.familyHeader}>
        <Text className={styles.familyName}>{family.name}</Text>
        <Text className={styles.memberCount}>{family.memberCount} 位成员</Text>
        <Text className={styles.inviteCode}>邀请码: {family.inviteCode}</Text>
        <View className={styles.shareBtn} onClick={handleShare}>
          <Text className={styles.shareText}>分享邀请</Text>
        </View>
      </View>

      {/* 成员列表 */}
      <View className={styles.membersSection}>
        <Text className={styles.sectionTitle}>家庭成员</Text>
        {family.members.map((member) => (
          <View key={member.id} className={styles.memberItem}>
            <Image className={styles.memberAvatar} src={member.avatarUrl || DEFAULT_AVATAR} mode="aspectFill" />
            <View className={styles.memberInfo}>
              <Text className={styles.memberName}>{member.nickname}</Text>
              {member.isCreator && <Text className={styles.creatorBadge}>创建者</Text>}
            </View>
          </View>
        ))}
      </View>

      {/* 退出按钮 */}
      <View className={styles.leaveSection}>
        <Button className={styles.leaveBtn} onClick={handleLeaveFamily}>
          退出家庭群组
        </Button>
      </View>
    </View>
  )
}
