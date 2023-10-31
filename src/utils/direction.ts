enum DirectionEnum {
  SCREEN_CENTER = 0,
  TOP_START = 1,
  TOP_CENTER,
  TOP_END,
  RIGHT_START,
  RIGHT_CENTER,
  RIGHT_END,
  BOTTOM_END,
  BOTTOM_CENTER,
  BOTTOM_START,
  LEFT_END,
  LEFT_CENTER,
  LEFT_START
}

export const directionList: Record<string, any>[] = []
for (const key in DirectionEnum) {
  if (isNaN(key as any)) {
    const wordArr = key.split('_').map(word => {
      const _word = word.toLocaleLowerCase()
      return _word.charAt(0).toUpperCase() + _word.substring(1)
    })
    directionList.push({
      label: wordArr.join(' '),
      value: DirectionEnum[key]
    })
  }
}

export interface PopoverOption {
  width: number,
  height: number,
  offset?: number
}

/**
 * 获取Popover目标信息
 * @param element 来源DOM
 * @param popoverRect popover信息
 * @param direction popover方向
 * @returns [endX, endY, fromX, fromY]
 */
export function getPopoverActivePointByDirection(
  element: HTMLElement | null | undefined,
  popoverRect: PopoverOption,
  direction = DirectionEnum.BOTTOM_CENTER
) {
  const { width, height, top, left } = element ? element.getBoundingClientRect() : {
    width: 0,
    height: 0,
    top: window.innerHeight / 2,
    left: window.innerWidth / 2
  }
  const { width: popoverWidth, height: popoverHeight, offset = 10 } = popoverRect
  const activePointMap = {
    [DirectionEnum.SCREEN_CENTER]: [window.innerWidth / 2 - popoverWidth / 2, window.innerHeight / 2 - popoverHeight / 2],
    [DirectionEnum.TOP_START]: [left, top - popoverHeight - offset],
    [DirectionEnum.TOP_CENTER]: [left + width / 2 - popoverWidth / 2, top - popoverHeight - offset],
    [DirectionEnum.TOP_END]: [left + width - popoverWidth, top - popoverHeight - offset],
    [DirectionEnum.RIGHT_START]: [left + width + offset, top],
    [DirectionEnum.RIGHT_CENTER]: [left + width + offset, top + height / 2 - popoverHeight / 2],
    [DirectionEnum.RIGHT_END]: [left + width + offset, top + height - popoverHeight],
    [DirectionEnum.BOTTOM_END]: [left + width - popoverWidth, top + height + offset],
    [DirectionEnum.BOTTOM_CENTER]: [left + width / 2 - popoverWidth / 2, top + height + offset],
    [DirectionEnum.BOTTOM_START]: [left, top + height + offset],
    [DirectionEnum.LEFT_END]: [left - popoverWidth - offset, top + height - popoverHeight],
    [DirectionEnum.LEFT_CENTER]: [left - popoverWidth - offset, top + height / 2 - popoverHeight / 2],
    [DirectionEnum.LEFT_START]: [left - popoverWidth - offset, top]
  }
  const fromPoint = [left + width / 2, top + height / 2]
  try {
    return [...activePointMap[direction], ...fromPoint]
  } catch {
    return [0, 0, ...fromPoint]
  }
}
