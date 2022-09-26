import localforage from 'localforage';

export const isSupportIndexDB = localforage.supports(localforage.INDEXEDDB);

export const localImg = localforage.createInstance({ name: 'LocalImg', driver: localforage.INDEXEDDB })

export const localThumbImg = localforage.createInstance({ name: 'localThumbImg', driver: localforage.INDEXEDDB })
