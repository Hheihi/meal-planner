import { View } from '@tarojs/components'
import styles from './index.module.less'

interface SkeletonProps {
  type: 'card' | 'list' | 'detail'
  rows?: number
}

export const Skeleton: React.FC<SkeletonProps> = ({ type, rows = 3 }) => {
  if (type === 'card') {
    return (
      <View className={styles.card}>
        <View className={`${styles.image} ${styles.shimmer}`} />
        <View className={styles.content}>
          <View className={`${styles.title} ${styles.shimmer}`} />
          <View className={`${styles.desc} ${styles.shimmer}`} />
          <View className={`${styles.desc} ${styles.shimmer}`} />
        </View>
      </View>
    )
  }

  if (type === 'list') {
    return (
      <View className={styles.list}>
        {Array.from({ length: rows }).map((_, index) => (
          <View key={index} className={styles.listItem}>
            <View className={`${styles.listImage} ${styles.shimmer}`} />
            <View className={styles.listContent}>
              <View className={`${styles.listTitle} ${styles.shimmer}`} />
              <View className={`${styles.listDesc} ${styles.shimmer}`} />
            </View>
          </View>
        ))}
      </View>
    )
  }

  if (type === 'detail') {
    return (
      <View className={styles.detail}>
        <View className={`${styles.detailImage} ${styles.shimmer}`} />
        <View className={styles.detailContent}>
          <View className={`${styles.detailTitle} ${styles.shimmer}`} />
          <View className={`${styles.detailLine} ${styles.shimmer}`} />
          <View className={`${styles.detailLine} ${styles.shimmer}`} />
          <View className={`${styles.detailLine} ${styles.shimmer}`} />
        </View>
      </View>
    )
  }

  return null
}
