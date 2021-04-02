import { createStore } from 'vuex'
export default createStore({
  state: {
    isLock: false,
    list: JSON.parse(localStorage.getItem('list') || '[]') as any[]
  },
  mutations: {
    updateIsLock(state, value) {
      state.isLock = value
    },
    updateList(state, val) {
      state.list = val
      localStorage.setItem('list', JSON.stringify(state.list))
    },
    addComponentToList(state, value) {
      state.list = [...state.list, value]
      localStorage.setItem('list', JSON.stringify(state.list))
    },
    deleteComponentFromList(state, value) {
      const id = value.id
      const index = state.list.findIndex(item => item.id === id)
      if (~index) {
        const list = JSON.parse(JSON.stringify(state.list))
        list.splice(index, 1)
        state.list = list
        localStorage.setItem('list', JSON.stringify(state.list))
      }
    }
  },
  actions: {
  },
  modules: {
  }
})