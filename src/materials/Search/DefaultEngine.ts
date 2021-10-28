import BingCN from '@/assets/imgs/icons/bing.svg'
import BaiDu from '@/assets/imgs/icons/baidu.svg'
import Google from '@/assets/imgs/icons/google.svg'
import YouDao from '@/assets/imgs/icons/youdao.svg'
import BingEn from '@/assets/imgs/icons/bing-en.svg'
import Sougou from '@/assets/imgs/icons/sougou.svg'
import Bilibili from '@/assets/imgs/icons/bilibili.svg'
import TaoBao from '@/assets/imgs/icons/taobao.svg'
export const engineList = [
  {
    name: 'Bing-CN',
    link: 'https://cn.bing.com/search?q=',
    iconType: 'local',
    iconPath: BingCN
  },
  {
    name: '百度',
    link: 'https://www.baidu.com/s?wd=',
    iconType: 'local',
    iconPath: BaiDu
  },
  {
    name: 'Google',
    link: 'https://www.google.com/search?q=',
    iconType: 'local',
    iconPath: Google
  },
  {
    name: '有道词典',
    link: 'http://dict.youdao.com/w/',
    iconType: 'local',
    iconPath: YouDao
  }
]
export const backupEngineList = [
  {
    name: 'Bing-EN',
    link: 'https://cn.bing.com/search?ensearch=1&q=',
    iconType: 'local',
    iconPath: BingEn
  },
  {
    name: '搜狗',
    link: 'https://www.sogou.com/tx?query=',
    iconType: 'local',
    iconPath: Sougou
  },
  {
    name: 'Bilibili',
    link: 'https://search.bilibili.com/all?keyword=',
    iconType: 'local',
    iconPath: Bilibili
  },
  {
    name: '淘宝',
    link: 'https://s.taobao.com/search?q=',
    iconType: 'local',
    iconPath: TaoBao
  }
]
