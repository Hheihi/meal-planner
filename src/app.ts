import { PropsWithChildren, useEffect } from 'react'
import { useLaunch } from '@tarojs/taro'
import { useAuthStore } from '@/stores/useAuthStore'
import './app.less'

function App({ children }: PropsWithChildren<any>) {
  const login = useAuthStore((s) => s.login)
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  useLaunch(() => {
    console.log('App launched.')
    // 静默登录
    if (!isLoggedIn) {
      login().catch(() => {
        console.log('Silent login failed, user needs to login manually')
      })
    }
  })

  return children
}

export default App
