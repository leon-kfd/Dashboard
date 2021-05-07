export function lightenDarkenColor(col: string, amt: number) {
  let usePound = false;
  if (col[0] === '#') {
    col = col.slice(1);
    usePound = true;
  }
  const num = parseInt(col, 16);
  let r = (num >> 16) + amt;
  if (r > 255) r = 255;
  else if (r < 0) r = 0;
  let b = ((num >> 8) & 0x00FF) + amt;
  if (b > 255) b = 255;
  else if (b < 0) b = 0;
  let g = (num & 0x0000FF) + amt;
  if (g > 255) g = 255;
  else if (g < 0) g = 0;
  return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
}

export function getColorBrightness(col: string) {
  if (col[0] === '#') {
    col = col.slice(1);
  }
  const num = parseInt(col, 16);
  const r = num >> 16
  const g = num & 0x0000FF
  const b = (num >> 8) & 0x00FF
  const brightness = 0.3 * r + 0.6 * g + 0.1 * b
  // const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000
  return brightness
}
