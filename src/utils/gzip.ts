import { gzip, inflate } from 'pako'

export function zip(data: string) {
  return window.btoa(gzip(data, { to: 'string' }));
}

export function unzip(data: string) {
  const strData = window.atob(data);
  const charData = strData.split('').map((x) => x.charCodeAt(0))
  const binData = new Uint8Array(charData);
  const result = inflate(binData, { to: 'string' });
  return result
}