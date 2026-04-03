import { useState, useCallback, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { showToast } from '@tarojs/taro'
import { useUserStore } from '@/stores/useUserStore'
import { PREFERENCE_TAGS, type PreferenceKey } from '@/types/user'
import styles from './index.module.less'

export default function PreferencesPage() {
  const user = useUserStore((s) => s.user)
  const updatePreferences = useUserStore((s) => s.updatePreferences)
  const [selected, setSelected] = useState<PreferenceKey[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user?.preferences) {
      setSelected(user.preferences as PreferenceKey[])
    }
  }, [user?.preferences])

  const handleToggle = useCallback((key: PreferenceKey) => {
    setSelected((prev) => {
      if (prev.includes(key)) {
        return prev.filter((k) => k !== key)
      }
      return [...prev, key]
    })
  }, [])

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      await updatePreferences(selected)
      showToast({ title: '保存成功', icon: 'success' })
    } catch {
      showToast({ title: '保存失败', icon: 'none' })
    } finally {
      setSaving(false)
    }
  }, [selected, updatePreferences])

  return (
    <View className={styles.page}>
      <ScrollView className={styles.scrollView} scrollY>
        <View className={styles.header}>
          <Text className={styles.title}>选择你的口味偏好</Text>
          <Text className={styles.desc}>帮助我们为你推荐更合适的菜品</Text>
        </View>

        <View className={styles.tagsSection}>
          {PREFERENCE_TAGS.map(({ key, label }) => (
            <View
              key={key}
              className={`${styles.tag} ${selected.includes(key) ? styles.tagSelected : ''}`}
              onClick={() => handleToggle(key)}
            >
              <Text className={`${styles.tagText} ${selected.includes(key) ? styles.tagTextSelected : ''}`}>
                {label}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        <View
          className={`${styles.saveBtn} ${saving ? styles.saveBtnDisabled : ''}`}
          onClick={saving ? undefined : handleSave}
        >
          <Text className={styles.saveText}>{saving ? '保存中...' : '保存'}</Text>
        </View>
      </View>
    </View>
  )
}
