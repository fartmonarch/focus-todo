<template>
  <view class="todo-item card" :class="{ completed: item.completed }">
    <checkbox-group class="checkbox-wrapper" @change="onToggle">
      <checkbox :value="String(item.id)" :checked="item.completed" color="#007aff" style="transform:scale(0.8)" />
    </checkbox-group>
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

  .checkbox-wrapper {
    display: flex;
    align-items: center;
  }

  .text {
    flex: 1;
    margin-left: 20rpx;
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