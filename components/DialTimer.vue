<template>
  <view class="dial-container">
    <view
      class="dial card"
      id="dial-node"
      @touchstart="onTouchStart"
      @touchmove.stop.prevent="onTouchMove"
      @touchend="onTouchEnd"
    >
      <view class="knob" :style="{ transform: `rotate(${angle}deg)` }">
        <view class="indicator"></view>
      </view>
    </view>
    
    <view class="time-display">
      {{ formattedTime }}
    </view>

    <view class="controls">
      <button class="btn primary" @click="handleStart" v-if="!running">Start</button>
      <button class="btn warning" @click="handlePause" v-else>Pause</button>
      <button class="btn reset" @click="handleReset">Reset</button>
    </view>
  </view>
</template>

<script setup>
import { computed, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import { useTimerStore } from '@/stores/timer'

const timerStore = useTimerStore()

const angle = computed(() => timerStore.angle)
const time = computed(() => timerStore.time)
const running = computed(() => timerStore.running)

const formattedTime = computed(() => {
  const m = Math.floor(time.value / 60).toString().padStart(2, '0')
  const s = (time.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

let cx = 0
let cy = 0
let prevAngle = 0
let lastAudioAngle = 0
let audioCtx = null

// 核心修复 1：必须获取当前实例，否则 createSelectorQuery 找不到组件内的节点
const instance = getCurrentInstance()

onMounted(() => {
  audioCtx = uni.createInnerAudioContext()
  audioCtx.src = '/static/tick.mp3'

  // 确保 DOM 渲染完毕后获取中心点坐标
  setTimeout(() => {
    const query = uni.createSelectorQuery().in(instance.proxy)
    query.select('#dial-node').boundingClientRect(data => {
      if (data) {
        cx = data.left + data.width / 2
        cy = data.top + data.height / 2
      }
    }).exec()
  }, 100)
})

onUnmounted(() => {
  if (audioCtx) audioCtx.destroy()
})

const playTick = () => {
  if (audioCtx) {
    audioCtx.stop()
    audioCtx.play()
  }
}

// 计算当前触摸点相对于圆心的角度 (12点方向为 0 度)
const calculateRawAngle = (clientX, clientY) => {
  const dx = clientX - cx
  const dy = clientY - cy
  let rawAngle = Math.atan2(dy, dx) * 180 / Math.PI
  rawAngle += 90 // 顺时针旋转90度，使正上方为0度
  if (rawAngle < 0) rawAngle += 360
  return rawAngle
}

const onTouchStart = (e) => {
  if (running.value || cx === 0) return // 如果节点没获取到则拒绝交互
  const touch = e.touches[0]
  prevAngle = calculateRawAngle(touch.clientX, touch.clientY)
}

// 核心修复 2：去掉 JS 节流函数，原生 touchmove 的触发频率足以支撑顺滑拖拽
const onTouchMove = (e) => {
  if (running.value || cx === 0) return
  const touch = e.touches[0]
  
  let targetAngle = calculateRawAngle(touch.clientX, touch.clientY)
  
  // 处理第四象限跨越 0 度的突变问题 (例如 355度 -> 5度)
  if (targetAngle > 270) {
    targetAngle = targetAngle > 315 ? 0 : 270 
  }

  // 阻尼效果
  const dampedAngle = prevAngle + (targetAngle - prevAngle) * 0.2
  let clampedAngle = Math.max(0, Math.min(dampedAngle, 270))
  
  // 映射时间：0~270° -> 0~60分钟 (0~3600秒)
  let newTime = Math.floor((clampedAngle / 270) * 60) * 60 
  timerStore.setTimeAndAngle(newTime, clampedAngle)

  // 物理音效防抖触发 (每移动 5 度触发一次)
  if (Math.abs(clampedAngle - lastAudioAngle) >= 5) {
    playTick()
    lastAudioAngle = clampedAngle
  }
  
  prevAngle = dampedAngle
}

const onTouchEnd = () => {
  if (running.value) return
  prevAngle = angle.value
}

const handleStart = () => timerStore.start()
const handlePause = () => timerStore.pause()
const handleReset = () => {
  timerStore.reset()
  prevAngle = 0
  lastAudioAngle = 0
}
</script>

<style lang="scss" scoped>
/* 样式保持原样 */
.dial-container { display: flex; flex-direction: column; align-items: center; padding: 40rpx; }
.dial {
  width: 460rpx; height: 460rpx; border-radius: 50%; position: relative;
  display: flex; justify-content: center; align-items: center; margin-bottom: 60rpx; background: #ffffff;
  /* 禁止原生浏览器默认动作，双保险 */
  touch-action: none;
  .knob {
    width: 100%; height: 100%; position: absolute; border-radius: 50%; will-change: transform;
    .indicator {
      width: 12rpx; height: 40rpx; background: #007aff; border-radius: 6rpx;
      position: absolute; top: 30rpx; left: 50%; transform: translateX(-50%);
    }
  }
}
.time-display { font-size: 100rpx; font-weight: 600; color: #333; margin-bottom: 80rpx; font-family: monospace; }
.controls {
  display: flex; gap: 40rpx;
  .btn {
    width: 220rpx; height: 90rpx; line-height: 90rpx; border-radius: 45rpx; font-size: 32rpx; text-align: center;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
    &::after { border: none; }
    &.primary { background: #007aff; color: #fff; }
    &.warning { background: #ff9500; color: #fff; }
    &.reset { background: #fff; color: #333; }
  }
}
</style>