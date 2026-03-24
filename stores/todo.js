import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTodoStore = defineStore('todo', () => {
  const list = ref(uni.getStorageSync('TODO_LIST') || [])

  const save = () => {
    uni.setStorageSync('TODO_LIST', list.value)
  }

  // 确保这里定义为普通的 function 或 const
  function add(text) {
    if (!text || !text.trim()) return
    list.value.unshift({
      id: Date.now(),
      text: text.trim(),
      completed: false
    })
    save()
  }

  function deleteTodo(id) {
    list.value = list.value.filter(item => item.id !== id)
    save()
  }

  function toggle(id) {
    const item = list.value.find(item => item.id === id)
    if (item) {
      item.completed = !item.completed
      save()
    }
  }

  // 必须在这里显示返回所有方法
  return { 
    list, 
    add, 
    deleteTodo, 
    toggle 
  }
})