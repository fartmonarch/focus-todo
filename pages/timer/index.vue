<template>
  <view class="container">
    <DialTimer />
  </view>
</template>

<script setup>
import {DialTimer} from '@/components/DialTimer.vue'
const todoStore = useTodoStore()

const handleAddTodo = () => {
  // 确保 todoStore 是一个 Proxy 对象且包含 add 方法
  console.log('Current Store:', todoStore) 
  todoStore.add(newTodoText.value)
}
</script>

<style lang="scss" scoped>
.container {
  padding-top: 60rpx;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
}
</style>