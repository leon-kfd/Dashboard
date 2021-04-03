import { createStore } from 'vuex'

const updateLocalList = (list: any) => {
  localStorage.setItem('list', JSON.stringify(list))
}

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
      updateLocalList(state.list)
    },
    addComponent(state, value) {
      state.list = [...state.list, value]
      updateLocalList(state.list)
    },
    editComponent(state, value) {
      const id = value.id
      const index = state.list.findIndex(item => item.id === id)
      if (~index) {
        const list = JSON.parse(JSON.stringify(state.list))
        list[index] = value
        state.list = list
        updateLocalList(state.list)
      }
    },
    deleteComponent(state, value) {
      const id = value.id
      const index = state.list.findIndex(item => item.id === id)
      if (~index) {
        const list = JSON.parse(JSON.stringify(state.list))
        list.splice(index, 1)
        state.list = list
        updateLocalList(state.list)
      }
    }
  },
  actions: {
  },
  getters: {
    getComponentSetting: state => (id: string) => {
      const index = state.list.findIndex(item => item.id === id)
      if (~index) {
        return state.list[index]
      } else {
        throw new Error('Id may be error')
      }
    }
  },
  modules: {
  }
})