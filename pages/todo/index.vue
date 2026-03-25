<template>
  <view class="container">
    <view class="input-section card">
      <input v-model="newTodoText" class="todo-input" placeholder="请输入待办" @confirm="handleAddTodo" />
      <button class="add-btn" @click="handleAddTodo">添加</button>
    </view>

    <view class="list-section">
      <TodoItem v-for="item in todoStore.list" :key="item.id" :item="item" @toggle="todoStore.toggle"
        @delete="todoStore.deleteTodo" />
    </view>
  </view>
</template>

<script setup>
  import {
    ref
  } from 'vue'
  import {
    useTodoStore
  } from '@/stores/todo'
  import TodoItem from '@/components/TodoItem.vue'

  const todoStore = useTodoStore()
  const newTodoText = ref('')

  const handleAddTodo = () => {
    todoStore.add(newTodoText.value)
    newTodoText.value = ''
  }
</script>

<style lang="scss" scoped>
  .container {
    padding: 30rpx;
  }

  .input-section {
    display: flex;
    align-items: center;
    padding: 20rpx 30rpx;

    .todo-input {
      flex: 1;
      height: 70rpx;
      font-size: 32rpx;
    }

    .add-btn {
      margin-left: 20rpx;
      width: 140rpx;
      height: 70rpx;
      line-height: 70rpx;
      font-size: 28rpx;
      background: #007aff;
      color: #fff;
      border-radius: 12rpx;

      &::after {
        border: none;
      }
    }
  }
</style>