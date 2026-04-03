import { View, Text, Button, Input } from '@tarojs/components'
import { useState, useCallback, useEffect } from 'react'
import { useRouter, navigateBack, showToast } from '@tarojs/taro'
import { familyApi } from '@/api/family'
import styles from './index.module.less'

export default function JoinFamilyPage() {
  const router = useRouter()
  const [inviteCode, setInviteCode] = useState('')
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    // 从启动参数中获取邀请码
    const code = router.params.invite_code
    if (code) {
      setInviteCode(code)
    }
  }, [router.params.invite_code])

  const handleJoin = useCallback(async () => {
    if (!inviteCode.trim()) {
      showToast({ title: '请输入邀请码', icon: 'none' })
      return
    }

    setJoining(true)
    try {
      await familyApi.join(inviteCode.trim())
      showToast({ title: '加入成功', icon: 'success' })
      setTimeout(() => {
        navigateBack()
      }, 1500)
    } catch {
      showToast({ title: '加入失败，请检查邀请码', icon: 'none' })
    } finally {
      setJoining(false)
    }
  }, [inviteCode])

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>加入家庭群组</Text>
        <Text className={styles.desc}>输入邀请码即可加入家庭，与家人共享今日菜单</Text>
      </View>

      <View className={styles.form}>
        <View className={styles.inputWrapper}>
          <Text className={styles.label}>邀请码</Text>
          <Input
            className={styles.input}
            placeholder="请输入邀请码"
            value={inviteCode}
            onInput={(e) => setInviteCode(e.detail.value)}
            maxlength={20}
          />
        </View>
      </View>

      <View className={styles.bottomBar}>
        <Button
          className={`${styles.joinBtn} ${joining ? styles.joinBtnDisabled : ''}`}
          onClick={joining ? undefined : handleJoin}
        >
          {joining ? '加入中...' : '确认加入'}
        </Button>
      </View>
    </View>
  )
}
