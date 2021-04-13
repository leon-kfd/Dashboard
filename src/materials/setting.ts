import Empty from './Empty/setting'
import Clock from './Clock/setting'
import Verse from './Verse/setting'
import Search from './Search/setting'
import Collection from './Collection/setting'
import Iframe from './Iframe/setting'

const Setting: Record<string, ComponentSetting> = {
  Empty,
  Clock,
  Verse,
  Search,
  Collection,
  Iframe
}

const baseSetting: Record<string, Pick<ComponentSetting, 'minWidth'>> = {}
Object.keys(Setting).map((key: string) => {
  const { minWidth } = Setting[key]
  baseSetting[key] = {
    minWidth
  }
})

export default Setting;
export { baseSetting };
