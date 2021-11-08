import EmptyImg from '@/assets/imgs/capture/Empty.png'
import ClockImg from '@/assets/imgs/capture/Clock.png'
import VerseImg from '@/assets/imgs/capture/Verse.png'
import SearchImg from '@/assets/imgs/capture/Search.png'
import CollectionImg from '@/assets/imgs/capture/Collection.png'
import IframeImg from '@/assets/imgs/capture/Iframe.png'
import TodoListImg from '@/assets/imgs/capture/TodoList.png'
import WeatherImg from '@/assets/imgs/capture/Weather.png'
import CountDownImg from '@/assets/imgs/capture/CountDown.png'
import JuejinListImg from '@/assets/imgs/capture/JuejinList.png'
import WeiboListImg from '@/assets/imgs/capture/WeiboList.png'
import GithubTrendingImg from '@/assets/imgs/capture/GithubTrending.png'
import DayImg from '@/assets/imgs/capture/Day.png'
import ZhihuListImg from '@/assets/imgs/capture/ZhihuList.png'
import EditorImg from '@/assets/imgs/capture/Editor.png'

export const MATERIAL_LIST_MAP: Record<string, MaterialConstanst> = {
  Empty: {
    label: 'Empty',
    text: '占位区块',
    img: EmptyImg
  },
  Clock: {
    label: 'Clock',
    text: '时钟',
    img: ClockImg
  },
  Verse: {
    label: 'Verse',
    text: '随机古诗',
    img: VerseImg
  },
  Search: {
    label: 'Search',
    text: '搜索栏',
    img: SearchImg
  },
  Collection: {
    label: 'Collection',
    text: '导航收藏页',
    img: CollectionImg
  },
  Iframe: {
    label: 'Iframe',
    text: '外部网站',
    img: IframeImg
  },
  TodoList: {
    label: 'TodoList',
    text: '备忘清单',
    img: TodoListImg
  },
  Weather: {
    label: 'Weather',
    text: '天气',
    img: WeatherImg
  },
  Day: {
    label: 'Day',
    text: '自定义日期格式',
    img: DayImg
  },
  CountDown: {
    label: 'CountDown',
    text: '倒计时',
    img: CountDownImg
  },
  JuejinList: {
    label: 'JuejinList',
    text: '掘金',
    img: JuejinListImg
  },
  WeiboList: {
    label: 'WeiboList',
    text: '微博热搜',
    img: WeiboListImg
  },
  GithubTrending: {
    label: 'GithubTrending',
    text: 'Github趋势',
    img: GithubTrendingImg
  },
  ZhihuList: {
    label: 'ZhihuList',
    text: '知乎热榜',
    img: ZhihuListImg
  },
  Editor: {
    label: 'Editor',
    text: 'Markdown写字板',
    img: EditorImg
  },
  MovieLines: {
    label: 'MovieLines',
    text: '经典电影台词'
  }
}

export const BG_IMG_TYPE_MAP = {
  Nature: '自然',
  People: '人物',
  Architecture: '建筑',
  Technology: '科技',
  Animals: '动物'
}
