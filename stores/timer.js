import {
    defineStore
} from 'pinia'
import {
    ref,
    computed
} from 'vue'

export const useTimerStore = defineStore('timer', () => {
    const time = ref(1500)
    const running = ref(false)
    let timerId = null

    const angle = computed(() => (time.value / 3600) * 360)
    const secondAngle = computed(() => ((time.value % 60) / 60) * 360)

    function setTimeByAngle(newAngle) {
        if (running.value) return
        const minutes = Math.round((newAngle / 360) * 60)
        time.value = minutes * 60
    }

    // 修改：让 onTickCallback 变为可选
    function start(onTickCallback = null) {
        if (time.value <= 0 || running.value) return

        running.value = true

        timerId = setInterval(() => {
            if (time.value > 0) {
                time.value--
                // 只有传了回调才执行音效
                if (onTickCallback) onTickCallback()
            } else {
                stopTimer()
            }
        }, 1000)
    }

    function stopTimer() {
        running.value = false
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        }
    }

    function reset() {
        stopTimer() // 1. 先停掉计时器
        time.value = 1500 // 2. 重置时间
        // 这里不需要手动改 running，因为 stopTimer 已经改过了
    }

    return {
        time,
        running,
        angle,
        secondAngle,
        setTimeByAngle,
        start,
        stopTimer,
        reset
    }
})