import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTimerStore = defineStore('timer', () => {
  const time = ref(1500)
  const angle = ref(0)
  const running = ref(false)
  let timerId = null

  // 显式定义方法
  function setTimeAndAngle(newTime, newAngle) {
    time.value = newTime
    angle.value = newAngle
  }

  function start() {
    if (running.value || time.value <= 0) return
    running.value = true
    uni.vibrateShort()

    timerId = setInterval(() => {
      if (time.value > 0) {
        time.value--
      } else {
        stopTimer()
        uni.vibrateLong()
        uni.showToast({ title: '完成！', icon: 'success' })
      }
    }, 1000)
  }

  function stopTimer() {
    running.value = false
    if (timerId) clearInterval(timerId)
  }

  function pause() {
    stopTimer()
  }

  function reset() {
    stopTimer()
    time.value = 1500
    angle.value = 0
  }

  return { 
    time, 
    angle, 
    running, 
    setTimeAndAngle, 
    start, 
    pause, 
    reset 
  }
})