<template>
    <view class="container">
        <DialTimer />
        <SuccessModal :show="timerStore.showModal" @close="timerStore.closeModal" />
    </view>
</template>

<script setup>
    import {
        ref
    } from 'vue'
    import {
        useTodoStore
    } from '@/stores/todo'
    import {
        useTimerStore
    } from '@/stores/timer'
    import DialTimer from '@/components/DialTimer.vue'
    import SuccessModal from '@/components/SuccessModal.vue'

    // 获取 store 实例
    const timerStore = useTimerStore()
    const todoStore = useTodoStore()
    const showModal = ref(false)

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