import { View } from '@tarojs/components'
import styles from './index.module.less'

interface SafeAreaBottomProps {
  children: React.ReactNode
  className?: string
}

export const SafeAreaBottom: React.FC<SafeAreaBottomProps> = ({
  children,
  className = '',
}) => {
  return (
    <View className={`${styles.container} ${className}`}>
      {children}
    </View>
  )
}
