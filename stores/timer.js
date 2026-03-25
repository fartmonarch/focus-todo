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
    //结束弹窗
    const showModal = ref(false)
    let timerId = null
    // 把音频实例声明在最外层（整个 Store 共享这一个遥控器）
    let alarmCtx = null

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

        // #ifdef MP-WEIXIN || APP-PLUS
        uni.setKeepScreenOn({
            keepScreenOn: true
        }).catch(() => {})
        // #endif

        timerId = setInterval(() => {
            if (time.value > 0) {
                time.value--;
            } else {
                stopTimer(); // 清除定时器
                // 倒计时结束时，触发弹窗，并播放响铃和震动
                showModal.value = true
                playAlarm(); // 执行提醒
            }
        }, 1000);
    }

    function stopTimer() {
        running.value = false
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        }
    }

    function reset() {
        stopTimer() //先停掉计时器
        time.value = 1500 // 重置时间
        // 这里不需要手动改 running，因为 stopTimer 已经改过了
    }

    function playAlarm() {
        // 懒加载：如果播放器还没创建，就创建它（只创建一次）
        if (!alarmCtx) {
            alarmCtx = uni.createInnerAudioContext()
            alarmCtx.src = '/static/success.mp3'
        }

        // 先停止之前的播放，防止重叠
        alarmCtx.stop()

        // 播放，并捕获 H5 下的 Promise 打断报错（静默处理，不让控制台飙红）
        const playPromise = alarmCtx.play()
        if (playPromise && playPromise.catch) {
            playPromise.catch(err => {
                console.warn('音频播放被打断 (H5正常现象):', err)
            })
        }

        uni.vibrateLong().catch(() => {})
    }
    // 🌟 3. 新增一个关闭弹窗的方法
    function closeModal() {
        showModal.value = false
        //用户点击关闭时，用同一个遥控器停止播放
        if (alarmCtx) {
            alarmCtx.stop()
        }
    }
    return {
        time,
        running,
        angle,
        secondAngle,
        setTimeByAngle,
        start,
        stopTimer,
        reset,
        showModal,
        closeModal
    }
})