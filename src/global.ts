export const apiURL = (import.meta as any).env.PROD ? 'https://kongfandong.cn' : '/api';
export const publicPath = (import.meta as any).env.VITE_APP_BUILD_MODE === 'crx' ? './' : '/Dashboard/'
