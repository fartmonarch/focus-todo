<template>
  <view class="container">
    <DialTimer />
  </view>
</template>

<script setup>
import DialTimer from '@/components/DialTimer.vue'
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