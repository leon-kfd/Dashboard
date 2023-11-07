const dataFont: Record<string, IFontData[]> = {
  windows: [
    { cn: '宋体', en: 'SimSun' },
    { cn: '黑体', en: 'SimHei' },
    { cn: '微软雅黑', en: 'Microsoft Yahei' },
    { cn: '微软正黑体', en: 'Microsoft JhengHei' },
    { cn: '楷体', en: 'KaiTi' },
    { cn: '新宋体', en: 'NSimSun' },
    { cn: '仿宋', en: 'FangSong' }],
  'OS X': [
    { cn: '苹方', en: 'PingFang SC' },
    { cn: '华文黑体', en: 'STHeiti' },
    { cn: '华文楷体', en: 'STKaiti' },
    { cn: '华文宋体', en: 'STSong' },
    { cn: '华文仿宋', en: 'STFangsong' },
    { cn: '华文中宋', en: 'STZhongsong' },
    { cn: '华文琥珀', en: 'STHupo' },
    { cn: '华文新魏', en: 'STXinwei' },
    { cn: '华文隶书', en: 'STLiti' },
    { cn: '华文行楷', en: 'STXingkai' },
    { cn: '冬青黑体简', en: 'Hiragino Sans GB' },
    { cn: '兰亭黑-简', en: 'Lantinghei SC' },
    { cn: '翩翩体-简', en: 'Hanzipen SC' },
    { cn: '手札体-简', en: 'Hannotate SC' },
    { cn: '宋体-简', en: 'Songti SC' },
    { cn: '娃娃体-简', en: 'Wawati SC' },
    { cn: '魏碑-简', en: 'Weibei SC' },
    { cn: '行楷-简', en: 'Xingkai SC' },
    { cn: '雅痞-简', en: 'Yapi SC' },
    { cn: '圆体-简', en: 'Yuanti SC' }
  ],
  office: [
    { cn: '幼圆', en: 'YouYuan' },
    { cn: '隶书', en: 'LiSu' },
    { cn: '华文细黑', en: 'STXihei' },
    { cn: '华文楷体', en: 'STKaiti' },
    { cn: '华文宋体', en: 'STSong' },
    { cn: '华文仿宋', en: 'STFangsong' },
    { cn: '华文中宋', en: 'STZhongsong' },
    { cn: '华文彩云', en: 'STCaiyun' },
    { cn: '华文琥珀', en: 'STHupo' },
    { cn: '华文新魏', en: 'STXinwei' },
    { cn: '华文隶书', en: 'STLiti' },
    { cn: '华文行楷', en: 'STXingkai' },
    { cn: '方正舒体', en: 'FZShuTi' },
    { cn: '方正姚体', en: 'FZYaoti' }
  ]
};

const fontList = Object.keys(dataFont).reduce((prev: IFontData[], curr: string) => {
  return [...prev, ...dataFont[curr]]
}, [])

export const isSupportFontFamily = function(f: string) {
  if (typeof f !== 'string') {
    return false
  }
  const h = 'Arial';
  if (f.toLowerCase() === h.toLowerCase()) {
    return true
  }
  const e = 'a';
  const d = 100;
  const a = 100;
  const i = 100;
  const c = document.createElement('canvas');
  const b = c.getContext('2d') as CanvasRenderingContext2D;
  c.width = a;
  c.height = i;
  b.textAlign = 'center';
  b.fillStyle = 'black';
  b.textBaseline = 'middle';
  const g = function(j: string) {
    b.clearRect(0, 0, a, i);
    b.font = d + 'px ' + j + ', ' + h;
    b.fillText(e, a / 2, i / 2);
    const k = b.getImageData(0, 0, a, i).data;
    return [].slice.call(k).filter(function(l) {
      return l !== 0
    });
  };
  return g(h).join('') !== g(f).join('');
};

export async function getSupportFontFamilyList () {
  try {
    // https://font-access-api.glitch.me/
    // Chrome^103 允许授权获取本地字体
    if (window.queryLocalFonts && typeof window.queryLocalFonts === 'function') {
      const fonts = await window.queryLocalFonts()
      if (fonts.length > 0) {
        return fonts.reduce((prev: IFontData[], curr) => {
          // 英文字体很多, 目前仅获取中文字体
          if (/^[\u4E00-\u9FFF\s]+$/.test(curr.fullName)) {
            return [
              ...prev, 
              {
                cn: curr.fullName,
                en: curr.family
              }
            ]
          }
          return prev
        }, [])
      }
    }
  } catch {
    //
  }
  return fontList.filter(item => isSupportFontFamily(item.en))
}
