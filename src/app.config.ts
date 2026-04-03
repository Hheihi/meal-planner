export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/cuisine/list/index',
    'pages/cuisine/dishes/index',
    'pages/dish/detail/index',
    'pages/menu/today/index',
    'pages/record/index/index',
    'pages/profile/index/index',
  ],
  subPackages: [
    // {
    //   root: 'pages/record',
    //   pages: ['detail/index'],
    // },
    {
      root: 'pages/family',
      pages: ['index/index', 'join/index', 'member-menu/index'],
    },
    // {
    //   root: 'pages/profile',
    //   pages: ['preferences/index'],
    // },
    {
      root: 'pages/search',
      pages: ['index/index'],
    },
  ],
  tabBar: {
    color: '#999999',
    selectedColor: '#FF6B35',
    backgroundColor: '#FFFFFF',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/icons/tab-home.png',
        selectedIconPath: 'assets/icons/tab-home-active.png',
      },
      {
        pagePath: 'pages/cuisine/list/index',
        text: '菜系',
        iconPath: 'assets/icons/tab-cuisine.png',
        selectedIconPath: 'assets/icons/tab-cuisine-active.png',
      },
      {
        pagePath: 'pages/menu/today/index',
        text: '菜单',
        iconPath: 'assets/icons/tab-menu.png',
        selectedIconPath: 'assets/icons/tab-menu-active.png',
      },
      {
        pagePath: 'pages/record/index/index',
        text: '记录',
        iconPath: 'assets/icons/tab-record.png',
        selectedIconPath: 'assets/icons/tab-record-active.png',
      },
      {
        pagePath: 'pages/profile/index/index',
        text: '我的',
        iconPath: 'assets/icons/tab-profile.png',
        selectedIconPath: 'assets/icons/tab-profile-active.png',
      },
    ],
  },
  window: {
    navigationBarTitleText: '今日吃什么',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTextStyle: 'black',
    backgroundTextStyle: 'dark',
    enablePullDownRefresh: false,
  },
})
