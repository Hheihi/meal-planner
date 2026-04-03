import { View, Text, Button } from '@tarojs/components'
import styles from './index.module.less'

interface ErrorRetryProps {
  text?: string
  onRetry: () => void
}

export const ErrorRetry: React.FC<ErrorRetryProps> = ({
  text = '加载失败',
  onRetry,
}) => {
  return (
    <View className={styles.container}>
      <View className={styles.icon}>
        <Text className={styles.iconText}>!</Text>
      </View>
      <Text className={styles.text}>{text}</Text>
      <Button className={styles.retryBtn} onClick={onRetry}>
        重新加载
      </Button>
    </View>
  )
}
