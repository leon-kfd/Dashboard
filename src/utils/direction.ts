enum DirectionEnum {
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
    directionList.push({
      label: key,
      value: DirectionEnum[key]
    })
  }
}

export interface PopoverOption {
  width: number,
  height: number,
  offset?: number
}
export function getPopoverActivePointByDirection(
  element: HTMLElement,
  popoverRect: PopoverOption,
  direction = DirectionEnum.BOTTOM_CENTER
) {
  const { width, height, top, left } = element.getBoundingClientRect()
  const { width: popoverWidth, height: popoverHeight, offset = 10 } = popoverRect
  const activePointMap = {
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
  return activePointMap[direction] || [0, 0]
}
