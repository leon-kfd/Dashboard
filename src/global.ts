export const apiURL = import.meta.env.PROD ? 'https://kongfandong.cn' : '/api';
export const publicPath = import.meta.env.VITE_APP_BUILD_MODE === 'crx'
  ? './'
  : import.meta.env.VITE_APP_BUILD_MODE === 'cdn'
    ? 'https://cdn.kongfandong.cn/howdz/dist/'
    : '/'
