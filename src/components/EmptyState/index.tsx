import { View, Text, Button } from '@tarojs/components'
import styles from './index.module.less'

interface EmptyStateProps {
  icon?: string
  text: string
  actionText?: string
  onAction?: () => void
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  text,
  actionText,
  onAction,
}) => {
  return (
    <View className={styles.container}>
      <View className={styles.icon}>
        {icon ? (
          <Text>icon</Text>
        ) : (
          <View className={styles.defaultIcon} />
        )}
      </View>
      <Text className={styles.text}>{text}</Text>
      {actionText && onAction && (
        <Button className={styles.actionBtn} onClick={onAction}>
          {actionText}
        </Button>
      )}
    </View>
  )
}
