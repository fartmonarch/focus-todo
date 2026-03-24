<template>
  <view class="dial-container">
    <view
      class="dial card"
      id="dial-node"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTimerStore } from '@/stores/timer'
import { throttle } from '@/utils/throttle'

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

onMounted(() => {
  audioCtx = uni.createInnerAudioContext()
  audioCtx.src = '/static/tick.mp3'

  const query = uni.createSelectorQuery()
  query.select('#dial-node').boundingClientRect(data => {
    if (data) {
      cx = data.left + data.width / 2
      cy = data.top + data.height / 2
    }
  }).exec()
})

onUnmounted(() => {
  if (audioCtx) {
    audioCtx.destroy()
  }
})

const playTick = throttle(() => {
  if (audioCtx) {
    audioCtx.stop()
    audioCtx.play()
  }
}, 50)

const calculateRawAngle = (clientX, clientY) => {
  const dx = clientX - cx
  const dy = clientY - cy
  let rawAngle = Math.atan2(dy, dx) * 180 / Math.PI
  rawAngle += 90 
  if (rawAngle < 0) rawAngle += 360
  return rawAngle
}

const updateDialState = (targetAngle) => {
  let clampedAngle = Math.min(Math.max(targetAngle, 0), 270)
  
  let newTime = Math.floor((clampedAngle / 270) * 60) * 60 
  timerStore.setTimeAndAngle(newTime, clampedAngle)

  if (Math.abs(clampedAngle - lastAudioAngle) >= 5) {
    playTick()
    lastAudioAngle = clampedAngle
  }
}

const onTouchStart = (e) => {
  if (running.value) return
  const touch = e.touches[0]
  prevAngle = calculateRawAngle(touch.clientX, touch.clientY)
}

const onTouchMove = throttle((e) => {
  if (running.value) return
  const touch = e.touches[0]
  
  const target = calculateRawAngle(touch.clientX, touch.clientY)
  
  const dampedAngle = prevAngle + (target - prevAngle) * 0.2
  updateDialState(dampedAngle)
  
  prevAngle = dampedAngle
}, 16)

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
.dial-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx;
}

.dial {
  width: 460rpx;
  height: 460rpx;
  border-radius: 50%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 60rpx;
  background: #ffffff;
  padding: 0; 
  touch-action: none;

  .knob {
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: 50%;
    will-change: transform;

    .indicator {
      width: 12rpx;
      height: 40rpx;
      background: #007aff;
      border-radius: 6rpx;
      position: absolute;
      top: 30rpx;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}

.time-display {
  font-size: 100rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 80rpx;
  font-family: monospace;
}

.controls {
  display: flex;
  gap: 40rpx;

  .btn {
    width: 220rpx;
    height: 90rpx;
    line-height: 90rpx;
    border-radius: 45rpx;
    font-size: 32rpx;
    text-align: center;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
    &::after { border: none; }

    &.primary {
      background: #007aff;
      color: #fff;
    }
    &.warning {
      background: #ff9500;
      color: #fff;
    }
    &.reset {
      background: #fff;
      color: #333;
    }
  }
}
</style>