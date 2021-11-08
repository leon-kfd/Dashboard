export default function (position: number) {
  const result = {
    justifyContent: '',
    alignItems: '',
    display: 'flex'
  }
  switch (position) {
    case 1:
      result.justifyContent = 'flex-start'
      result.alignItems = 'flex-start'
      break;
    case 2:
      result.justifyContent = 'center'
      result.alignItems = 'flex-start'
      break;
    case 3:
      result.justifyContent = 'flex-end'
      result.alignItems = 'flex-start'
      break;
    case 4:
      result.justifyContent = 'flex-start'
      result.alignItems = 'center'
      break;
    case 5:
      result.justifyContent = 'center'
      result.alignItems = 'center'
      break;
    case 6:
      result.justifyContent = 'flex-end'
      result.alignItems = 'center'
      break;
    case 7:
      result.justifyContent = 'flex-start'
      result.alignItems = 'flex-end'
      break;
    case 8:
      result.justifyContent = 'center'
      result.alignItems = 'flex-end'
      break;
    case 9:
      result.justifyContent = 'flex-end'
      result.alignItems = 'flex-end'
      break;
  }
  return result
}
