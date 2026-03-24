<template>
  <view 
    class="todo-item card" 
    :class="{ completed: item.completed }"
    @click="onToggle"
  >
    <radio 
      :checked="item.completed" 
      color="#007aff" 
      style="transform:scale(0.8); pointer-events: none;" 
    />
    <text class="text">{{ item.text }}</text>
    <button class="delete-btn" @click.stop="onDelete">Delete</button>
  </view>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['toggle', 'delete'])

const onToggle = () => {
  // 直接通过最外层 view 的点击触发状态反转
  emit('toggle', props.item.id)
}

const onDelete = () => {
  emit('delete', props.item.id)
}
</script>

<style lang="scss" scoped>
.todo-item {
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  cursor: pointer; // 增加可点击暗示

  .text {
    flex: 1;
    margin-left: 10rpx;
    font-size: 32rpx;
    color: #333;
    transition: all 0.3s ease;
  }

  .delete-btn {
    margin: 0;
    padding: 0 20rpx;
    height: 60rpx;
    line-height: 60rpx;
    font-size: 24rpx;
    color: #ff3b30;
    background: transparent;
    &::after { border: none; }
  }

  &.completed {
    .text {
      text-decoration: line-through;
      opacity: 0.5;
    }
  }
}
</style>