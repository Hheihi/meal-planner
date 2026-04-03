import Taro from '@tarojs/taro'

// 跳转到菜品详情
export const navigateToDishDetail = (dishId: number): void => {
  Taro.navigateTo({
    url: `/pages/dish/detail/index?id=${dishId}`,
  })
}

// 跳转到菜品列表
export const navigateToDishList = (cuisineId: number, cuisineName: string): void => {
  Taro.navigateTo({
    url: `/pages/cuisine/dishes/index?id=${cuisineId}&name=${encodeURIComponent(cuisineName)}`,
  })
}

// 跳转到搜索页
export const navigateToSearch = (): void => {
  Taro.navigateTo({
    url: '/pages/search/index/index',
  })
}

// 跳转到今日菜单
export const switchToMenu = (): void => {
  Taro.switchTab({
    url: '/pages/menu/today/index',
  })
}

// 跳转到家庭群组
export const navigateToFamily = (): void => {
  Taro.navigateTo({
    url: '/pages/family/index/index',
  })
}

// 跳转到偏好设置
export const navigateToPreferences = (): void => {
  Taro.navigateTo({
    url: '/pages/profile/preferences/index',
  })
}
