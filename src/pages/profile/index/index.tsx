import { View, Text, Image, Button } from '@tarojs/components'
import { useDidShow } from '@tarojs/taro'
import { useAuthStore } from '@/stores/useAuthStore'
import { useUserStore } from '@/stores/useUserStore'
import { Skeleton } from '@/components/Skeleton'
import { navigateToPreferences, navigateToFamily } from '@/utils/navigation'
import { DEFAULT_AVATAR } from '@/utils/constants'
import styles from './index.module.less'

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)
  const login = useAuthStore((s) => s.login)
  const preferences = useUserStore((s) => s.user?.preferences)

  const handlePreferencesTap = () => {
    navigateToPreferences()
  }

  const handleFamilyTap = () => {
    navigateToFamily()
  }

  if (loading) {
    return (
      <View className={styles.page}>
        <Skeleton type="detail" />
      </View>
    )
  }

  if (!user) {
    return (
      <View className={styles.page}>
        <View className={styles.loginSection}>
          <Text className={styles.loginTitle}>欢迎使用今日吃什么</Text>
          <Text className={styles.loginDesc}>登录后可使用更多功能</Text>
          <Button className={styles.loginBtn} onClick={login}>
            微信一键登录
          </Button>
        </View>
      </View>
    )
  }

  return (
    <View className={styles.page}>
      {/* 用户信息 */}
      <View className={styles.userSection}>
        <Image className={styles.avatar} src={user.avatarUrl || DEFAULT_AVATAR} mode="aspectFill" />
        <Text className={styles.nickname}>{user.nickname}</Text>
      </View>

      {/* 功能列表 */}
      <View className={styles.menuSection}>
        <View className={styles.menuItem} onClick={handlePreferencesTap}>
          <Text className={styles.menuIcon}>🍽️</Text>
          <View className={styles.menuContent}>
            <Text className={styles.menuTitle}>口味偏好</Text>
            <Text className={styles.menuDesc}>
              {preferences && preferences.length > 0
                ? `已选择 ${preferences.length} 个标签`
                : '设置你的口味偏好'}
            </Text>
          </View>
          <Text className={styles.menuArrow}>&gt;</Text>
        </View>

        <View className={styles.menuItem} onClick={handleFamilyTap}>
          <Text className={styles.menuIcon}>👨‍👩‍👧‍👦</Text>
          <View className={styles.menuContent}>
            <Text className={styles.menuTitle}>家庭群组</Text>
            <Text className={styles.menuDesc}>与家人共享今日菜单</Text>
          </View>
          <Text className={styles.menuArrow}>&gt;</Text>
        </View>

        <View className={styles.menuItem}>
          <Text className={styles.menuIcon}>📋</Text>
          <View className={styles.menuContent}>
            <Text className={styles.menuTitle}>饮食记录</Text>
            <Text className={styles.menuDesc}>查看历史饮食记录</Text>
          </View>
          <Text className={styles.menuArrow}>&gt;</Text>
        </View>
      </View>

      {/* 版本信息 */}
      <View className={styles.footer}>
        <Text className={styles.version}>今日吃什么 v1.0.0</Text>
      </View>
    </View>
  )
}
