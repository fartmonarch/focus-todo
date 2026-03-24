import { defineStore } from 'pinia'

export const useTodoStore = defineStore('todo', {
  state: () => ({
    list: uni.getStorageSync('todos') || []
  }),

  actions: {
    addTodo(title) {
      this.list.push({
        id: Date.now(),
        title,
        completed: false
      })
      this.save()
    },

    toggleTodo(id) {
      const item = this.list.find(i => i.id === id)
      if (item) item.completed = !item.completed
      this.save()
    },

    deleteTodo(id) {
      this.list = this.list.filter(i => i.id !== id)
      this.save()
    },

    save() {
      uni.setStorageSync('todos', this.list)
    }
  }
})