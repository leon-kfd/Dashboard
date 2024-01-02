import request from '@/utils/request'
import { unzip } from '@/utils/gzip'
import { useStore } from '@/store'

export async function getPreviewModeDataFromKey(previewKey: string) {
  const { errCode, data } = await request({
    url: '/getImport',
    method: 'post',
    data: { importKey: previewKey }
  })
  if (errCode === 200) {
    const result = unzip(data)
    return JSON.parse(result)
  } else {
    throw new Error('Resolve preview key error')
  }
}

export async function getPreviewModeDataFromRemote(url: string) {
  const result = await fetch(url)
  const json = await result.json()
  return json
}

export async function setPreviewModeData(previewKey: string) {
  let data: any
  if (/^[0-9A-Z]{5}$/.test(previewKey)) {
    data = await getPreviewModeDataFromKey(previewKey)
  } else {
    data = await getPreviewModeDataFromRemote(decodeURIComponent(previewKey))
  }
  if (!data.list || !data.global || !data.affix) {
    throw new Error('数据非法')
  }
  const store = useStore()
  const {
    list,
    affix,
    global,
    showBackgroundEffect,
    showRefreshBtn,
    tabList,
    showTabSwitchBtn,
    enableKeydownSwitchTab,
    backgroundEffectActive
  } = data
  store.updateStates([
    { key: 'tabList', value: tabList },
    { key: 'list', value: list },
    { key: 'affix', value: affix },
    { key: 'showBackgroundEffect', value: showBackgroundEffect },
    { key: 'showRefreshBtn', value: showRefreshBtn },
    { key: 'showTabSwitchBtn', value: showTabSwitchBtn },
    { key: 'enableKeydownSwitchTab', value: enableKeydownSwitchTab },
    { key: 'backgroundEffectActive', value: backgroundEffectActive }
  ])
  store.updateGlobal(global)
}